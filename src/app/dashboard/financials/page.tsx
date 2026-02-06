import FinancialTable from "@/features/financials/components/FinancialTable";

export default async function FinancialPage() {
  const res = await fetch("http://localhost:8000/api/financials", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">Financial Reports</h1>
      <FinancialTable data={data} />
    </section>
  );
}
