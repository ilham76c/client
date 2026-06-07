import OwnershipClient from '@/features/ownership/components/OwnershipClient';

export default function DashboardOwnershipPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ownership Overview</h1>
      <OwnershipClient />
    </div>
  );
}
