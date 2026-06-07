'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { formatNumber } from '@/lib/utils/formatters';

export interface FinancialRow {
  period: string;
  revenue: number;
  eps: number;
}

const columns: ColumnDef<FinancialRow>[] = [
  {
    accessorKey: 'period',
    header: 'Period',
  },
  {
    accessorKey: 'revenue',
    header: 'Revenue',
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: 'eps',
    header: 'EPS',
    cell: ({ getValue }) => formatNumber(getValue<number>(), 2),
  },
];

interface Props {
  data: FinancialRow[];
}

export default function FinancialTable({ data }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 text-gray-400 border-b border-gray-800">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="text-left px-4 py-3">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-800/40">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-white">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
