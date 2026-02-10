// features/ownership/components/OwnershipFilterBar.tsx
export default function OwnershipFilterBar() {
  return (
    <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow">
      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="Ticker (ex: AADI)"
      />

      <select className="border rounded px-3 py-2 text-sm">
        <option>All Investors</option>
        <option>Pengendali</option>
        <option>Institusi</option>
        <option>Publik</option>
      </select>

      <input type="date" className="border rounded px-3 py-2 text-sm" />
      <input type="date" className="border rounded px-3 py-2 text-sm" />

      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
        Apply
      </button>
    </div>
  );
}
