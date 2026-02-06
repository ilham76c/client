import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

export default function FinancialTable({ data }: { data: any[] }) {
  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "period", header: "Period" },
      { accessorKey: "revenue", header: "Revenue" },
      { accessorKey: "eps", header: "EPS" },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="border w-full">
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border p-2">
                {cell.getValue() as string}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
