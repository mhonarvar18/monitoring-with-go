import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, Table, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import type { MyColumnDef } from "../Columns/EventColumns";

interface Props<T> {
  data: T[];
  columns: MyColumnDef<T>[];
  isLoading?: boolean;
  className?: string;
  initialVisibility?: VisibilityState;
  bodyHeight?: string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string | number | null; // new prop
  table?: Table<T>;
  onHeaderClick?: (column: ColumnDef<T>, headerId: string) => void;
  meta?: any;
}

interface Identifiable {
  id: number | string;
}

export default function EventTable<T extends Identifiable>({
  data,
  table: externalTable,
  columns,
  isLoading = false,
  className = "",
  initialVisibility,
  bodyHeight,
  onRowClick,
  selectedRowId,
  onHeaderClick,
  meta,
}: Props<T>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialVisibility || {}
  );

  const table =
    externalTable ||
    useReactTable<T>({
      data,
      columns,
      state: {
        columnVisibility,
      },
      onColumnVisibilityChange: setColumnVisibility,
      getCoreRowModel: getCoreRowModel(),
      meta,
    });

  return (
    <>
      {/* ── HEADERS ──────────────────────────────────────── */}
      <div className="w-full sticky top-0 z-10">
        <table className="w-full table-fixed">
          <thead className="w-full bg-gray-400 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="table w-full table-fixed">
                {headerGroup.headers.map((header, index) => {
                  const colDef = header.column.columnDef as MyColumnDef<T>;
                  return (
                    <th
                      key={index}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        maxWidth: header.getSize(),
                      }}
                      onClick={() => {
                        if (colDef.filterable && onHeaderClick) {
                          onHeaderClick(header.column.columnDef, header.id);
                        }
                      }}
                      className={`h-10 ${
                        colDef.filterable ? `cursor-pointer` : ``
                      }`}
                    >
                      <div className="flex justify-center items-center gap-2 lg:text-[10pt] 3xl:text-[11pt] text-nowrap">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
        </table>
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className={`w-full ${bodyHeight} overflow-y-auto`}>
        <table className="w-full table-fixed">
          <tbody className="w-full">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center flex justify-center items-center w-full h-full"
                >
                  <LoadingSpinner />
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, rowIndex) => {
                const isSelected =
                  selectedRowId != null &&
                  String(selectedRowId) === String(row.original.id);

                const rowClassName = `
  ${isSelected ? "bg-[#09a1a4] text-black" : "odd:bg-gray-200 even:bg-gray-300"}
  hover:bg-[#aee2e3] transition-all cursor-pointer 
`;
                return (
                  <tr
                    key={row.original.id ?? rowIndex}
                    onClick={() => onRowClick?.(row.original)}
                    className={rowClassName}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <td
                        key={`${row.original.id ?? rowIndex}_${
                          cell.column.id
                        }_${cellIndex}`}
                        className="text-center h-10 lg:text-[10pt] 3xl:text-[11pt] text-nowrap"
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
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="w-full table-fixed h-full flex justify-center items-center py-2"
                >
                  موردی یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
