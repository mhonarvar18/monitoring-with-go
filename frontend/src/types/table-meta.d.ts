import type { TableMeta } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends object> {
    openConfirmationModal?: (eventIds: string[] | number[]) => void;
  }
}
