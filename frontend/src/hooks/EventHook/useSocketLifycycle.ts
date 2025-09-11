import { useEffect } from "react";
import { disconnectSocket, initializeSocket } from "../../lib/socket";

export function useSocketLifecycle() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    (async () => {
      if (token) await initializeSocket(token);
    })().catch(console.error);

    return () => {
      disconnectSocket().catch(console.error);
    };
  }, []);
}

