import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  BarChart3,
  Magnet as MagnetIcon,
  Repeat,
  Sparkles,
  Target,
  Users,
} from "lucide-react"
import { Arrow, Kicker, Magnet } from "../ui-primitives"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const FUNNEL_STAGES = [
  {
    num: "01",
    stage: "Awareness",
    kpi: "Full-Funnel Map",
    title: "Meta Ads Strategy",
    desc: "Full-funnel campaign roadmaps tailored to your margin, audience, and growth goals.",
    Icon: Target,
  },
  {
    num: "02",
    stage: "Targeting",
    kpi: "High-Intent Reach",
    title: "Audience Research & Targeting",
    desc: "Precision lookalike, interest, and behavioural segmentation to reach high-intent buyers.",
    Icon: Users,
  },
  {
    num: "03",
    stage: "Creative",
    kpi: "Scroll-Stopping CTR",
    title: "Creative & Ad Copy Development",
    desc: "Scroll-stopping visuals, UGC hooks, and persuasive ad copy built to earn the click.",
    Icon: Sparkles,
  },
  {
    num: "04",
    stage: "Leads",
    kpi: "Qualified Pipeline",
    title: "Lead Generation Campaigns",
    desc: "High-converting instant forms and landing funnels engineered for qualified leads.",
    Icon: MagnetIcon,
  },
  {
    num: "05",
    stage: "Retargeting",
    kpi: "Drop-Off Recovery",
    title: "Retargeting & Remarketing",
    desc: "Dynamic multi-touch follow-ups that recover drop-offs and turn warm visitors into buyers.",
    Icon: Repeat,
  },
  {
    num: "06",
    stage: "Optimisation",
    kpi: "Daily ROAS Scaling",
    title: "Campaign Tracking & Optimisation",
    desc: "Pixel, Conversions API, and daily ROAS tuning so every advertising rupee counts.",
    Icon: BarChart3,
  },
]

interface MetaAdsSectionProps {
  onCtaClick?: (e: React.MouseEvent) => void
}

export function MetaAdsSection({ onCtaClick }: MetaAdsSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const [activeStage, setActiveStage] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setActiveStage((prev) => (prev + 1) % FUNNEL_STAGES.length)
    }, 1300)
    return () => window.clearInterval(id)
  }, [paused])

  React.useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const stages = el.querySelectorAll(".ovs-ads-stage")
      if (stages.length) {
        gsap.fromTo(
          stages,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.09,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          },
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  const progressPct = ((activeStage + 1) / FUNNEL_STAGES.length) * 100

  return (
    <section
      ref={sectionRef}
      id="meta-ads"
      data-sec="meta-ads"
      className="ovs-sec ovs-ads"
      aria-label="Meta Ads & Performance Growth"
    >
      <div className="ovs-ads-glow" aria-hidden="true" />

      <div className="ovs-wrap ovs-ads-wrap">
        {/* Centered Header */}
        <div className="ovs-ads-head">
          <Kicker n="03" text="Performance Marketing" />

          <h2 className="ovs-ads-h2">
            We Don&apos;t Just Run Ads.
            <br />
            <span className="ovs-ads-accent">We Drive Growth.</span>
          </h2>

          <p className="ovs-ads-desc">
            We plan, create, and optimise Meta Ads campaigns that put your
            business in front of the right audience. From building awareness to
            generating quality leads and driving conversions, we make every
            advertising decision count.
          </p>

          <div className="ovs-ads-subhead">
            <span className="ovs-ads-subdot" aria-hidden="true" />
            <h3>What We Do — 6-Stage Growth Funnel</h3>
          </div>
        </div>

        {/* Horizontal 6-Stage Funnel Pipeline */}
        <div
          className="ovs-ads-pipeline-wrap"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="ovs-ads-track" aria-hidden="true">
            <div
              className="ovs-ads-track-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="ovs-ads-pipeline">
            {FUNNEL_STAGES.map(({ num, stage, kpi, title, desc, Icon }, idx) => {
              const isActive = activeStage === idx
              const isPassed = idx <= activeStage
              return (
                <article
                  key={num}
                  onMouseEnter={() => setActiveStage(idx)}
                  onClick={() => setActiveStage(idx)}
                  className={`ovs-ads-stage ${isActive ? "is-active" : ""} ${isPassed ? "is-passed" : ""}`}
                >
                  {/* Top Node on Funnel Track */}
                  <div className="ovs-ads-node-row">
                    <span className="ovs-ads-node-dot" aria-hidden="true" />
                    <span className="ovs-ads-stage-tag">
                      {num} · {stage}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="ovs-ads-stage-card">
                    <div className="ovs-ads-card-bar" aria-hidden="true" />
                    <div className="ovs-ads-card-top">
                      <span className="ovs-ads-ico" aria-hidden="true">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="ovs-ads-num">{num}</span>
                    </div>
                    <h4 className="ovs-ads-card-title">{title}</h4>
                    <p className="ovs-ads-card-desc">{desc}</p>
                    <div className="ovs-ads-card-foot">
                      <span className="ovs-ads-kpi">{kpi}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Centered Bottom CTA */}
        <div className="ovs-ads-cta-row">
          <Magnet
            className="ovs-btn ovs-btn-lime ovs-btn-xl cursor-pointer"
            href="#contact"
            onClick={onCtaClick}
          >
            <span>Launch Your Campaign</span>
            <Arrow />
          </Magnet>
        </div>
      </div>
    </section>
  )
}
