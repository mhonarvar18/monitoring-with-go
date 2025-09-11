import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import vazirmatnFont from "/fonts/Vazirmatn-Regular.ttf";
import { useRef } from "react";

Font.register({
  family: "Vazirmatn",
  src: vazirmatnFont,
  fontStyle: "normal",
  fontWeight: "normal",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontFamily: "Vazirmatn",
    direction: "rtl",
    padding: 12,
    fontSize: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // not space-between!
    marginBottom: 4,
    marginTop: 0,
    minHeight: 40,
  },
  logo: {
    width: 48,
    height: 48,
    marginLeft: 8, // small margin
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  timestamp: {
    minWidth: 72,
    textAlign: "left",
    fontSize: 10,
  },
  table: {
    width: "100%",
    marginVertical: 0,
  },
  tableRow: {
    flexDirection: "row-reverse",
    minHeight: 16,
  },
  tableHeader: {
    backgroundColor: "#e6e6e6",
    fontWeight: "bold",
    fontSize: 10,
    padding: 4,
    textAlign: "center",
    border: "1pt solid #888",
    flex: 1, // <-- stays
    minWidth: 0, // <-- prevent overflow if too many columns
    overflow: "hidden",
  },
  tableCell: {
    padding: 3,
    fontSize: 8,
    border: "1pt solid #ccc",
    textAlign: "center",
    flex: 1, // <-- stays
    minWidth: 0,
    overflow: "hidden",
  },
  stripedRow: {
    backgroundColor: "#f8f9fb", // Light gray for striped effect
  },
  footer: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 8,
    fontSize: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#555",
  },
});

export type TableColumn<T = any> = {
  header: string;
  key: string;
  accessor?: (row: T, idx: number) => any;
};

interface TablePdfDocumentProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  title: string;
  iconUrl?: string;
  footerCenterText?: string;
  signText?: string;
  printDate?: Date;
}

export function TablePdfDocument<T = any>({
  columns,
  data,
  title,
  iconUrl,
  footerCenterText = "متن ثابت پابرگ",
  signText = "امضا",
  printDate,
}: TablePdfDocumentProps<T>) {
  const now = printDate ?? new Date();
  const timestamp = now.toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  function displayCell(val) {
    if (
      val === undefined ||
      val === null ||
      (typeof val === "string" && val.trim() === "") ||
      (typeof val === "object" && !Array.isArray(val))
    ) {
      return "—";
    }
    return String(val);
  }
  function getCellValue(row: T, column: TableColumn<T>, rowIndex: number) {
    // console.log(`Processing row ${rowIndex}, column ${column.key}`); // Debug log
    // console.log('Row data:', row); // Debug log
    
    // If accessor function exists, use it
    if (column.accessor && typeof column.accessor === 'function') {
      try {
        const value = column.accessor(row, rowIndex);
        // console.log(`Accessor result for ${column.key}:`, value); // Debug log
        return value;
      } catch (error) {
        // console.error(`Error in accessor for ${column.key}:`, error);
        return "";
      }
    }
    
    // Fallback to direct key access
    const value = row[column.key];
    // console.log(`Direct key access for ${column.key}:`, value); // Debug log
    return value;
  }
  const columnFlexArr = [0.6, 1, 1, 1.5, 1, 1, 1.5, 1, 1.5, 1.2, 1];

  const loggedOnceRef = useRef(false);
  if (!loggedOnceRef.current) {
    const first = data?.[0];
    if (first) {
      console.groupCollapsed("[PDF DEBUG] First row");
      console.log("Row[0] =", first);

      const whyDash = (v: unknown) => {
        if (v === undefined) return "undefined";
        if (v === null) return "null";
        if (typeof v === "string" && v.trim() === "") return "empty-string";
        if (typeof v === "object" && !Array.isArray(v)) return "object";
        return "ok";
      };

      columns.forEach((col, i) => {
        let accVal: any = undefined, accErr: string | undefined;
        if (typeof col.accessor === "function") {
          try { accVal = col.accessor(first, 0); }
          catch (e: any) { accErr = e?.message || String(e); }
        }
        const directVal: any = (first as any)[col.key];
        const chosen = accVal !== undefined ? accVal : directVal;

        console.table([{
          idx: i,
          header: col.header,
          key: col.key,
          accessorVal: accVal,
          accessorType: typeof accVal,
          accessorError: accErr ?? "",
          directVal,
          directType: typeof directVal,
          chosenVal: chosen,
          chosenType: typeof chosen,
          displayOutcome: (function(){
            if (
              chosen === undefined || chosen === null ||
              (typeof chosen === "string" && chosen.trim() === "") ||
              (typeof chosen === "object" && !Array.isArray(chosen))
            ) return "— (by displayCell)";
            return String(chosen);
          })(),
          reason: whyDash(chosen)
        }]);
      });

      console.groupEnd();
      loggedOnceRef.current = true;
    }
  }

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.timestamp}>{timestamp}</Text>
          <Text style={styles.title}>{title}</Text>
          {iconUrl && <Image src={iconUrl} style={styles.logo} />}
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow} fixed>
            {columns.map((col, i) => (
              <Text style={styles.tableHeader} key={i}>
                {col.header}
              </Text>
            ))}
          </View>
          {data.map((row, rowIdx) => (
            <View
              style={
                rowIdx % 2 === 0
                  ? { ...styles.tableRow, ...styles.stripedRow }
                  : styles.tableRow
              }
              key={rowIdx}
            >
              {columns.map((col, colIdx) => (
                <Text style={styles.tableCell} key={colIdx}>
                  {displayCell(getCellValue(row, col, rowIdx))}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text
            render={({ pageNumber, totalPages }) =>
              `صفحه ${pageNumber} از ${totalPages}`
            }
            fixed
          />
          <Text>{footerCenterText}</Text>
          <Text>{signText}</Text>
        </View>
      </Page>
    </Document>
  );
}
