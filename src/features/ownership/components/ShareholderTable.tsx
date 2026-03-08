export default function ShareholderTable({
  ticker,
}: {
  ticker: string;
}) {

  const shareholders = [
    { name: "Bank Central Asia", pct: 47.5 },
    { name: "Foreign Investors", pct: 32.1 },
    { name: "Public", pct: 20.4 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

      <h2 className="mb-6 font-semibold">
        Top Shareholders
      </h2>

      <table className="w-full text-sm">

        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="text-left pb-3">Shareholder</th>
            <th className="text-right pb-3">Ownership</th>
          </tr>
        </thead>

        <tbody>

          {shareholders.map((s, i) => (
            <tr key={i} className="border-b border-gray-800">

              <td className="py-3">
                {s.name}
              </td>

              <td className="text-right">
                {s.pct}%
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}