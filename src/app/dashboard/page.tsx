// src/app/dashboard/page.tsx
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <ul className="space-y-3">
        <li>
          <Link
            href="/dashboard/ownership"
            className="flex items-center gap-2 hover:underline"
          >
            📈 <span>Ownership Overview</span>
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard/financials"
            className="flex items-center gap-2 hover:underline"
          >
            📊 <span>Financial Overview</span>
          </Link>
        </li>
      </ul>
    </main>
  );
}
