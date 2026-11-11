'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import AuthLayout from './AuthLayout';

type View = 'waiting' | 'verifying' | 'success' | 'error';

type Notice = {
  kind: 'success' | 'error';
  text: string;
} | null;

const RESEND_COOLDOWN_SECONDS = 60;
const REDIRECT_DELAY_MS = 1500;

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Hanya izinkan path internal agar callbackUrl tidak dapat
 * mengarahkan user ke situs eksternal.
 */
function getSafeCallbackUrl(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  try {
    const url = new URL(value, window.location.origin);

    if (url.origin !== window.location.origin) {
      return '/';
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}

function StatusIcon({ view }: { view: View }) {
  const base = 'mb-5 flex h-12 w-12 items-center justify-center rounded-full';

  if (view === 'verifying') {
    return (
      <div className={`${base} bg-gray-800`} aria-hidden='true'>
        <span className='h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent' />
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className={`${base} bg-red-500/10`} aria-hidden='true'>
        <svg
          className='h-6 w-6 text-red-400'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='10' />
          <path d='M12 8v4m0 4h.01' />
        </svg>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className={`${base} bg-emerald-500/10`} aria-hidden='true'>
        <CheckCircleIcon sx={{ fontSize: 24, color: '#34d399' }} />
      </div>
    );
  }

  return (
    <div className={`${base} bg-emerald-500/10`} aria-hidden='true'>
      <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 24, color: '#34d399' }} />
    </div>
  );
}

