import { pdf } from "@react-pdf/renderer";
import { TablePdfDocument } from "./TablePdfDocumnet";

export async function downloadTablePdf({
  columns,
  data,
  title,
  iconUrl,
  footerCenterText,
  signText,
  fileName = "report.pdf",
}) {
  const doc = (
    <TablePdfDocument
      columns={columns}
      data={data}
      title={title}
      iconUrl={iconUrl}
      footerCenterText={footerCenterText}
      signText={signText}
    />
  );
  const asPdf = pdf(); // Just call pdf() with no arguments
  asPdf.updateContainer(doc);
  const blob = await asPdf.toBlob();
  // download as file
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
