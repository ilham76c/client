'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOwnershipAnnouncements } from '@/lib/api/ownership';
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
  const itemsPerPage = 5;

  const { data, isLoading } = useQuery({
    queryKey: ['ownership'],
    queryFn: getOwnershipAnnouncements,
  });

  const list: Ownership[] =
    (data?.announcements as unknown as Ownership[]) ?? [];

  if (isLoading) {
    return <p className='text-gray-400'>Loading...</p>;
  }

  // pagination logic
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = list.slice(startIndex, startIndex + itemsPerPage);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
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
            <table className='w-full text-sm'>
              <thead className='text-gray-400 border-b border-white/10'>
                <tr>
                  <th className='text-left py-3 px-2'>No</th>
                  <th className='text-left py-3'>Title</th>
                  <th className='text-left py-3'>Filename</th>
                  <th className='text-left py-3 px-2'>URL</th>
                  <th className='text-left py-3'>Published At</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => (
                  <tr
                    key={item.announcement_uid}
                    className='border-b border-white/5 hover:bg-white/5'
                  >
                    <td className='py-3 px-2'>{startIndex + index + 1}.</td>
                    <td className='py-3'>{item.announcement_title}</td>
                    <td className='py-3'>{item.announcement_name}</td>
                    <td className='py-3 px-2'>
                      <a
                        className='text-blue-300'
                        href={item.announcement_url}
                        target='_blank'
                      >
                        File
                      </a>
                    </td>
                    <td className='py-3'>{formatDate(item.published_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between mt-6'>
            {/* Info */}
            <p className='text-sm text-gray-400'>
              Page {currentPage} of {totalPages}
            </p>

            {/* Controls */}
            <div className='flex gap-2'>
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className='px-3 py-1 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30'
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-blue-600'
                      : 'border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className='px-3 py-1 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30'
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
