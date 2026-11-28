import * as React from "react"
import { ArrowLeft, SquareArrowOutUpRight } from "lucide-react"
import { OvsSeason } from "../types"
import { SEASONS } from "../canopy-engine"
import vayalcodeLogo from "@/Img/logo/Logo.webp"
import dacDevelopersImg from "@/Img/Projects/DacDevelopers.webp"
import hahaToysImg from "@/Img/Projects/hahatoys.webp"
import indianMountainImg from "@/Img/Projects/indianmountain.webp"
import sparoLivingImg from "@/Img/Projects/sparoliving.webp"
import viveImg from "@/Img/Projects/Vive.webp"
import completeCareLogo from "@/Img/Clients_logos/completecare.webp"
import treowLogo from "@/Img/Clients_logos/treow.webp"
import infletioLogo from "@/Img/Clients_logos/infletio-consulting-logo.webp"
import amperesAcademyLogo from "@/Img/Clients_logos/ampere's acadamy.webp"
import rmkLogo from "@/Img/Clients_logos/rmk.webp"
import pocketShopLogo from "@/Img/Clients_logos/pocketshop.webp"

export interface ProjectEntry {
  id: string
  title: string
  category: string
  year: string
  description: string
  image: string
  isLogo?: boolean
  liveUrl: string
  highlights: string[]
}

const ALL_PROJECTS: ProjectEntry[] = [
  {
    id: "dac-developers",
    title: "DAC Developers",
    category: "Real Estate",
    year: "2025",
    description:
      "Real estate digital flagship built for high-intent property inquiries, interactive project showcases, and seamless lead conversion across Chennai.",
    image: dacDevelopersImg,
    liveUrl: "https://dacdevelopers.com/",
    highlights: ["Custom Web Design", "Lead Funnel", "Performance SEO"],
  },
  {
    id: "haha-toys",
    title: "Haha Toys",
    category: "E-Commerce",
    year: "2025",
    description:
      "High-converting D2C toy storefront crafted for fast product discovery, playful brand storytelling, and frictionless mobile checkout.",
    image: hahaToysImg,
    liveUrl: "https://www.thehahatoys.com/",
    highlights: ["D2C Storefront", "Mobile UX", "Conversion Optimization"],
  },
  {
    id: "indian-mountain-rovers",
    title: "Indian Mountain Rovers",
    category: "Travel & Hospitality",
    year: "2025",
    description:
      "Adventure travel and Himalayan expedition booking platform engineered for explorers seeking curated itineraries and instant trip inquiries.",
    image: indianMountainImg,
    liveUrl: "https://www.indianmountainrovers.com/",
    highlights: ["Booking Experience", "Editorial UI", "Speed Optimization"],
  },
  {
    id: "sparo-living",
    title: "Sparo Living",
    category: "E-Commerce",
    year: "2025",
    description:
      "Modern home and lifestyle e-commerce experience pairing refined editorial layouts with clean catalog browsing and high-AOV product pages.",
    image: sparoLivingImg,
    liveUrl: "https://sparoliving.com/",
    highlights: ["Brand Flagship", "Catalog Architecture", "Responsive Craft"],
  },
  {
    id: "vive-beauty-care",
    title: "Vive Beauty Care",
    category: "Beauty & Wellness",
    year: "2025",
    description:
      "Curated organic beauty and wellness brand experience designed to build customer trust, highlight pure ingredients, and drive repeat orders.",
    image: viveImg,
    liveUrl: "https://vivebeautycare.com/",
    highlights: ["Organic Brand UI", "Product Storytelling", "Retention Flows"],
  },
  {
    id: "complete-care",
    title: "Complete Care",
    category: "Healthcare",
    year: "2025",
    description:
      "Modern healthcare and medical services platform built for patient trust, clear service discovery, and effortless appointment booking in the UAE.",
    image: completeCareLogo,
    isLogo: true,
    liveUrl: "https://completecare.ae/",
    highlights: ["Healthcare UI", "Appointment Flow", "Responsive Web"],
  },
  {
    id: "treow",
    title: "Treow",
    category: "Consulting",
    year: "2025",
    description:
      "Australian digital presence engineered for clarity, high-trust enterprise positioning, and streamlined client engagement.",
    image: treowLogo,
    isLogo: true,
    liveUrl: "https://www.treow.com.au/",
    highlights: ["Corporate Web", "Brand Positioning", "Fast Performance"],
  },
  {
    id: "infletio-consulting",
    title: "Infletio Consulting",
    category: "Consulting",
    year: "2025",
    description:
      "Elite startup recruiting and advisory platform crafted to showcase specialized talent networks and drive high-value founder inquiries.",
    image: infletioLogo,
    isLogo: true,
    liveUrl: "https://infletio.com/",
    highlights: ["Startup Recruiting", "Conversion UI", "Technical SEO"],
  },
  {
    id: "amperes-academy",
    title: "Ampere's Academy",
    category: "EdTech & Coaching",
    year: "2025",
    description:
      "Dedicated NEET & JEE coaching platform in Chennai designed for student enrollment, course clarity, and parent trust.",
    image: amperesAcademyLogo,
    isLogo: true,
    liveUrl: "https://amperesacademy.in/",
    highlights: ["EdTech Platform", "Enrollment Funnel", "Mobile First"],
  },
  {
    id: "rmk-group",
    title: "RMK Group",
    category: "Industrial",
    year: "2025",
    description:
      "Industrial enterprise flagship showcasing 25+ years of manufacturing excellence, infrastructure capabilities, and global B2B reach.",
    image: rmkLogo,
    isLogo: true,
    liveUrl: "https://rmkgroupofcompany.com/",
    highlights: ["B2B Enterprise", "Capability Showcase", "Global Reach"],
  },
  {
    id: "pocket-shop",
    title: "Pocket Shop",
    category: "E-Commerce",
    year: "2025",
    description:
      "Curated online store for unique lifestyle, spiritual, and everyday essentials built for smooth browsing and fast checkout.",
    image: pocketShopLogo,
    isLogo: true,
    liveUrl: "https://pocketshop.co.in/",
    highlights: ["E-Commerce Store", "Catalog UX", "Checkout Speed"],
  },
]

