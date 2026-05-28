'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getOwnershipAnnouncements,
  uploadOwnershipAnnouncement,
} from '@/lib/api/ownership';
import { formatDate } from '@/lib/utils/date';

type Ownership = {
  announcement_uid: string;
  announcement_title: string;
  announcement_name: string;
  announcement_url: string;
  published_at: string;
};

export default function OwnershipUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data, isLoading } = useQuery({
    queryKey: ['ownership', currentPage, itemsPerPage],

    queryFn: () =>
      getOwnershipAnnouncements({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      }),
  });

  const list: Ownership[] =
    (data?.announcements as unknown as Ownership[]) ?? [];

  if (isLoading) {
    return <p className='text-gray-400'>Loading...</p>;
  }

  const startRow = (currentPage - 1) * itemsPerPage;

  // pagination logic
  const totalPages = Math.ceil((data?.total ?? 0) / itemsPerPage);
  const currentData = list;
  const MAX_VISIBLE_PAGES = 6;

  let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));

  let endPage = startPage + MAX_VISIBLE_PAGES - 1;

  if (endPage > totalPages) {
    endPage = totalPages;

    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }

  const visiblePages = Array.from(
    {
      length: endPage - startPage + 1,
    },
    (_, i) => startPage + i,
  );
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const blob = await uploadOwnershipAnnouncement(file); // ✅ langsung blob

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'ownership-announcement.csv';
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Upload gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#020617] text-white px-6 py-10'>
      <div className='max-w-6xl mx-auto'>
        {/* Upload Section */}
        <div className='bg-[#0B1220] border border-white/10 rounded-2xl p-6 mb-8'>
          <h2 className='text-lg font-medium mb-4'>Upload Ownership PDF</h2>

          <div className='flex gap-4'>
            <input
              type='file'
              accept='application/pdf'
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className='w-full text-sm text-gray-400'
            />

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className='bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl disabled:opacity-50'
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className='bg-[#0B1220] border border-white/10 rounded-2xl p-6'>
          <h2 className='text-lg font-medium mb-4'>Announcements Files</h2>

          <div className='overflow-x-auto'>
            <div className='flex items-center gap-2 py-1'>
              <span className='text-sm text-gray-400'>Show</span>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));

                  setCurrentPage(1);
                }}
                className='bg-[#111827]
                border border-white/10
                rounded-lg
                px-2 py-1
                text-sm'
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <span className='text-sm text-gray-400'>rows</span>
            </div>
            <table className='w-full text-sm'>
              <thead className='text-gray-400 border-b border-white/10'>
                <tr>
                  <th className='text-left py-3 px-2'>No</th>
                  <th className='text-left py-3'>Title</th>
                  <th className='text-left py-3'>Filename</th>
                  <th className='text-left py-3'>Published At</th>
                  <th className='text-left py-3 px-2'>URL</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => (
                  <tr
                    key={item.announcement_uid}
                    className='border-b border-white/5 hover:bg-white/5'
                  >
                    <td className='py-3 px-2'>{startRow + index + 1}.</td>
                    <td className='py-3'>{item.announcement_title}</td>
                    <td className='py-3'>{item.announcement_name}</td>
                    <td className='py-3'>{formatDate(item.published_at)}</td>
                    <td className='py-3 px-2'>
                      <a
                        className='text-blue-300'
                        href={item.announcement_url}
                        target='_blank'
                      >
                        File
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between mt-6'>
            {/* Info */}
            <p className='text-sm text-gray-400'>
              Showing {currentData.length} of {data?.total ?? 0} items
            </p>

            {/* Controls */}
            <div className='flex gap-2 items-center'>
              {/* First */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className='px-3 py-1 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30'
              >
                First
              </button>

              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className='px-3 py-1 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30'
              >
                Prev
              </button>

              {/* Page Numbers */}
              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600'
                      : 'border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className='px-3 py-1 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30'
              >
                Next
              </button>

              {/* Last */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className='px-3 py-1 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30'
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
