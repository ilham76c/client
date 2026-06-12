'use client';

import { useState } from 'react';
import { useAnnouncements, useAnnouncementDetail } from '../hooks/useAnnouncementAnalysis';
import AnnouncementList from './AnnouncementList';
import AnnouncementResult from './AnnouncementResult';
import { LoadingSpinner } from '@/components/ui';
import EmitenSearch from '@/features/ownership/components/EmitenSearch';

export default function AnnouncementClient() {
  const [ticker, setTicker] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: listData, isLoading: listLoading, error: listError } = useAnnouncements(ticker);
  const { data: detailData, isLoading: detailLoading } = useAnnouncementDetail(selectedId);

  const items = listData?.data ?? [];
  const analysis = detailData?.data ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

      {/* LEFT — list panel */}
      <div className="space-y-4">
        <EmitenSearch onSelect={setTicker} />

        {listLoading && <LoadingSpinner />}

        {listError && (
          <p className="text-red-400 text-sm">Gagal memuat data pengumuman.</p>
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
          <div className="hidden lg:flex items-center justify-center h-64 rounded-2xl border border-dashed border-gray-800 text-gray-600 text-sm">
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
