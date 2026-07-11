'use client';

import { useEffect, useState } from 'react';
import {
  useAnnouncements,
  useAnnouncementAnalysis,
} from '../hooks/useAnnouncement';
import AnnouncementList from './AnnouncementList';
import AnnouncementResult from './AnnouncementResult';
import { LoadingSpinner } from '@/components/ui';
import EmitenSearch from '@/features/stocks/components/EmitenSearch';

export default function MainPage() {
  const [ticker, setTicker] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(null);
  }, [ticker]);

  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
  } = useAnnouncements(ticker);
  const { data: analysis, isLoading: detailLoading } =
    useAnnouncementAnalysis(selectedId);

  const items = listData?.announcements ?? [];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start'>
      {/* LEFT — list panel */}
      <div className='space-y-4'>
        <EmitenSearch onSelect={setTicker} />

        {listLoading && <LoadingSpinner />}

        {listError && (
          <p className='text-red-400 text-sm'>Gagal memuat data pengumuman.</p>
        )}

        {!listLoading && (
          <AnnouncementList
            items={items}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
            }}
          />
        )}
      </div>

      {/* RIGHT — detail panel */}
      <div>
        {!selectedId && (
          <div className='hidden lg:flex items-center justify-center h-64 rounded-2xl border border-dashed border-gray-800 text-gray-600 text-sm'>
            Pilih pengumuman untuk melihat detail analisis
          </div>
        )}

        {detailLoading && <LoadingSpinner />}

        {analysis && !detailLoading && (
          <AnnouncementResult
            analysis={analysis}
            onReset={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}
