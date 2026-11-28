import React, { Suspense, useEffect, useState } from "react"
import OverstoryStudioLanding from "@/components/ui/overstory-studio-landing"
import { CustomCursor } from "@/components/ui/custom-cursor"
import "./App.css"

const AllProjectsPage = React.lazy(() =>
  import("@/components/landing/pages/AllProjectsPage").then((m) => ({
    default: m.AllProjectsPage,
  })),
)

function getInitialPath() {
  if (typeof window === "undefined") return "/"
  return window.location.pathname === "/projects" ? "/projects" : "/"
}

export default function App() {
  const [season, setSeason] = useState<"summer" | "autumn" | "blossom">("summer")
  const [path, setPath] = useState<string>(getInitialPath)

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname === "/projects" ? "/projects" : "/")
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const navigate = (to: "/" | "/projects", scrollToId?: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, "", to)
    }
    setPath(to)
    if (scrollToId) {
      window.setTimeout(() => {
        const el = document.getElementById(scrollToId)
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
          const firstInput = el.querySelector("input, button") as HTMLElement | null
          window.setTimeout(() => firstInput?.focus({ preventScroll: true }), 450)
        }
      }, 80)
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    }
  }

  return (
    <div className="app-root">
      <CustomCursor />
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

      {path === "/projects" ? (
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#080d0a" }} />}>
          <AllProjectsPage
            brand="VayalCode"
            season={season}
            onBackHome={() => navigate("/")}
            onBookCall={() => navigate("/", "contact")}
          />
        </Suspense>
      ) : (
        <OverstoryStudioLanding
          brand="VayalCode"
          email="hello@vayalcode.com"
          season={season}
          seed={season === "autumn" ? 23 : 7}
          status={season === "autumn" ? "Now accepting new client projects for this quarter" : null}
          onAllProjects={() => navigate("/projects")}
          onBook={() => {
            const contactEl = document.getElementById("contact")
            if (contactEl) {
              contactEl.scrollIntoView({ behavior: "smooth" })
              const firstInput = contactEl.querySelector("input, button") as HTMLElement | null
              window.setTimeout(() => firstInput?.focus({ preventScroll: true }), 450)
            }
          }}
          onSubscribe={async () => {
            return true
          }}
        />
      )}
    </div>
  )
}
