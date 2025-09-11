import ReactModal from "react-modal";
import Button from "../Button";
import { MdOutlineFileDownload } from "react-icons/md";
import type { TableColumn } from "../../services/TablePdfDocumnet";
import { downloadTablePdf } from "../../services/pdfExport";
import { useState } from "react";
import { downloadTableExcel } from "../../services/downloadTableExcel.service";
import { getPdfColumns, getPdfRows } from "../../utils/PdfUtils";

ReactModal.setAppElement("#root");

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pdfData?: any[];
  pdfColumns?: TableColumn[];
  pdfTitle?: string;
  iconUrl?: string;
  onPdfExport?: () => Promise<any[]>;
  onExcelExport?: () => Promise<any[]>;
}

const ExportFileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pdfColumns,
  pdfData,
  pdfTitle,
  iconUrl,
  onPdfExport,
  onExcelExport,
}) => {
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const handlePdfExport = async () => {
    setPdfLoading(true);
    try {
      let dataToExport = pdfData;
      if (onPdfExport) {
        dataToExport = await onPdfExport();
      }
      await downloadTablePdf({
        columns: pdfColumns,
        data: dataToExport,
        title: pdfTitle,
        iconUrl: iconUrl ?? "/kesh.png",
        footerCenterText: "تنظیم و توسعه توسط شرکت پاژالکترونیک",
        signText: ":امضا",
        fileName: `${pdfTitle || "export"}.pdf`,
      });
      onClose();
    } catch (err) {
      console.error("Error exporting PDF:", err);
    } finally {
      setPdfLoading(false);
    }
  };
  const handleExcelExport = async () => {
    setExcelLoading(true);
    try {
      let dataToExport = pdfData;

      // If onExcelExport function is provided, fetch data dynamically
      if (onExcelExport) {
        dataToExport = await onExcelExport(); // <== must return processed rows
      }

      downloadTableExcel({
        columns: getPdfColumns(pdfColumns), // getPdfColumns(exportBranchColumns)
        data: getPdfRows(dataToExport, pdfColumns), // getPdfRows(exportBranchData, exportBranchColumns)
        fileName: `${pdfTitle || "export"}.xlsx`,
      });

      onClose();
    } catch (err) {
      console.error("Error exporting Excel:", err);
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white rounded-[15px] 2xl:pt-4 2xl:pb-4 px-4 w-[26%] h-auto font-[iransans]"
        overlayClassName="modal-overlay-class fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div
          className="w-full h-full flex flex-col justify-start items-center gap-3"
          dir="rtl"
        >
          <h2 className="text-lg font-medium">
            فرمت فایل دریافتی خود را انتخاب کنید:
          </h2>
          <hr className="w-full bg-gray-800" />
          <div className="w-full h-full flex justify-between items-center gap-3">
            <Button
              onClick={handlePdfExport}
              disabled={pdfLoading}
              className="w-1/2 py-3 bg-btns text-white flex justify-center items-center gap-2 hover:bg-transparent hover:text-[#09a1a4] transition-all hover:border-[#09a1a4]"
            >
              <span>
                {pdfLoading ? "در حال تولید PDF..." : "دریافت بصورت PDF"}
              </span>
              <MdOutlineFileDownload size={24} />
            </Button>
            <Button
              onClick={handleExcelExport}
              disabled={excelLoading}
              className="w-1/2 py-3 bg-btns text-white flex justify-center items-center gap-2 hover:bg-transparent hover:text-[#09a1a4] transition-all hover:border-[#09a1a4]"
            >
              <span>
                {excelLoading ? "در حال تولید Excel..." : "دریافت بصورت Excel"}
              </span>
              <MdOutlineFileDownload size={24} />
            </Button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default ExportFileModal;