export default function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const queryEmail = searchParams.get('email')?.trim() ?? '';
  const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'));

  const { data: session, status, update } = useSession();

  const isAuthenticated = status === 'authenticated';
  const sessionEmail = session?.user?.email ?? '';
  const email = queryEmail || sessionEmail;

  const [view, setView] = useState<View>(token ? 'verifying' : 'waiting');
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const verifyStartedRef = useRef(false);
  const syncedRef = useRef(false);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Polling hanya berjalan pada halaman menunggu verifikasi.
    if (token || view !== 'waiting') return;

    const statusToken = sessionStorage.getItem('registration_status_token');

    if (!statusToken) return;

    const controller = new AbortController();
    let checking = false;

    const checkStatus = async () => {
      if (checking) return;
      checking = true;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/verification-status`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${statusToken}`,
            },
            signal: controller.signal,
            cache: 'no-store',
          },
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            clearInterval(interval);
          }
          return;
        }

        const data: { verified: boolean } = await response.json();

        if (data.verified === true) {
          clearInterval(interval);
          sessionStorage.removeItem('registration_status_token');
          setView('success');
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Verification status check failed:', error);
        }
      } finally {
        checking = false;
      }
    };

    const interval = setInterval(checkStatus, 3000);

    void checkStatus();

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [token, view]);

  /**
   * Verifikasi token dari link email.
   * Ref mencegah request ganda ketika React StrictMode
   * menjalankan effect lebih dari sekali.
   */
  useEffect(() => {
    if (!token || verifyStartedRef.current) {
      return;
    }

    verifyStartedRef.current = true;

    async function verifyEmail() {
      try {
        const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

        const response = await fetch(`${AUTH_API_URL}/auth/verify-email`, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setView('success');
          return;
        }

        let message: string;

        if (response.status === 410) {
          message =
            'Tautan verifikasi sudah kedaluwarsa. Silakan kirim ulang email verifikasi.';
        } else if (response.status === 400 || response.status === 404) {
          message =
            'Tautan verifikasi tidak valid atau sudah digunakan. Silakan kirim ulang email verifikasi.';
        } else {
          message = 'Verifikasi belum berhasil. Coba lagi beberapa saat lagi.';
        }

        setErrorMessage(message);
        setView('error');
      } catch {
        setErrorMessage(
          'Tidak dapat terhubung ke server. Periksa koneksi internetmu.',
        );
        setView('error');
      }
    }

    void verifyEmail();
  }, [token]);

  /**
   * Setelah verifikasi berhasil:
   * - User yang sudah login: refresh session lalu redirect.
   * - User yang belum login: tampilkan tombol login.
   */
  useEffect(() => {
    if (view !== 'success' || !isAuthenticated || syncedRef.current) {
      return;
    }

    syncedRef.current = true;

    update()
      .catch(() => null)
      .finally(() => {
        redirectTimerRef.current = setTimeout(() => {
          router.replace(callbackUrl);
          router.refresh();
        }, REDIRECT_DELAY_MS);
      });
  }, [view, isAuthenticated, update, router, callbackUrl]);

  /**
   * Jika halaman dibuka tanpa token dan user sudah terverifikasi,
   * arahkan ke halaman tujuan.
   *
   * User yang belum login tetap boleh melihat halaman waiting.
   */
  useEffect(() => {
    if (token || status !== 'authenticated') {
      return;
    }

    const emailVerified = session?.user?.emailVerified;

    if (emailVerified === true) {
      router.replace(callbackUrl);
    }
  }, [token, status, session, router, callbackUrl]);

  /**
   * Cleanup timer ketika komponen dilepas.
   */
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  /**
   * Countdown tombol resend.
   */
  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  /**
   * Kirim ulang email verifikasi.
   *
   * Request menggunakan email, sehingga user yang baru register
   * tidak harus login terlebih dahulu.
   */
  const handleResend = useCallback(async () => {
    if (!email || sending || cooldown > 0) {
      return;
    }

    setNotice(null);
    setSending(true);

    try {
      const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

      const response = await fetch(`${AUTH_API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 429) {
        const retryAfter = Number(response.headers.get('Retry-After'));

        setCooldown(retryAfter > 0 ? retryAfter : RESEND_COOLDOWN_SECONDS);

        setNotice({
          kind: 'error',
          text: 'Terlalu sering mengirim email. Tunggu sebentar sebelum mencoba lagi.',
        });

        return;
      }

      if (!response.ok) {
        setNotice({
          kind: 'error',
          text: 'Permintaan belum berhasil. Coba lagi beberapa saat lagi.',
        });

        return;
      }

      setCooldown(RESEND_COOLDOWN_SECONDS);

      setNotice({
        kind: 'success',
        text: 'Jika akun dapat diverifikasi, email verifikasi akan dikirim. Periksa inbox kamu.',
      });
    } catch {
      setNotice({
        kind: 'error',
        text: 'Tidak dapat terhubung ke server. Periksa koneksi internetmu.',
      });
    } finally {
      setSending(false);
    }
  }, [email, sending, cooldown]);

  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  const loginButton = (label: string) => (
    <Link
      href={loginHref}
      className='block w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-medium text-gray-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60'
    >
      {label}
    </Link>
  );

  const resendControls = (
    <div className='flex flex-col gap-2'>
      <button
        type='button'
        onClick={handleResend}
        disabled={!email || sending || cooldown > 0}
        className='w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-600 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:pointer-events-none disabled:opacity-50'
      >
        {sending
          ? 'Mengirim...'
          : cooldown > 0
            ? `Kirim ulang dalam ${cooldown} detik`
            : 'Kirim ulang email verifikasi'}
      </button>

      <p
        role='status'
        aria-live='polite'
        className={`min-h-5 text-xs ${
          notice?.kind === 'error' ? 'text-red-400' : 'text-emerald-400'
        }`}
      >
        {notice?.text}
      </p>
    </div>
  );

  const copy = {
    waiting: {
      title: 'Cek email kamu',
      subtitle: 'Kami mengirim tautan verifikasi untuk mengaktifkan akunmu.',
    },
    verifying: {
      title: 'Memverifikasi email',
      subtitle: 'Tunggu sebentar, kami sedang memeriksa tautanmu.',
    },
    success: {
      title: 'Email terverifikasi',
      subtitle: isAuthenticated
        ? 'Mengalihkan kamu ke EquityLens...'
        : 'Akunmu sudah aktif. Sekarang kamu bisa masuk.',
    },
    error: {
      title: 'Tautan verifikasi bermasalah',
      subtitle: errorMessage,
    },
  }[view];

  const showSignOut =
    isAuthenticated && (view === 'waiting' || view === 'error');

  return (
    <AuthLayout
      title={copy.title}
      subtitle={copy.subtitle}
      footer={
        showSignOut ? (
          <>
            Bukan akunmu?{' '}
            <button
              type='button'
              onClick={() => signOut({ callbackUrl: '/login' })}
              className='font-medium text-emerald-400 hover:text-emerald-300'
            >
              Keluar
            </button>
          </>
        ) : null
      }
    >
      <StatusIcon view={view} />

      {view === 'waiting' && (
        <>
          <div className='mb-5 rounded-lg border border-gray-800 bg-gray-900 px-3.5 py-3'>
            <p className='mb-0.5 text-xs text-gray-500'>Dikirim ke</p>

            <p className='break-all text-sm font-medium text-white'>
              {email || 'Email tidak tersedia'}
            </p>
          </div>

          {resendControls}

          <p className='mt-4 text-xs text-gray-600'>
            Belum menerima email? Periksa folder spam atau promosi, lalu tunggu
            beberapa menit.
          </p>

          {!isAuthenticated && (
            <p className='mt-5 text-center text-sm text-gray-500'>
              Sudah memverifikasi email?{' '}
              <Link
                href={loginHref}
                className='font-medium text-emerald-400 hover:text-emerald-300'
              >
                Masuk
              </Link>
            </p>
          )}
        </>
      )}

      {view === 'verifying' && (
        <p className='text-center text-sm text-gray-500'>
          Mohon jangan tutup halaman ini.
        </p>
      )}

      {view === 'success' && !isAuthenticated && (
        <div className='mt-2'>{loginButton('Masuk ke EquityLens')}</div>
      )}

      {view === 'error' && (
        <>
          {resendControls}

          <div className='mt-4'>
            {isAuthenticated
              ? loginButton('Kembali ke aplikasi')
              : loginButton('Masuk')}
          </div>
        </>
      )}
    </AuthLayout>
  );
}
