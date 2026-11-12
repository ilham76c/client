import { Suspense } from 'react';
import VerifyEmailView from '@/components/auth/VerifyEmailView';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <span className='h-6 w-6 animate-spin rounded-full border-2 border-gray-500 border-t-transparent' />
        </div>
      }
    >
      <VerifyEmailView />
    </Suspense>
  );
}
