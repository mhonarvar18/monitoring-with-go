import { useState } from "react";
import { useBranchCrud } from "../useBranchCrud";
import type { BranchInput } from "../../services/branchCrud.service";

export function useBranchForm(onSuccess: () => void) {
  const { createBranch } = useBranchCrud();
  const [isOpen, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editingBranch, setEditingBranch] = useState<BranchInput | null>(null);

  const openWithPrefill = (prefill: BranchInput) => {
    setEditingBranch(prefill);
    setFormKey((k) => k + 1);
    setOpen(true);
  };

  const handleSubmit = async (data: Record<string, any>) => {
    await createBranch({
      ...data,
      panelTypeId: data.panelTypeId || null,
    } as BranchInput);
    setOpen(false);
    onSuccess();
  };

  return {
    isOpen,
    setOpen,
    formKey,
    editingBranch,
    openWithPrefill,
    handleSubmit,
  } as const;
}
