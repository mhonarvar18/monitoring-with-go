import type { ColumnDef } from "@tanstack/react-table";
import type { TableColumn } from "../services/TablePdfDocumnet";

export function mapColumnDefsToTableColumns<T>(
  columns: ColumnDef<T, any>[]
): TableColumn<T>[] {
  return columns.map((col) => {
    let key: string;

    if (
      "accessorKey" in col &&
      typeof col.accessorKey === "string" &&
      col.accessorKey
    ) {
      key = col.accessorKey;
    } else if ("id" in col && col.id) {
      key = String(col.id);
    } else {
      throw new Error("ColumnDef must have accessorKey or id");
    }

    return {
      header: typeof col.header === "string" ? col.header : key,
      key,
    };
  });
}

export function mapDataToPdfRows<T>(
  data: T[],
  pdfCols: TableColumn<T>[]
): any[] {
  return data.map((row) => {
    const result: Record<string, any> = {};
    pdfCols.forEach((col) => {
      if (typeof col.accessor === "function") {
        result[col.key] = col.accessor(row, data.indexOf(row));
      } else {
        result[col.key] = (row as any)[col.key] ?? "—";
      }
    });
    return result;
  });
}
