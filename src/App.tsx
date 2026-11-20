import React, { useState } from "react"
import OverstoryStudioLanding from "@/components/ui/overstory-studio-landing"
import "./App.css"

export default function App() {
  const [season, setSeason] = useState<"summer" | "autumn" | "blossom">("summer")

  return (
    <div className="app-root">
      {/* Floating demo switcher */}
      <div className="season-switcher">
        <button
          onClick={() => setSeason("summer")}
          className={`season-btn ${season === "summer" ? "active" : ""}`}
        >
          🌿 Summer
        </button>
        <button
          onClick={() => setSeason("autumn")}
          className={`season-btn ${season === "autumn" ? "active" : ""}`}
        >
          🍂 Autumn
        </button>
        <button
          onClick={() => setSeason("blossom")}
          className={`season-btn ${season === "blossom" ? "active" : ""}`}
        >
          🌸 Blossom
        </button>
      </div>

      <OverstoryStudioLanding
        brand={season === "autumn" ? "Apex Growth" : "Apex Digital"}
        season={season}
        seed={season === "autumn" ? 23 : 7}
        status={season === "autumn" ? "Now accepting new client projects for this quarter" : null}
        onBook={(from) => {
          alert(`Consultation request received from: ${from}! Our team will reach out within 24 hours.`)
        }}
        onSubscribe={async (email) => {
          alert(`Subscribed successfully with: ${email}. Welcome to our growth insights!`)
          return true
        }}
      />
    </div>
  )
}
