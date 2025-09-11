import api from "./api";

export async function importBranchesExcel(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/branches/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}
