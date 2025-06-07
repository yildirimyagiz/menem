import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PropertyListingsLink from "./property-listings-link";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication (example: JWT token or user in localStorage)
    const isAuthenticated =
      typeof window !== "undefined" &&
      (localStorage.getItem("auth_token") || localStorage.getItem("user"));
    if (isAuthenticated) {
      router.replace("/client-home");
    } else {
      router.replace("/client/login");
    }
  }, [router]);

  // Optionally, show a loading spinner while redirecting
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f8fafc 0%,#e0e7ef 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: 48,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 16,
            color: "#2563eb",
          }}
        >
          Welcome to RentalProc
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", marginBottom: 36 }}>
          Redirecting...
        </p>
      </div>
      <div style={{ marginTop: 40, color: "#64748b" }}>
        <small>
          {new Date().getFullYear()} RentalProc. All rights reserved.
        </small>
      </div>
    </div>
  );
}
