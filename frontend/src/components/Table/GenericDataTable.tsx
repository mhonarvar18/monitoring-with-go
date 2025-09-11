import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";

interface Props<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  className?: string;
  initialVisibility?: VisibilityState;
  bodyHeight?: string;
}

/**
 * Now: the outmost div is a flex-col container (100% height).
 * The header stays sticky at the top, and the body flex-grows + scrolls.
 */
export default function GenericDataTable<T>({
  data,
  columns,
  isLoading = false,
  className = "",
  initialVisibility,
  bodyHeight,
}: Props<T>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialVisibility || {}
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden ${className}`}>
      {/* ── HEADERS ──────────────────────────────────────── */}
      <div className="w-full">
        <table className="w-full text-sm text-right text-black" style={{ tableLayout: "fixed" }}>
          <thead className="sticky top-0 bg-gray-400 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 whitespace-nowrap text-center border-b"
                    style={{
                      width: header.getSize(),
                      minWidth: header.getSize(),
                      maxWidth: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className={`w-full ${bodyHeight} overflow-y-auto`}>
        <table className="w-full text-sm text-right text-black">
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="odd:bg-gray-200 even:bg-gray-300
    hover:bg-gray-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 whitespace-nowrap text-center"
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  موردی یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
