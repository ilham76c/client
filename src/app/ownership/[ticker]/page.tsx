import OwnershipClient from '@/features/ownership/components/OwnershipClient';

export default async function OwnershipPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;

  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>
      <OwnershipClient ticker={ticker} />
    </div>
  );
}
