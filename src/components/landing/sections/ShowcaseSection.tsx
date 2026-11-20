import * as React from "react"
import CardStackDemoPage from "@/components/ui/demo"
import { Arrow, Magnet } from "../ui-primitives"

interface ShowcaseSectionProps {
  onAllProjectsClick?: (e: React.MouseEvent) => void
}

export function ShowcaseSection({ onAllProjectsClick }: ShowcaseSectionProps) {
  return (
    <section
      id="showcase"
      className="ovs-sec ovs-showcase relative bg-[var(--ovs-paper)] text-[var(--ovs-ink)] pt-10 sm:pt-14 pb-20 sm:pb-28 transition-colors duration-500 overflow-hidden font-[family-name:var(--ovs-sans)] text-center"
      data-sec="showcase"
    >
      <div className="ovs-wrap flex flex-col items-center justify-center text-center">
        {/* Centered Section Header */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full bg-[var(--ovs-accent)]/15 text-[var(--ovs-accent)] border border-[var(--ovs-accent)]/20 font-mono">
              Selected Work
            </span>
          </div>
          <h2 className="ovs-h2 font-[family-name:var(--ovs-sans)] text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--ovs-ink)] text-center mx-auto leading-tight">
            Interactive 3D Card Stack
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--ovs-ink2)] font-sans max-w-xl mx-auto leading-relaxed text-center">
            Drag, swipe or click to explore our interactive showcase of high-performance products and precision engineering.
          </p>
        </div>

        {/* Centered Interactive Card Stack Container */}
        <div className="w-full flex flex-col justify-center items-center">
          <CardStackDemoPage />
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Magnet
              className="ovs-btn ovs-btn-dark ovs-btn-xl cursor-pointer"
              href="#contact"
              onClick={onAllProjectsClick}
            >
              <span>All Projects</span>
              <Arrow />
            </Magnet>
          </div>
        </div>
      </div>
    </section>
  )
}
