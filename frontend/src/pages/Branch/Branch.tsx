import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLocationsByType,
  type Location,
} from "../../hooks/useLocationsByType";
import ProvinceCities from "./ProvinceCities";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { MdOutlineFileUpload, MdOutlineFileDownload } from "react-icons/md";
import { useBranchCrud } from "../../hooks/useBranchCrud";
import type {
  BranchInput,
  LocationObject,
} from "../../services/branchCrud.service";
import FormModal from "../../components/Modals/FormModal";
import { branchSchema } from "../../formSchema/branchSchema";
import type { BranchAll } from "../../types/BranchAll";
import ExportFileModal from "../../components/Modals/ExportFileModal";
import type { TableColumn } from "../../services/TablePdfDocumnet";
import type { CityBranchesTableHandle } from "./CityBranchesTable";
import { branchPdfColumns } from "../../components/Columns/PdfBranchColumn";
import { useBranchImport } from "../../hooks/useBranchImport";
import { RequirePermission } from "../../components/RequirePermission/RequirePermission";
import { usePanelTypeCrud } from "../../hooks/usePanelTypeCrud";
import { usePartitionByBranch } from "../../hooks/usePartitionByBranch";
import { getPdfRows } from "../../utils/PdfUtils";
import type { UserInput } from "../../services/users.service";
import { buildPatch } from "../../utils/buildPatch";
import { normalizeBranchInput } from "../../utils/normalizeBranch";

const gridVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const panelVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

