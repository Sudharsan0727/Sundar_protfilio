import {
  OvsCase,
  OvsCta,
  OvsFaq,
  OvsHero,
  OvsLink,
  OvsLogo,
  OvsManifesto,
  OvsPlan,
  OvsQuote,
  OvsService,
  OvsStat,
  OvsStep,
} from "./types"

import amperesAcademyLogo from "../../Img/Clients_logos/ampere's acadamy.webp"
import completeCareLogo from "../../Img/Clients_logos/completecare.webp"
import dacLogo from "../../Img/Clients_logos/dac.webp"
import hahaToysLogo from "../../Img/Clients_logos/haha-toys.webp"
import indianMountainRoversLogo from "../../Img/Clients_logos/indian-mountain-rovers.webp"
import infletioLogo from "../../Img/Clients_logos/infletio-consulting-logo.webp"
import mjsTradersLogo from "../../Img/Clients_logos/mjstraders.webp"
import pocketShopLogo from "../../Img/Clients_logos/pocketshop.webp"
import rmkLogo from "../../Img/Clients_logos/rmk.webp"
import sparoLogo from "../../Img/Clients_logos/sparo.webp"
import treowLogo from "../../Img/Clients_logos/treow.webp"
import viveBeautyCareLogo from "../../Img/Clients_logos/vivebeautycare.webp"

