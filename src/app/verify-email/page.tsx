'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:8080';

type Status = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Memverifikasi email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token verifikasi tidak ditemukan.');
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? 'Verifikasi email gagal.');
        }

        setStatus('success');
        setMessage('Email berhasil diverifikasi. Sekarang kamu bisa masuk.');
      } catch (error) {
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat verifikasi email.',
        );
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div className='mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center'>
      <h1 className='text-2xl font-semibold text-white'>Verifikasi Email</h1>

      <p className='mt-4 text-sm text-gray-400'>{message}</p>

      {status === 'loading' && (
        <p className='mt-4 text-sm text-emerald-400'>Mohon tunggu...</p>
      )}

      {status === 'success' && (
        <Link
          href='/login'
          className='mt-6 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-gray-950'
        >
          Masuk sekarang
        </Link>
      )}

      {status === 'error' && (
        <Link
          href='/login'
          className='mt-6 text-sm text-emerald-400 hover:text-emerald-300'
        >
          Kembali ke halaman login
        </Link>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className='p-10 text-center'>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
