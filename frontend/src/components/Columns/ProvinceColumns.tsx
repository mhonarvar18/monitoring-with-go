import type { ColumnDef } from "@tanstack/react-table";
import type { Location } from "../../hooks/useLocationsByType";


export const provinceColumns: ColumnDef<Location>[] = [
  {
    header: "نام استان",
    accessorKey: "label",
    size: 50
  },
];
