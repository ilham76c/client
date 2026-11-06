'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import AuthLayout from './AuthLayout';
import AuthField from './AuthField';
import OAuthButtons from './OAuthButtons';

// next-auth mengirim kode error lewat ?error=... — dipetakan ke instruksi
// yang jelas, bukan kode mentah.
const AUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    'Email ini sudah terdaftar dengan metode masuk lain. Masuk dengan metode yang kamu pakai saat mendaftar.',
  OAuthCallback: 'Proses masuk dengan penyedia tersebut gagal. Coba lagi.',
  AccessDenied:
    'Akses ditolak. Pastikan kamu mengizinkan EquityLens membaca email akunmu.',
  CredentialsSignin: 'Email atau kata sandi salah. Periksa lalu coba lagi.',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(
    urlError
      ? (AUTH_ERRORS[urlError] ?? 'Terjadi kesalahan saat masuk. Coba lagi.')
      : null,
  );
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim()))
      next.email = 'Format email belum benar.';
    if (!password) next.password = 'Isi kata sandi.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: email.trim(),
      password,
      callbackUrl,
    });
    setLoading(false);

    if (result?.error) {
      setFormError(AUTH_ERRORS[result.error] ?? AUTH_ERRORS.CredentialsSignin);
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <AuthLayout
      title='Masuk ke EquityLens'
      subtitle='Lanjutkan analisis kepemilikan dan pergerakan saham kamu.'
      footer={
        <>
          Belum punya akun?{' '}
          <Link
            href='/register'
            className='font-medium text-emerald-400 hover:text-emerald-300'
          >
            Buat akun
          </Link>
        </>
      }
    >
      <OAuthButtons callbackUrl={callbackUrl} />

      <form
        onSubmit={handleSubmit}
        noValidate
        className='flex flex-col gap-4 mt-5'
      >
        {formError && (
          <div
            role='alert'
            className='rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400'
          >
            {formError}
          </div>
        )}

        <AuthField
          id='email'
          label='Email'
          type='email'
          value={email}
          onChange={setEmail}
          error={errors.email}
          placeholder='nama@email.com'
          autoComplete='email'
        />

        <div>
          <AuthField
            id='password'
            label='Kata sandi'
            type='password'
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete='current-password'
          />
          <div className='mt-2 text-right'>
            <Link
              href='/forgot-password'
              className='text-xs text-gray-500 hover:text-gray-300'
            >
              Lupa kata sandi?
            </Link>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='mt-1 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-gray-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:opacity-60 disabled:pointer-events-none'
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </AuthLayout>
  );
}
