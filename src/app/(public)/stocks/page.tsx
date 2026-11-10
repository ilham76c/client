
import { Suspense } from 'react';
import { MainPage } from '@/features/stocks';

export default function StocksPage() {
  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>
      <Suspense
        fallback={
          <div className='text-sm text-gray-500'>
            Loading stocks...
          </div>
        }
      >
        <MainPage />
      </Suspense>
    </div>
  );
}
