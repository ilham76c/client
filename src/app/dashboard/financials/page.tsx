import FinancialTable, { FinancialRow } from '@/features/financials/components/FinancialTable';
import { env } from '@/lib/config/environment';

export default async function FinancialPage() {
  let data: FinancialRow[] = [];

  try {
    const res = await fetch(`${env.API_BASE_URL}/api/financials`, { cache: 'no-store' });
    if (res.ok) {
      data = await res.json();
    }
  } catch {
    // silently fall through to empty state
  }

  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4 text-white">Financial Reports</h1>
      {data.length === 0 ? (
        <p className="text-gray-500">No financial data available.</p>
      ) : (
        <FinancialTable data={data} />
      )}
    </section>
  );
}
