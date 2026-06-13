'use client';

import { useState } from 'react';

import EmitenSearch from './EmitenSearch';
import OwnershipTab from './OwnershipTab';

import { Box, Tab, Tabs } from '@mui/material';

export default function OwnershipClient() {
  const [tab, setTab] = useState<'ownership' | 'announcements' | 'timeline'>(
    'ownership',
  );
  const [ticker, setTicker] = useState('SSIA');

  return (
    <>
      <div className='mb-5 flex gap-4 items-center flex-wrap'>
        <EmitenSearch onSelect={setTicker} />

        <h1 className='text-3xl font-bold mb-2'>
          {/* {data?.ticker} – {data?.name} */}
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
        <Tab value='ownership' label='Ownership' />

        <Tab value='announcements' label='Announcements' />

        <Tab value='timeline' label='Timeline' />
      </Tabs>

      <Box>
        {tab === 'ownership' && <OwnershipTab ticker={ticker} />}

        {tab === 'announcements' && <div>Announcements</div>}

        {tab === 'timeline' && <div>Timeline Content</div>}
      </Box>
    </>
  );
}
