'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import AuthLayout from './AuthLayout';
import AuthField from './AuthField';
import OAuthButtons from './OAuthButtons';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const MIN_PASSWORD_LENGTH = 8;

type Errors = Partial<
  Record<
    | 'firstName'
    | 'lastName'
    | 'username'
    | 'email'
    | 'password'
    | 'confirm'
    | 'terms',
    string
  >
>;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: Errors = {};
    if (!firstName.trim()) next.firstName = 'Isi nama depan.';
    if (!USERNAME_PATTERN.test(username)) {
      next.username =
        'Username 3–20 karakter, hanya huruf kecil, angka, dan garis bawah (_).';
    }
    if (!EMAIL_PATTERN.test(email.trim()))
      next.email = 'Format email belum benar.';
    if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`;
    }
    if (confirm !== password)
      next.confirm = 'Konfirmasi kata sandi tidak sama.';
    if (!acceptedTerms)
      next.terms =
        'Setujui disclaimer dan kebijakan privasi untuk melanjutkan.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          firstname: firstName.trim(),
          lastname: lastName.trim() || '-',
          email: email.trim(),
          password,
        }),
      });

      if (res.status === 409) {
        // Backend perlu menyebutkan field mana yang bentrok. Asumsi: body
        // berisi { field: 'username' | 'email' }, atau detail yang memuat
        // kata "username". Kalau tidak ada keduanya, dianggap email.
        const body = await res.json().catch(() => null);
        const conflict =
          body?.field ??
          (String(body?.detail ?? '')
            .toLowerCase()
            .includes('username')
            ? 'username'
            : 'email');

        setErrors(
          conflict === 'username'
            ? { username: 'Username ini sudah dipakai. Coba username lain.' }
            : {
                email:
                  'Email ini sudah terdaftar. Masuk, atau gunakan email lain.',
              },
        );
        return;
      }
      if (!res.ok) {
        setFormError(
          'Pendaftaran belum berhasil. Coba lagi beberapa saat lagi.',
        );
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch {
      setFormError(
        'Tidak dapat terhubung ke server. Periksa koneksi internetmu.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title='Buat akun EquityLens'
      subtitle='Gratis. Mulai telusuri kepemilikan dan aktivitas insider emiten.'
      footer={
        <>
          Sudah punya akun?{' '}
          <Link
            href='/login'
            className='font-medium text-emerald-400 hover:text-emerald-300'
          >
            Masuk
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

        <div className='grid grid-cols-2 gap-3'>
          <AuthField
            id='firstName'
            label='Nama depan'
            value={firstName}
            onChange={setFirstName}
            error={errors.firstName}
            autoComplete='given-name'
          />
          <AuthField
            id='lastName'
            label='Nama belakang (opsional)'
            value={lastName}
            onChange={setLastName}
            error={errors.lastName}
            autoComplete='family-name'
          />
        </div>

        <AuthField
          id='username'
          label='Username'
          value={username}
          onChange={(v) => setUsername(v.toLowerCase().replace(/\s/g, ''))}
          error={errors.username}
          hint='3–20 karakter: huruf kecil, angka, dan garis bawah (_).'
          placeholder='mis. budi_investor'
          autoComplete='username'
        />

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

        <AuthField
          id='password'
          label='Kata sandi'
          type='password'
          value={password}
          onChange={setPassword}
          error={errors.password}
          hint={`Minimal ${MIN_PASSWORD_LENGTH} karakter.`}
          autoComplete='new-password'
        />

        <AuthField
          id='confirm'
          label='Ulangi kata sandi'
          type='password'
          value={confirm}
          onChange={setConfirm}
          error={errors.confirm}
          autoComplete='new-password'
        />

        <div>
          <label className='flex items-start gap-2.5 text-sm text-gray-400 cursor-pointer'>
            <input
              type='checkbox'
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              aria-invalid={!!errors.terms}
              className='mt-0.5 h-4 w-4 shrink-0 accent-emerald-500'
            />
            <span>
              Saya menyetujui{' '}
              <Link
                href='/disclaimer'
                className='text-emerald-400 hover:text-emerald-300 underline'
              >
                disclaimer
              </Link>{' '}
              dan{' '}
              <Link
                href='/privacy'
                className='text-emerald-400 hover:text-emerald-300 underline'
              >
                kebijakan privasi
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p className='mt-1.5 text-xs text-red-400'>{errors.terms}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='mt-1 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-gray-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:opacity-60 disabled:pointer-events-none'
        >
          {loading ? 'Membuat akun...' : 'Buat akun'}
        </button>
      </form>
    </AuthLayout>
  );
}
