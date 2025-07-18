import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

// Mock data for demonstration
const data = [
  { name: 'Canoeing Basics', area: 'Waterfront', duration: '1h', status: 'Approved' },
  { name: 'Arts & Crafts', area: 'Art Cabin', duration: '45m', status: 'Pending' },
  { name: 'Archery 101', area: 'Archery Range', duration: '1h', status: 'Approved' },
  { name: 'Nature Hike', area: 'Woods', duration: '1.5h', status: 'Pending' },
];

const columns: ColumnDef<typeof data[0]>[] = [
  { header: 'Program Name', accessorKey: 'name' },
  { header: 'Activity Area', accessorKey: 'area' },
  { header: 'Duration', accessorKey: 'duration' },
  { header: 'Status', accessorKey: 'status' },
];

const ProgramBankTable: React.FC = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div style={{ overflowX: 'auto', marginTop: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
        <thead style={{ background: '#2b6cb0', color: 'white' }}>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ padding: '10px 12px', textAlign: 'left' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ padding: '10px 12px' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramBankTable; 