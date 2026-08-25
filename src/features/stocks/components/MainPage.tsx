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

export default function MainPage() {
  const [tab, setTab] = useState<TabValue>('profile');
  const [ticker, setTicker] = useState('KPIG');

  const { data: emiten, isLoading } = useEmitenDetail(ticker);

  return (
    <>
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

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{
          mb: 3,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Tab value='profile' label='Profile' />
        <Tab value='price' label='Price' />
        <Tab value='ownership' label='Ownership' />
        <Tab value='announcements' label='Announcements' />
        <Tab value='insider' label='Insider' />
      </Tabs>

      <Box>
        {tab === 'profile' && <ProfileTab ticker={ticker} />}
        {tab === 'price' && <PriceTab ticker={ticker} />}
        {tab === 'ownership' && <OwnershipTab ticker={ticker} />}
        {tab === 'announcements' && <AnnouncementTab ticker={ticker} />}
        {tab === 'insider' && <InsiderTab ticker={ticker} />}
      </Box>
    </>
  );
}
