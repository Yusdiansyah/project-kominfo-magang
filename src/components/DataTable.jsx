import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

function UnemploymentTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['unemployment'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/unemployment_rate');
      return response.data.data;
    },
  });

  const columns = useMemo(
    () => [
      { accessorKey: 'province_name', header: 'Provinsi' },
      { accessorKey: 'year', header: 'Tahun' },
      { accessorKey: 'period', header: 'Bulan' },
      { accessorKey: 'value', header: 'Nilai (%)' },
    ],
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} style={{ padding: '8px', textAlign: 'left' }}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} style={{ padding: '8px' }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UnemploymentTable;
