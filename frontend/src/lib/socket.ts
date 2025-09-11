// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL as string;

let socket: Socket | null = null; // Type the socket instance

/**
 * Initialize WebSocket connection with the provided token.
 * Ensures the token is dynamically passed after login.
 * @param {string} token - The authentication token.
 * @returns {Socket} The initialized socket instance.
 */
export const initializeSocket = (token: string): Socket => {
  if (socket) {
    socket.disconnect(); // Disconnect any existing socket
  }

  // Initialize the WebSocket connection
  socket = io(`${BASE_URL}/ws/socket`, {
    auth: { token: `Bearer ${token}` }, // Use the passed token
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 5000,
    timeout: 10000,
  });

  // Log WebSocket connection status
  socket.on("connect", () => {
    // console.log("WebSocket connected", socket.id);
    // listenToEvents();
    // emitActiveMap();
  });

  // Always listen to the `Restart` event
  socket.on("Restart", (data: any) => {
    // console.log("[WebSocket] Received 'Restart':", data);
    handleRestart(data);
  });

  // Handle WebSocket disconnection
  socket.on("disconnect", () => {
    // console.log("WebSocket disconnected");
  });

  // Handle connection errors
  socket.on("connect_error", (err: Error) => {
    console.error("WebSocket connection error:", err);
  });

  return socket;
};

/**
 * Disconnects the WebSocket connection if it's active.
 * Returns a Promise that resolves once the socket is fully disconnected.
 * @returns {Promise<void>}
 */
export const disconnectSocket = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!socket || socket.disconnected) {
      socket = null;
      return resolve();
    }

    socket.once("disconnect", () => {
      socket = null;
      resolve();
    });

    socket.disconnect();
  });
};

/**
 * Get the current WebSocket instance.
 * Ensures the socket is initialized before use.
 * @returns {Socket | null} The WebSocket instance or null if not initialized.
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Handle `Restart` event and refresh the application.
 * @param {any} data - Data received from the server (unused here).
 */
const handleRestart = (data?: any): void => {
  window.location.reload();
};

export { socket, handleRestart };

/**
 * Emit `activeMap` when the map is loaded.
 */
export const emitActiveMap = (): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }
  socket.emit("activeMap");
};

/**
 * Placeholder for map refresh logic.
 */
export const refreshMap = (): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }
  // console.log("[WebSocket] Emitting 'refreshMap'");
  socket.emit("refreshMap");
};

/**
 * Emit `getCities` event to get cities data for the given provinceId.
 * @param {string | number} provinceId - The ID of the province.
 */
export const getCities = (provinceId: string | number): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }

  console.log("[WebSocket] Emitting 'getCities' with provinceId:", provinceId);
  socket.emit("getCities", provinceId); // Send the provinceId to the server
};

/**
 * Listen to the `citiesData` event to receive city data for the given provinceId.
 * @param callback - Callback function to handle the received city data.
 */
export const listenToCitiesData = (callback: (data: any) => void): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }

  socket.on("citiesData", (data: any) => {
    console.log("[WebSocket] Received 'citiesData':", data);
    callback(data); // Pass the received city data to the callback
  });
};


/**
 * Stop listening to `countryEventData` event.
 */
export const stopListeningToCountryEventData = (): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }
  socket.off("countryEventsData");
};

/**
 * Listen to `countryEventData` event.
 * @param callback - Callback function to process the received data.
 */
export const listenToCountryEventData = (
  callback: (data: any) => void
): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }

  socket.on("countryEventsData", (data: any) => {
    // console.log(`countryEventsData: `, data)
    callback(data);
  });
};

/**
 * Dynamically subscribe to WebSocket events.
 * @param callback - Callback to process received data.
 * @param isFilterApplied - Whether a filter is applied.
 */
export const listenToEvents = (
  callback: (data: any) => void,
  isFilterApplied: boolean
): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }

  stopListeningToEvents();

  const eventName = isFilterApplied ? "eventsFilterData" : "events";

  socket.on(eventName, (data: any) => {
    console.log(`${eventName}: `, data)
    callback(data);
  });
};

/**
 * Emit a `timeMismatch` event to the server.
 */
export const emitTimeMismatch = (): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }

  // console.log("[WebSocket] Emitting 'timeMismatch'");
  socket.emit("timeMismatch");
};

/**
 * Listen to `timeMismatch` event.
 * @param callback - Callback to handle mismatch data.
 */
export const listenToTimeMismatch = (
  callback: (message: string) => void
): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }

  console.log("[WebSocket] Listening for 'timeMismatch'");
  socket.on("timeMismatch", (message: string) => {
    console.log("[WebSocket] Received 'timeMismatch':", message);
    callback(message);
  });
};

/**
 * Emit the appropriate WebSocket event based on filters.
 * @param filters - Filter object to send to the server.
 */
export const requestFilterEvents = (filters: Record<string, any>): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }

  console.log("Sending Filter Request:", filters);
  socket.emit("EventFilter", { ...filters });
};

/**
 * Stop listening to all WebSocket events.
 */
export const stopListeningToEvents = (): void => {
  if (!socket) {
    console.error(
      "[WebSocket] Socket not initialized. Call initializeSocket first."
    );
    return;
  }

  socket.off("events");
  socket.off("eventsFilterData");
};
