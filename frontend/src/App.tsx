import { useState } from "react";
import Login from "./pages/Login"; // Import the Login page

export default function App() {
  const [route] = useState("login"); // Change route to "login"

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "IRANSans, sans-serif",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/favicon.png" width={28} />
          <b>سامانه مانیتورینگ - ورود</b> {/* Change header text to "Login" */}
        </div>
      </header>
      <main style={{ padding: 16 }}>
        {route === "login" && <Login />} {/* Render Login component */}
      </main>
    </div>
  );
}