const CATEGORIES = [
  "All",
  "E-Commerce",
  "Real Estate",
  "Healthcare",
  "Consulting",
  "EdTech & Coaching",
  "Travel & Hospitality",
  "Beauty & Wellness",
  "Industrial",
]

interface AllProjectsPageProps {
  brand?: string
  season?: OvsSeason
  onBackHome: () => void
  onBookCall: () => void
}

export function AllProjectsPage({
  brand = "VayalCode",
  season = "summer",
  onBackHome,
  onBookCall,
}: AllProjectsPageProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const pal = SEASONS[season] || SEASONS.summer

  const filteredProjects =
    selectedCategory === "All"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === selectedCategory)

  const rootStyle = {
    "--ovs-accent": pal.accent,
    "--ovs-soft": pal.soft,
    "--ovs-ink": "#edf1e6",
    "--ovs-ink2": "#a5b09d",
    "--ovs-paper": "#080d0a",
    "--ovs-card": "#101713",
    "--ovs-forest": "#070c09",
    "--ovs-line": "rgba(237, 241, 230, .12)",
  } as React.CSSProperties

  return (
    <div
      className="ovs-root ovs-proj-page"
      data-season={season}
      data-scheme="dark"
      style={rootStyle}
    >
      {/* Ambient glow */}
      <div className="ovs-proj-glow" aria-hidden="true" />

      {/* Sticky Top Header */}
      <header className="ovs-proj-topbar">
        <div className="ovs-proj-topbar-inner">
          <button
            type="button"
            onClick={onBackHome}
            className="ovs-proj-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={onBackHome}
            className="ovs-proj-brand"
          >
            <span className="ovs-brand-pill">
              <img src={vayalcodeLogo} alt={brand} className="ovs-brand-logo" />
            </span>
          </button>

          <button
            type="button"
            onClick={onBookCall}
            className="ovs-proj-book"
          >
            <span>Book a call</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      <main className="ovs-proj-main">
        <div className="ovs-proj-wrap">
          {/* Page Hero */}
          <div className="ovs-proj-hero">
            <p className="ovs-kicker ovs-kicker-light">
              <span className="ovs-kicker-dot" aria-hidden="true" />
              <span className="ovs-kicker-n">01</span>
              <span className="ovs-kicker-sep" aria-hidden="true">/</span>
              <span className="ovs-kicker-txt">All Projects</span>
            </p>

            <h1 className="ovs-proj-h1">
              Selected &amp; Featured{" "}
              <span className="ovs-proj-h1-accent">Work</span>
            </h1>

            <p className="ovs-proj-sub">
              Explore our portfolio of high-converting websites, e-commerce
              flagships, and custom digital experiences built to scale.
            </p>

            {/* Category Filter Pills */}
            <div className="ovs-proj-filters" role="tablist" aria-label="Filter projects by category">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={`ovs-proj-filter ${active ? "is-active" : ""}`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="ovs-proj-grid">
            {filteredProjects.map((project, idx) => (
              <article key={project.id} className="ovs-proj-card group">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ovs-proj-media ${project.isLogo ? "is-logo" : ""}`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading={idx < 3 ? "eager" : "lazy"}
                  />
                  <div className="ovs-proj-media-overlay">
                    <span className="ovs-cs-livebtn">
                      <span className="ovs-cs-livedot" aria-hidden="true" />
                      <span>Live Website</span>
                      <span className="ovs-cs-liveico" aria-hidden="true">
                        <SquareArrowOutUpRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </div>
                </a>

                <div className="ovs-proj-body">
                  <div className="ovs-proj-meta">
                    <span className="ovs-proj-cat">{project.category}</span>
                    <span className="ovs-proj-year">{project.year}</span>
                  </div>

                  <h2 className="ovs-proj-title">{project.title}</h2>
                  <p className="ovs-proj-desc">{project.description}</p>

                  <div className="ovs-proj-tags">
                    {project.highlights.map((tag) => (
                      <span key={tag} className="ovs-proj-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="ovs-proj-footer">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ovs-proj-visit"
                    >
                      <span>Visit Live Website</span>
                      <SquareArrowOutUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="ovs-proj-cta-box">
            <div>
              <h2 className="ovs-proj-cta-title">Have a project in mind?</h2>
              <p className="ovs-proj-cta-desc">
                Let&apos;s design and engineer a fast, high-converting digital
                flagship for your brand.
              </p>
            </div>
            <button
              type="button"
              onClick={onBookCall}
              className="ovs-btn ovs-btn-lime ovs-btn-xl cursor-pointer"
            >
              <span>Start a Project</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
