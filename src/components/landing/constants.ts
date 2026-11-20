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

export const DEFAULT_LINKS: OvsLink[] = [
  { label: "Services", href: "#services" },
  { label: "Showcase", href: "#showcase" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
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
  { name: "AuraStore", mark: "knot", type: "heavy" },
  { name: "NovaScale", mark: "slash", type: "heavy" },
  { name: "OmniOps", mark: "watch", type: "serif" },
  { name: "ElevateHQ", mark: "venn", type: "sans" },
  { name: "ScribeGrowth", mark: "scribe", type: "sans" },
]

export const DEFAULT_MANIFESTO = {
  kicker: "Your Digital Partner",
  text: "We design and build high-converting websites, e-commerce, custom software, and marketing. [team] From concept to launch, [chart] we turn clicks into revenue that scales.",
}

export const DEFAULT_STATS: OvsStat[] = [
  { value: 150, suffix: "+", label: "websites & custom platforms delivered" },
  { value: 45, prefix: "$", suffix: "M+", label: "client revenue generated across channels" },
  { value: 4, suffix: "x", label: "average conversion rate improvement" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "client satisfaction rating across all projects" },
]

export const DEFAULT_SERVICES: OvsService[] = [
  {
    title: "Website & Landing Page Development",
    art: "site",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    time: "1 to 3 weeks",
    text: "High-speed, conversion-focused websites and landing pages engineered to turn visitors into buyers.",
    tags: ["Landing Pages", "Web Development", "Speed & SEO"],
  },
  {
    title: "Digital Marketing & Performance Growth",
    art: "brand",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    time: "Ongoing retainers",
    text: "Targeted paid ads, search engine rankings, and conversion funnels that scale pipeline revenue.",
    tags: ["SEO Growth", "Paid Ads", "CRO Funnels"],
  },
  {
    title: "Custom E-Commerce Websites",
    art: "system",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
    time: "3 to 6 weeks",
    text: "Bespoke online storefronts with frictionless 1-click checkout, fast loading, and inventory syncing.",
    tags: ["Online Stores", "Headless & Shopify", "Cart CRO"],
  },
  {
    title: "Custom Software & Web Applications",
    art: "code",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    time: "4 to 8 weeks",
    text: "Full-stack SaaS platforms, secure client portals, and bespoke API architecture built for scale.",
    tags: ["SaaS Platforms", "Client Portals", "API Systems"],
  },
  {
    title: "UI/UX & Conversion Strategy",
    art: "product",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
    time: "2 to 4 weeks",
    text: "Intuitive Figma prototypes, user journeys, and UX audits that maximize customer retention.",
    tags: ["UI/UX Design", "Wireframing", "Figma Systems"],
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
    a: "We specialize in four core areas: high-converting Website & Landing Page Development, data-driven Digital Marketing, Custom E-Commerce Website Development, and Custom Software / Web Application Engineering.",
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
        { label: "Digital Marketing", href: "#services" },
        { label: "Custom E-Commerce", href: "#services" },
        { label: "Custom Software", href: "#services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Showcase", href: "#showcase" },
        { label: "Our Process", href: "#process" },
        { label: "Pricing Plans", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "LinkedIn" },
        { label: "X / Twitter" },
        { label: "Instagram" },
        { label: "GitHub" },
      ],
    },
  ],
  city: "San Francisco & Remote",
  timeZone: "America/Los_Angeles",
  note: "Websites · E-Commerce · Software · Digital Marketing.",
}