export const DEFAULT_LINKS: OvsLink[] = [
  { label: "Services", href: "#services" },
  { label: "Meta Ads", href: "#meta-ads" },
  { label: "Showcase", href: "#showcase" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
]

export const DEFAULT_HERO = {
  lead: "We Build High-Impact",
  words: ["Websites", "E-Commerce", "Software", "Campaigns"],
  tail: "That Scale.",
  trusted: "Trusted by fast-growing brands, e-commerce stores & enterprises",
  cue: "Scroll to explore our services",
}

export const DEFAULT_LOGOS: OvsLogo[] = [
  {
    name: "Ampere's Academy",
    mark: "knot",
    type: "heavy",
    sector: "EdTech & Learning",
    image: amperesAcademyLogo,
  },
  {
    name: "CompleteCare",
    mark: "venn",
    type: "sans",
    sector: "Healthcare",
    image: completeCareLogo,
  },
  {
    name: "DAC Developers",
    mark: "slash",
    type: "heavy",
    sector: "Real Estate",
    image: dacLogo,
  },
  {
    name: "Haha Toys",
    mark: "watch",
    type: "serif",
    sector: "D2C E-Commerce",
    image: hahaToysLogo,
  },
  {
    name: "Indian Mountain Rovers",
    mark: "scribe",
    type: "sans",
    sector: "Travel & Expeditions",
    image: indianMountainRoversLogo,
  },
  {
    name: "Infletio Consulting",
    mark: "slash",
    type: "heavy",
    sector: "Business Consulting",
    image: infletioLogo,
  },
  {
    name: "MJS Traders",
    mark: "knot",
    type: "sans",
    sector: "Wholesale & Trade",
    image: mjsTradersLogo,
  },
  {
    name: "PocketShop",
    mark: "watch",
    type: "serif",
    sector: "Mobile Commerce",
    image: pocketShopLogo,
  },
  {
    name: "RMK Group",
    mark: "venn",
    type: "heavy",
    sector: "Education & Enterprise",
    image: rmkLogo,
  },
  {
    name: "Sparo",
    mark: "scribe",
    type: "serif",
    sector: "Consumer Brand",
    image: sparoLogo,
  },
  {
    name: "Treow",
    mark: "knot",
    type: "sans",
    sector: "Digital Solutions",
    image: treowLogo,
  },
  {
    name: "Vive Beauty Care",
    mark: "watch",
    type: "serif",
    sector: "Beauty & Wellness",
    image: viveBeautyCareLogo,
  },
]

export const DEFAULT_MANIFESTO = {
  kicker: "Your Digital Partner",
  text: "We design and build high-converting websites, e-commerce, custom software, and marketing. [team] From concept to launch, [chart] we turn clicks into revenue that scales.",
}

export const DEFAULT_STATS: OvsStat[] = [
  { value: 150, suffix: "+", label: "websites & custom platforms delivered" },
  { value: 45, prefix: "₹", suffix: "M+", label: "client revenue generated across channels" },
  { value: 4, suffix: "x", label: "average conversion rate improvement" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "client satisfaction rating across all projects" },
]

export const DEFAULT_SERVICES: OvsService[] = [
  {
    title: "Website & Landing Page Development",
    art: "site",
    image: "/service-web.webp",
    time: "1 to 3 weeks",
    text: "High-speed, conversion-focused websites and landing pages engineered to turn visitors into buyers.",
    tags: ["Landing Pages", "Web Development", "Speed & SEO"],
  },
  {
    title: "Custom E-Commerce Websites",
    art: "system",
    image: "/service-ecommerce.webp",
    time: "3 to 6 weeks",
    text: "Bespoke online storefronts with frictionless 1-click checkout, fast loading, and inventory syncing.",
    tags: ["Online Stores", "Headless & Shopify", "Cart CRO"],
  },
  {
    title: "WordPress, Shopify & Admin Dashboards",
    art: "code",
    image: "/service-dashboard.webp",
    time: "2 to 4 weeks",
    text: "Custom WordPress themes, Shopify storefronts, and role-based admin dashboards with real-time analytics.",
    tags: ["WordPress", "Shopify", "Admin Dashboards"],
  },
  {
    title: "Meta Ads Campaigns & Performance Growth",
    art: "brand",
    image: "/service-meta-ads.webp",
    time: "Ongoing retainers",
    text: "High-converting Facebook & Instagram ad campaigns, lead funnels, and retargeting built to scale ROAS.",
    tags: ["Meta Ads", "Lead Generation", "ROAS Scaling"],
  },
  {
    title: "SEO & Digital Growth",
    art: "product",
    image: "/service-seo-growth.webp",
    time: "2 to 4 weeks",
    text: "Technical SEO, search-first architecture, and organic growth funnels engineered to rank and convert.",
    tags: ["Technical SEO", "Organic Growth", "Conversion Audits"],
  },
  {
    title: "Landing Page & Website Redesign",
    art: "site",
    image: "/service-landing-redesign.webp",
    time: "1 to 3 weeks",
    text: "Modern high-converting landing pages, website redesigns, speed optimization, and ongoing maintenance.",
    tags: ["Landing Pages", "Website Redesign", "Speed & Maintenance"],
  },
]

export const DEFAULT_CASES: OvsCase[] = [
  {
    client: "Aura Commerce",
    mark: "knot",
    kind: "Custom E-Commerce Platform",
    title: "A bespoke headless storefront with sub-second page loads and seamless 1-click checkout.",
    metric: "+182%",
    metricLabel: "increase in mobile conversion rate",
    year: "2025",
    mock: "dashboard",
    tint: ["#cfe3d8", "#86b49a"],
    tags: ["Next.js 15", "Headless Shopify", "Sub-Second P99", "1-Click Checkout"],
  },
  {
    client: "NovaScale",
    mark: "slash",
    kind: "Digital Marketing & CRO",
    title: "Omnichannel search, paid social, and high-converting landing page campaign.",
    metric: "4.6x",
    metricLabel: "return on ad spend (ROAS) across 6 months",
    year: "2025",
    mock: "chat",
    tint: ["#e9e2cf", "#c9a865"],
    tags: ["CRO Testing", "Paid Acquisition", "Dynamic Funnels", "Attribution AI"],
  },
  {
    client: "OmniOps",
    mark: "watch",
    kind: "Custom Enterprise Software",
    title: "All-in-one internal workflow portal replacing fragmented legacy systems.",
    metric: "14 hrs",
    metricLabel: "saved per operations team member every week",
    year: "2024",
    mock: "doc",
    tint: ["#d4e0ee", "#7d9cc4"],
    tags: ["Cloud Portal", "Enterprise RBAC", "Real-Time Sync", "99.99% SLA"],
  },
  {
    client: "Elevate Global",
    mark: "venn",
    kind: "Website & Landing Page",
    title: "High-converting corporate website and interactive product launch landing page.",
    metric: "28k",
    metricLabel: "qualified inbound leads captured in launch month",
    year: "2024",
    mock: "mobile",
    tint: ["#e6d9e4", "#b48aa8"],
    tags: ["Interactive Motion", "WebGL Canvas", "Global Edge CDN", "SEO Flagship"],
  },
]

export const DEFAULT_STEPS: OvsStep[] = [
  {
    name: "Discovery",
    when: "Week 1",
    title: "Strategy & Scope",
    text: "We deep-dive into your business goals, target audience, and competitive landscape. You receive a clear technical roadmap, wireframes, and a fixed timeline.",
  },
  {
    name: "Design",
    when: "Weeks 2 to 3",
    title: "UI/UX & Prototyping",
    text: "Custom high-fidelity Figma mockups, conversion-optimized user flows, and interactive prototypes reviewed collaboratively in weekly sprints.",
  },
  {
    name: "Build",
    when: "Weeks 4 to 6",
    title: "Engineering & Integrations",
    text: "Full-stack development using modern, battle-tested technologies. We connect your payment gateways, CMS, APIs, and analytics with daily staging previews.",
  },
  {
    name: "Launch",
    when: "Week 7 onward",
    title: "Deploy, Market & Scale",
    text: "Rigorous QA testing, seamless domain launch, technical SEO setup, and data-driven marketing campaigns to drive immediate traffic, leads, and sales.",
  },
]

export const DEFAULT_QUOTES: OvsQuote[] = [
  {
    quote: "They developed our custom e-commerce store and took over our paid marketing. Our store conversion rate doubled within 60 days, and our revenue hit record highs.",
    name: "Marcus Vance",
    role: "Founder, Aura Commerce",
    mark: "knot",
  },
  {
    quote: "From our high-converting landing page to the bespoke internal software powering our operations, they delivered top-tier quality ahead of schedule.",
    name: "Elena Rostova",
    role: "COO, OmniOps",
    mark: "watch",
  },
  {
    quote: "Their digital marketing campaigns and landing pages dropped our customer acquisition cost by 42%. They operate like an elite in-house growth team.",
    name: "Devon Chen",
    role: "Growth Director, NovaScale",
    mark: "slash",
  },
]

export const DEFAULT_PLANS: OvsPlan[] = [
  {
    name: "Website Sprint",
    price: 3800,
    unit: "fixed",
    text: "A fast-track high-converting landing page or full corporate website designed to convert traffic.",
    features: [
      "Custom responsive website / landing page",
      "High-converting copy & layout",
      "Technical SEO & analytics setup",
      "CMS integration & 2-week turnaround",
    ],
    cta: "Start a website",
  },
  {
    name: "Growth Partner",
    price: 6500,
    quarterly: 5850,
    unit: "/mo",
    text: "End-to-end design, web development, custom software updates, and active digital marketing.",
    features: [
      "Continuous web & software development",
      "Digital marketing (SEO, Ads & CRO)",
      "Weekly strategy & performance reviews",
      "Dedicated project manager & priority support",
    ],
    cta: "Book consultation",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Custom Software & E-Com",
    price: null,
    text: "Full-scale custom software application or bespoke high-volume e-commerce platform.",
    features: [
      "Bespoke software architecture / custom e-com",
      "Complex database & third-party API integrations",
      "Custom checkout, billing & portals",
      "Dedicated senior engineering team & SLA",
    ],
    cta: "Request a proposal",
  },
]

export const DEFAULT_FAQ: OvsFaq[] = [
  {
    q: "What digital services do you specialize in?",
    a: "We specialize in five core areas: high-converting Website & Landing Page Development, data-driven Digital Marketing & Performance Growth, Custom E-Commerce Websites, Custom Software & Web Applications, and UI/UX & Conversion Strategy.",
  },
  {
    q: "How does project pricing and billing work?",
    a: "We offer transparent fixed-price quotes for defined scopes (such as landing pages, websites, and initial e-commerce builds) and monthly partnership retainers for ongoing custom software development, feature iterations, and digital marketing management.",
  },
  {
    q: "Can you build custom software tailored to our specific business workflows?",
    a: "Yes. We engineer bespoke client portals, internal management dashboards, SaaS applications, and custom APIs built precisely around your operational requirements.",
  },
  {
    q: "How do your digital marketing services integrate with web development?",
    a: "Because our developers and marketers collaborate under one roof, your ad campaigns, SEO strategies, and landing pages are tightly unified to maximize conversion rates and return on ad spend (ROAS).",
  },
  {
    q: "Who owns the code, design assets, and marketing accounts?",
    a: "You have 100% full ownership of all source code, Figma design files, database schemas, domain assets, and advertising accounts from day one.",
  },
  {
    q: "How fast can we launch our project?",
    a: "Landing pages and marketing sites typically launch in 1 to 3 weeks. Custom e-commerce stores take 3 to 6 weeks, and full-scale custom software platforms take 4 to 8 weeks depending on scope.",
  },
]

export const DEFAULT_CTA = {
  title: "Ready to accelerate your digital growth?",
  text: "Tell us about your project. Whether you need a high-converting website, custom e-commerce store, bespoke software, or ROI-driven marketing, we'll deliver a tailored plan and fixed price.",
  button: "Schedule a free consultation",
}

export const DEFAULT_FOOTER = {
  columns: [
    {
      title: "Services",
      links: [
        { label: "Websites & Landing Pages", href: "#services" },
        { label: "Meta Ads", href: "#meta-ads" },
        { label: "Custom E-Commerce", href: "#services" },
        { label: "Custom Software", href: "#services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Our Clients", href: "#clients" },
        { label: "Selected Work", href: "#showcase" },
        { label: "All Projects", href: "/projects" },
        { label: "Our Process", href: "#process" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Pricing Plans", href: "#pricing" },
      ],
    },
    {
      title: "Get Started",
      links: [
        { label: "Start Your Project", href: "#contact" },
        { label: "Get a Custom Quote", href: "#contact" },
        { label: "Schedule a Discovery Call", href: "#contact" },
      ],
    },
  ],
  city: "San Francisco & Remote",
  timeZone: "America/Los_Angeles",
  note: "Websites · E-Commerce · Software · Digital Marketing.",
}
