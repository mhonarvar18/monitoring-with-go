import * as XLSX from "xlsx";

export interface DownloadTableExcelOptions<T = any> {
  columns: { header: string; key: string }[];
  data: T[];
  fileName?: string;
}

/**
 * Exports data as an Excel (.xlsx) file.
 */
export function downloadTableExcel<T>({
  columns,
  data,
  fileName = "report.xlsx",
}: DownloadTableExcelOptions<T>) {
  // Create an array of arrays: [header row, ...data rows]
  const header = columns.map(col => col.header);
  const rows = data.map(row => columns.map(col => row[col.key] ?? "—"));

  // Build worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Download
  XLSX.writeFile(workbook, fileName, { compression: true });
}
