export function getPdfColumns(columnsConfig) {
  return columnsConfig.map((col) => ({
    header: col.header,
    key: col.key,
  }));
}

export function getPdfRows(events, columnsConfig) {
  return events.map((row, idx) => {
    const flatRow = {};
    columnsConfig.forEach((col) => {
      flatRow[col.key] =
        typeof col.accessor === "function"
          ? col.accessor(row, idx)
          : row[col.key] ?? "—";
    });
    return flatRow;
  });
}
