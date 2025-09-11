import { useMutation } from "@tanstack/react-query";
import api from "../services/api";

export const useHeartbeat = () =>
  useMutation({
    mutationFn: (userId: number | string) =>
      api.post("/admin/authLog/userHeartBeat", { userId }),
  });