const Branch: React.FC = () => {
  const { data: states = [], loading, error } = useLocationsByType("STATE");

  const [selectedProvinceId, setSelectedProvinceId] = useState<
    string | number | null
  >(null);

  const [selectedCity, setSelectedCity] = useState<{
    id: string | number;
    label: string;
  } | null>(null);

  const [isFormOpen, setFormOpen] = useState(false);

  const [editingBranch, setEditingBranch] = useState<
    (BranchInput & { id?: number | string }) | null
  >(null);

  const cityBranchesRef = useRef<{ refetch: () => void } | null>(null);

  const [openExportFileModal, setOpenExportFileModal] =
    useState<boolean>(false);

  const [exportBranchData, setExportBranchData] = useState<any[]>([]);

  const [exportBranchColumns, setExportBranchColumns] = useState<TableColumn[]>(
    []
  );

  const [modalKey, setModalKey] = useState(1);

  const cityBranchesTableRef = useRef<CityBranchesTableHandle>(null);
  const { importExcel, loading: importLoading } = useBranchImport();
  const importInputRef = useRef<HTMLInputElement>(null);
  const originalFormRef = useRef<BranchInput | null>(null);

  const { partitions } = usePartitionByBranch({
    branchId: editingBranch?.id ?? null,
  });

  const selectedProvince =
    states.find((s) => s.id === selectedProvinceId) ?? null;

  const {
    createBranch,
    updateBranch,
    deleteBranch,
    loading: crudLoading,
    error: crudError,
    resetError,
  } = useBranchCrud();

  const {
    data: panelTypes,
    loading: panelTypeLoading,
    refetch: refetchPanelTypes,
  } = usePanelTypeCrud(1, 100);

  const panelTypeOptions = panelTypes.map((pt) => ({
    label: pt.name,
    value: pt.id,
  }));

  const partitionOptions = partitions.map((p) => ({
    label: p.label,
    value: p.id,
  }));

  const openCreate = () => {
    setEditingBranch(null);
    originalFormRef.current = null;
    setFormOpen(true);
    setModalKey((k) => k + 1);
    resetError();
  };

  function mapLocationToLocationObject(location: any): LocationObject {
    return {
      id: location.id,
      label: location.label,
      type: location.type,
      parent: location.parent
        ? {
            id: location.parent.id,
            label: location.parent.label,
            type: location.parent.type,
            parent: location.parent.parent
              ? {
                  id: location.parent.parent.id,
                  label: location.parent.parent.label,
                  type: location.parent.parent.type,
                }
              : { id: 0, label: "", type: "" },
          }
        : {
            id: 0,
            label: "",
            type: "",
            parent: { id: 0, label: "", type: "" },
          },
    };
  }

  const openEdit = (branch: BranchAll) => {
    const initial: BranchInput & { id?: number | string } = {
      name: branch.name,
      locationId: branch.location.id,
      code: branch.code,
      address: branch.address,
      phoneNumber: branch.phoneNumber ?? undefined,
      panelName: branch.panelName ?? undefined,
      panelIp: branch.panelIp ?? undefined,
      panelCode: branch.panelCode ?? undefined,
      panelTypeId: branch.panelTypeId ?? undefined,
      emergencyCall: branch.emergencyCall ?? undefined,
      location: mapLocationToLocationObject(branch.location),
      id: branch.id,
    };

    setEditingBranch(initial);
    originalFormRef.current = initial; // snapshot for diff
    setFormOpen(true);
    setModalKey((k) => k + 1);
    resetError();
  };

  const handleSubmit = async (data: BranchInput) => {
    const normalizedData = Object.keys(data).reduce((acc, field) => {
      const fieldValue = data[field as keyof BranchInput];
      acc[field] = fieldValue === "" ? null : fieldValue; // Replace empty string with null
      return acc;
    }, {} as BranchInput);
    const normalizedBranchData = normalizeBranchInput(normalizedData);
    if (editingBranch?.id) {
      const base = normalizeBranchInput(
        originalFormRef.current ?? (editingBranch as BranchInput)
      );
      const patch = buildPatch<BranchInput>(base, normalizedBranchData, {
        ignoreKeys: ["location", "id"],
        skipEmptyStrings: true, // Skip empty strings but keep null
      });
      if (Object.keys(patch).length === 0) {
        setFormOpen(false);
        return;
      }

      // Update branch with patch
      await updateBranch(editingBranch.id, {...patch , locationId : null});
      setFormOpen(false)
      setEditingBranch(null)
    } else {
      await createBranch(normalizedBranchData);
      setFormOpen(false)
    }

    cityBranchesRef.current?.refetch();
  };

  const handleDelete = async (branchId: string | number) => {
    try {
      await deleteBranch(branchId);
      // After successful delete, refresh the branch table
      cityBranchesRef.current?.refetch();
    } catch (e) {
      // Handle error, e.g., show toast
      console.error(e);
    }
  };

  function getPdfColumns(columnsConfig) {
    return columnsConfig.map((col) => ({
      header: col.header,
      key: col.key,
    }));
  }

  const handleOpenExportModal = async () => {
    setOpenExportFileModal(true);
    const allBranches =
      await cityBranchesTableRef.current?.fetchAllBranches?.();
    setExportBranchData(allBranches ?? []);
    setExportBranchColumns(branchPdfColumns);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importExcel(file);
      cityBranchesRef.current?.refetch();
    } finally {
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (isFormOpen) {
      refetchPanelTypes();
    }
  }, [isFormOpen, refetchPanelTypes]);

  const dynamicBranchSchema = useMemo(
    () =>
      branchSchema(editingBranch ? true : false).map((field) =>
        field.name === "panelTypeId"
          ? { ...field, options: panelTypeOptions }
          : field.name === "mainPartitionId"
          ? {
              ...field,
              options: partitionOptions,
            }
          : field
      ),
    [panelTypeOptions]
  );

  return (
    <div className="font-[iransans] w-full h-full" dir="rtl">
      <div className="w-full h-full flex flex-col justify-between items-end lg:pt-2 lg:pb-2 gap-2 3xl:pt-3 lg:px-4 3xl:px-8">
        <div className="w-full h-full flex flex-col justify-start items-center rounded-2xl bg-white">
          {/* Header */}
          <div className="w-full flex items-center justify-between px-6 py-3">
            <h1 className="text-2xl font-semibold">مدیریت شعب</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleOpenExportModal}
                className="2xl:py-2 2xl:px-4 bg-btns text-white flex justify-center items-center gap-2 hover:bg-transparent hover:text-[#09a1a4] transition-all hover:border-[#09a1a4]"
              >
                <MdOutlineFileDownload size={20} />
                <span>دریافت فایل</span>
              </Button>
              <Button
                onClick={handleImportClick}
                disabled={importLoading}
                className="2xl:py-2 2xl:px-4 bg-btns text-white flex justify-center items-center gap-2 hover:bg-transparent hover:text-[#09a1a4] transition-all hover:border-[#09a1a4]"
              >
                <MdOutlineFileUpload size={20} />
                <span>
                  {importLoading ? "در حال بارگذاری..." : "بارگذاری فایل"}
                </span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={importInputRef}
                  onChange={handleImportFileChange}
                  className="hidden"
                  disabled={importLoading}
                />
              </Button>
              <RequirePermission perm="branch:create">
                <Button
                  className="2xl:py-2 2xl:px-4 bg-btns text-white flex justify-center items-center gap-2 hover:bg-transparent hover:text-[#09a1a4] transition-all hover:border-[#09a1a4]"
                  onClick={openCreate}
                >
                  ایجاد شعبه
                </Button>
              </RequirePermission>
            </div>
          </div>

          {/* AnimatePresence wraps the two “views” */}
          <AnimatePresence mode="wait">
            {selectedProvinceId == null ? (
              // ─── Province Grid ─────────────────────────
              <motion.div
                key="grid"
                variants={gridVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full p-2 flex flex-wrap justify-center items-center gap-10 h-full"
              >
                {loading && <LoadingSpinner />}

                {!loading && (
                  <>
                    {states
                      .filter((p) => p.id !== selectedProvinceId)
                      .map((province) => (
                        <button
                          key={province.id}
                          onClick={() => {
                            setSelectedProvinceId(province.id);
                            setSelectedCity(null);
                          }}
                          className="
                            w-[140px] h-[140px]
                            flex items-center justify-center
                            border border-[#09a1a4] bg-[#86dddf46]
                            rounded-lg shadow 
                            text-gray-800 hover:scale-105 transition-transform
                          "
                        >
                          {province.label}
                        </button>
                      ))}
                    {error && <p className="text-red-500 p-4">{error}</p>}
                  </>
                )}
              </motion.div>
            ) : (
              // ─── Selected Province Panel ────────────────
              <motion.div
                key="panel"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full flex flex-col gap-1"
              >
                {/* Breadcrumb Pills */}
                <div className="w-full flex justify-start items-center gap-2 px-6">
                  <span
                    onClick={() => {
                      setSelectedProvinceId(null);
                      setSelectedCity(null);
                    }}
                    className="
                      cursor-pointer inline-flex items-center px-4 py-2
                      rounded-lg bg-btns text-white shadow
                      hover:opacity-90 transition
                    "
                  >
                    {selectedProvince
                      ? selectedProvince.label === "استان تهران"
                        ? selectedProvince.label
                        : `استان ${selectedProvince.label}`
                      : null}
                  </span>

                  {selectedCity && (
                    <>
                      <span className="">/</span>
                      <span
                        onClick={() => setSelectedCity(null)}
                        className="
                          cursor-pointer inline-flex items-center px-4 py-2
                          rounded-lg bg-btns text-white shadow
                          hover:opacity-90 transition
                        "
                      >
                        شهر {selectedCity.label}
                      </span>
                    </>
                  )}
                </div>

                {/* Cities list */}
                {selectedProvince && (
                  <ProvinceCities
                    provinceId={selectedProvince.id}
                    provinceLable={selectedProvince.label}
                    isVisible={true}
                    selectedCityId={selectedCity?.id ?? null}
                    onCitySelect={(city) => setSelectedCity(city)}
                    onEdit={openEdit}
                    cityBranchesRef={cityBranchesRef}
                    onDelete={handleDelete}
                    cityBranchesTableRef={cityBranchesTableRef}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <FormModal<BranchInput>
            key={modalKey}
            isOpen={isFormOpen}
            onRequestClose={() => setFormOpen(false)}
            title={editingBranch ? "ویرایش شعبه" : "ایجاد شعبه"}
            schema={dynamicBranchSchema}
            initialData={editingBranch ?? undefined}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      {openExportFileModal && (
        <>
          <ExportFileModal
            isOpen
            onClose={() => setOpenExportFileModal(false)}
            pdfData={getPdfRows(
              exportBranchData,
              getPdfColumns(exportBranchColumns)
            )}
            pdfColumns={getPdfColumns(exportBranchColumns)}
            pdfTitle="لیست شعب ثبت شده"
          />
        </>
      )}
    </div>
  );
};

export default Branch;
