'use client';

import { useState } from 'react';

import EmitenSearch from './EmitenSearch';
import OwnershipTab from './OwnershipTab';
import AnnouncementTab from './AnnouncementTab';
import ProfileTab from './ProfileTab';
import PriceTab from './PriceTab';
import InsiderTab from './InsiderTab';
import { useEmitenDetail } from '../hooks/useEmiten';

import { Box, Skeleton, Tab, Tabs } from '@mui/material';

type TabValue = 'profile' | 'price' | 'ownership' | 'announcements' | 'insider';

const TABS: { value: TabValue; label: string }[] = [
  { value: 'profile', label: 'Profil' },
  { value: 'price', label: 'Harga' },
  { value: 'ownership', label: 'Kepemilikan' },
  { value: 'announcements', label: 'Pengumuman' },
  { value: 'insider', label: 'Aktivitas Insider' },
];

export default function MainPage() {
  const [tab, setTab] = useState<TabValue>('profile');
  const [ticker, setTicker] = useState('KPIG');

  const { data: emiten, isLoading } = useEmitenDetail(ticker);

  return (
    <div className='space-y-5'>
      <div className='mb-4 flex flex-col gap-5 items-start flex-wrap'>
        <EmitenSearch onSelect={setTicker} />

        <h1 className='text-3xl font-bold'>
          {isLoading ? (
            <Skeleton width={220} />
          ) : (
            `${emiten?.ticker} – ${emiten?.name}`
          )}
        </h1>
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
  );
}
