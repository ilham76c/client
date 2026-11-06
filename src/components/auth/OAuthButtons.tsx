'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

// Tambah/ganti provider di sini saja (id harus sama dengan di konfigurasi
// next-auth). MUI juga punya FacebookIcon, AppleIcon, MicrosoftIcon.
const PROVIDERS = [
  { id: 'google', label: 'Google', icon: GoogleIcon },
  { id: 'github', label: 'GitHub', icon: GitHubIcon },
];

export default function OAuthButtons({ callbackUrl }: { callbackUrl: string }) {
  const [pending, setPending] = useState<string | null>(null);

  async function handleClick(providerId: string) {
    setPending(providerId);
    try {
      await signIn(providerId, { callbackUrl });
    } catch {
      setPending(null); // kembalikan tombol kalau pengalihan gagal
    }
  }

  return (
    <div className='flex flex-col gap-2.5'>
      {PROVIDERS.map(({ id, label, icon: Icon }) => {
        const isPending = pending === id;
        return (
          <button
            key={id}
            type='button'
            onClick={() => handleClick(id)}
            disabled={pending !== null}
            className='flex items-center justify-center gap-2.5 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-600 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none'
          >
            {isPending ? (
              <span className='h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent' />
            ) : (
              <Icon sx={{ fontSize: 18 }} />
            )}
            {isPending ? 'Mengalihkan...' : `Lanjutkan dengan ${label}`}
          </button>
        );
      })}

      <div className='flex items-center gap-3 mt-3'>
        <span className='h-px flex-1 bg-gray-800' />
        <span className='text-xs text-gray-600'>atau dengan email</span>
        <span className='h-px flex-1 bg-gray-800' />
      </div>
    </div>
  );
}
