'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { OwnershipChange } from '../types';
import { useState } from 'react';

type Props = {
  data: OwnershipChange[];
};

export default function OwnershipTable({ data }: Props) {
  const [sorting, setSorting] = useState([]);

  const columns: ColumnDef<OwnershipChange>[] = [
    { accessorKey: 'ownership_date', header: 'Date' },
    { accessorKey: 'investor_name', header: 'Investor' },
    { accessorKey: 'investor_type', header: 'Type' },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ getValue }) => {
        const v = getValue<string>();
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium
              ${
                v === 'BUY'
                  ? 'bg-green-100 text-green-700'
                  : v === 'SELL'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-600'
              }`}
          >
            {v}
          </span>
        );
      },
    },
    {
      accessorKey: 'shares_change',
      header: 'Change',
      cell: ({ getValue }) => {
        const v = getValue<number>();
        return (
          <span
            className={`font-medium ${
              v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : ''
            }`}
          >
            {v?.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: 'shares',
      header: 'Shares After',
      cell: ({ getValue }) => getValue<number>()?.toLocaleString(),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='bg-white rounded-lg shadow overflow-x-auto'>
      <table className='min-w-full text-sm'>
        <thead className='bg-slate-50'>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className='px-4 py-3 text-left cursor-pointer'
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className='border-t'>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='px-4 py-2'>
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
