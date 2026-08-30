'use client';

import Image from 'next/image';
import { Skeleton } from '@mui/material';
import { useEmitenProfile } from '../hooks/useEmiten';
import { formatDate } from '@/lib/utils/formatters';

interface InfoRowProps {
  label: string;
  value?: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className='flex justify-between gap-4 py-2.5 border-b border-gray-800 last:border-0'>
      <span className='text-sm text-gray-500 shrink-0'>{label}</span>
      <span className='text-sm text-white text-right break-words'>
        {value && value.trim() !== '' ? value : '—'}
      </span>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-xl p-5 ${className ?? ''}`}
    >
      <h2 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

function normalizeLogoUrl(logoUrl: string) {
  const base = 'https://idx.co.id';
  return logoUrl.startsWith('/') ? `${base}${logoUrl}` : `${base}/${logoUrl}`;
}

interface Props {
  ticker: string;
}

export default function ProfileTab({ ticker }: Props) {
  const { data: profile, isLoading, error } = useEmitenProfile(ticker);

  if (isLoading) {
    return (
      <div className='space-y-5'>
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-6 flex gap-5 items-center'>
          <Skeleton
            variant='rounded'
            width={72}
            height={72}
            sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
          />
          <div className='flex-1'>
            <Skeleton
              width={220}
              height={28}
              sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
            />
            <Skeleton
              width={160}
              height={20}
              sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <Skeleton
            variant='rounded'
            height={220}
            sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
          />
          <Skeleton
            variant='rounded'
            height={220}
            sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
          />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm'>
        Gagal memuat profil perusahaan.
      </div>
    );
  }

  const websiteUrl = profile.website?.startsWith('http')
    ? profile.website
    : `https://${profile.website}`;

  return (
    <div className='space-y-5'>
      {/* Header: logo + name + sector chip */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6 flex gap-5 items-center flex-wrap'>
        <div className='w-18 h-18 rounded-xl bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center'>
          {profile.logo_url ? (
            <Image
              src={normalizeLogoUrl(profile.logo_url)}
              alt={`Logo ${profile.ticker}`}
              width={72}
              height={72}
              className='object-contain'
              unoptimized
            />
          ) : (
            <span className='text-gray-500 text-xs'>Tanpa Logo</span>
          )}
        </div>

        <div className='min-w-0'>
          <div className='flex items-center gap-3 flex-wrap mb-1'>
            <h1 className='text-2xl font-bold text-white'>{profile.ticker}</h1>
            {profile.listing_board && (
              <span className='text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full'>
                Papan {profile.listing_board}
              </span>
            )}
          </div>
          <p className='text-gray-400'>{profile.name}</p>
          <p className='text-gray-600 text-xs mt-1'>{profile.main_business}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 items-start'>
        {/* Sector & Classification */}
        <InfoCard title='Klasifikasi Industri'>
          <InfoRow label='Sektor' value={profile.sector} />
          <InfoRow label='Sub Sektor' value={profile.sub_sector} />
          <InfoRow label='Industri' value={profile.industry} />
          <InfoRow label='Sub Industri' value={profile.sub_industry} />
        </InfoCard>

        {/* Listing Info */}
        <InfoCard title='Informasi Pencatatan'>
          <InfoRow label='Papan Pencatatan' value={profile.listing_board} />
          <InfoRow
            label='Tanggal Listing'
            value={
              profile.listing_date
                ? formatDate(profile.listing_date, 'DD MMMM YYYY')
                : undefined
            }
          />
          <InfoRow label='Biro Administrasi Efek' value={profile.bae} />
          <InfoRow label='NPWP' value={profile.npwp} />
        </InfoCard>

        {/* Contact Info */}
        <InfoCard title='Kontak Perusahaan'>
          <InfoRow label='Alamat' value={profile.address} />
          <InfoRow label='Telepon' value={profile.phone} />
          <InfoRow label='Fax' value={profile.fax} />
          <InfoRow label='Email' value={profile.email} />
        </InfoCard>

        {/* Website */}
        <InfoCard title='Tautan'>
          {profile.website && profile.website.trim() !== '' ? (
            <a
              href={websiteUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block text-emerald-400 hover:text-emerald-300 text-sm underline break-all pt-1'
            >
              {profile.website}
            </a>
          ) : (
            <p className='text-sm text-gray-500 pt-1'>—</p>
          )}
        </InfoCard>
      </div>
    </div>
  );
}
