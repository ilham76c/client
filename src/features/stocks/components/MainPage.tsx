'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Skeleton, Tab, Tabs } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';

import EmitenSearch from './EmitenSearch';
import OwnershipTab from './OwnershipTab';
import AnnouncementTab from './AnnouncementTab';
import ProfileTab from './ProfileTab';
import PriceTab from './PriceTab';
import InsiderTab from './InsiderTab';
import { useEmitenDetail } from '../hooks/useEmiten';

type TabValue = 'profile' | 'price' | 'ownership' | 'announcements' | 'insider';

const TABS: { value: TabValue; label: string }[] = [
  { value: 'profile', label: 'Profil' },
  { value: 'price', label: 'Harga' },
  { value: 'ownership', label: 'Kepemilikan' },
  { value: 'announcements', label: 'Pengumuman' },
  { value: 'insider', label: 'Aktivitas Insider' },
];

export default function MainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabValue>('profile');
  const [ticker, setTicker] = useState<string | null>(
    searchParams.get('ticker'),
  );

  const { data: emiten, isLoading, isError } = useEmitenDetail(ticker);

  function handleSelect(ticker: string) {
    setTicker(ticker);
    setTab('profile'); // kembali ke tab awal setiap kali ganti emiten
    router.replace(`?ticker=${ticker}`, { scroll: false });
  }

  return (
    <div className='space-y-6'>
      {/* SEARCH — selalu tampil di atas, konsisten dengan halaman investor */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-1'>
          <div className='w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0'>
            <TrendingUpIcon sx={{ fontSize: 18, color: '#34d399' }} />
          </div>
          <h1 className='text-xl font-semibold text-white'>Analisis Saham</h1>
        </div>

        <p className='text-sm text-gray-500 mb-5 ml-11'>
          Cari nama perusahaan atau kode saham untuk melihat profil, harga,
          kepemilikan, pengumuman, dan aktivitas insider.
        </p>

        <EmitenSearch onSelect={handleSelect} />
      </div>

      {/* DATA — hanya render kalau sudah ada ticker terpilih */}
      {ticker && (
        <div className='space-y-5'>
          {/* HEADER TICKER */}
          <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
            {isLoading ? (
              <>
                <Skeleton
                  width={100}
                  height={36}
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                />
                <Skeleton
                  width={220}
                  height={20}
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                />
              </>
            ) : isError ? (
              <p className='text-red-400 text-sm'>
                Emiten dengan ticker &quot;{ticker}&quot; tidak ditemukan.
              </p>
            ) : (
              <>
                <h2 className='text-2xl font-bold text-white leading-tight truncate'>
                  {emiten?.ticker}
                </h2>
                <p className='text-sm text-gray-500 truncate'>{emiten?.name}</p>
              </>
            )}
          </div>

          {/* TABS */}
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            sx={{
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              minHeight: 40,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 500,
                color: '#9ca3af',
                minHeight: 40,
                px: 2,
              },
              '& .Mui-selected': {
                color: '#34d399 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#34d399',
                height: 2,
              },
            }}
          >
            {TABS.map((t) => (
              <Tab key={t.value} value={t.value} label={t.label} />
            ))}
          </Tabs>

          {/* CONTENT */}
          <Box>
            {tab === 'profile' && <ProfileTab ticker={ticker} />}
            {tab === 'price' && <PriceTab ticker={ticker} />}
            {tab === 'ownership' && <OwnershipTab ticker={ticker} />}
            {tab === 'announcements' && <AnnouncementTab ticker={ticker} />}
            {tab === 'insider' && <InsiderTab ticker={ticker} />}
          </Box>
        </div>
      )}

      {/* EMPTY STATE */}
      {!ticker && (
        <div className='bg-gray-900 border border-gray-800 rounded-xl px-12 py-16 text-center'>
          <div className='w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4'>
            <SearchIcon sx={{ fontSize: 22, color: '#34d399' }} />
          </div>

          <h3 className='text-base font-medium text-gray-300 mb-1.5'>
            Belum ada emiten yang dipilih
          </h3>

          <p className='text-sm text-gray-500 max-w-sm mx-auto'>
            Cari nama perusahaan atau kode saham di kolom pencarian di atas
            untuk melihat detail lengkapnya.
          </p>
        </div>
      )}
    </div>
  );
}
