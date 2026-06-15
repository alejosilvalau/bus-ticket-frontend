import type { ReactNode } from 'react';
import Spinner from './Spinner';

export interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: (row: T) => ReactNode;
}

export default function DataTable<T extends { id: number }>({ columns, data, loading, emptyMessage = 'Sin resultados', actions }: DataTableProps<T>) {
  if (loading) return <Spinner />;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th key={col.header} className={`px-4 py-3 text-left font-medium text-gray-600 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right font-medium text-gray-600">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.header} className={`px-4 py-3 ${col.className || ''}`}>
                    {col.accessor(row)}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
