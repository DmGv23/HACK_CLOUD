import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";
import { HistoryPage } from "./pages/HistoryPage";

type View = "home" | "results" | "history";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [jobId, setJobId] = useState<string | null>(null);

  const handleJobReady = (id: string) => {
    setJobId(id);
    setView("results");
  };

  const handleSelectJob = (id: string) => {
    setJobId(id);
    setView("results");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar current={view} onChange={(v) => setView(v)} hasJob={!!jobId} />
      <main
        style={{
          marginLeft: 220,
          flex: 1,
          minHeight: "100vh",
          background: "var(--bg-base)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 220,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(0,212,177,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,177,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: -100,
            right: 100,
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(0,212,177,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 220,
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          {view === "home" && <HomePage onJobReady={handleJobReady} />}
          {view === "results" && jobId && <ResultsPage jobId={jobId} />}
          {view === "history" && <HistoryPage onSelectJob={handleSelectJob} />}
        </div>
      </main>
    </div>
  );
}
