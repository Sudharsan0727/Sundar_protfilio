# VayalCode — Web Development, E-Commerce & Meta Ads Agency

Portfolio and agency website for **VayalCode**, built with React, TypeScript, Vite, Tailwind CSS, GSAP ScrollTrigger, Lenis, and Framer Motion.

- **Live Demo**: [sundar-protfilio.vercel.app](https://sundar-protfilio.vercel.app/)
- **Repository**: [github.com/Sudharsan0727/Sundar_protfilio](https://github.com/Sudharsan0727/Sundar_protfilio)

---

## Key Features

- **Interactive Canopy Hero & Seasonal Themes**: Scroll-driven canopy animations with GSAP ScrollTrigger and switchable seasonal palettes (`summer`, `autumn`, `blossom`).
- **Services & Meta Ads**: Detailed service breakdowns with interactive previews and dedicated Meta Ads campaign highlights.
- **Featured Client Websites & Projects**: Interactive 3D card stack for client websites, plus a dedicated `/projects` view for browsing all projects.
- **Multi-Device Responsive Showcase**: Dedicated responsive preview section (Desktop, Tablet, Mobile) and mobile-optimized layouts across all sections.
- **Process, Manifesto & Metrics**: Scroll-triggered manifesto reveal, animated growth tree process steps, and client logo/testimonial sections.
- **Interactive Contact & 3D Globe**: Contact section featuring a D3/TopoJSON interactive globe alongside pricing and FAQ/finale sections.
- **Optimized Assets**: WebP imagery across logos, client projects, services, and device previews, plus lazy-loaded sections and routes.

---

## Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, custom CSS
- **Animations & Scroll**: GSAP (ScrollTrigger), Lenis, Framer Motion
- **Data & Graphics**: D3, TopoJSON, World Atlas, Lucide React

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build & Preview

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Structure

```text
├── index.html                  # Entry HTML with SEO & Open Graph metadata
├── package.json                # Dependencies and npm scripts
├── src/
│   ├── App.tsx                 # Root app, seasonal switcher, and /projects routing
│   ├── App.css                 # Global app & responsive styles
│   ├── Img/                    # WebP assets (logos, projects, services, screen sizes)
│   └── components/
│       ├── landing/
│       │   ├── pages/          # AllProjectsPage
│       │   └── sections/       # Hero, Manifesto, Services, Showcase, MetaAds,
│       │                       # Responsive, Process, Clients, Testimonials,
│       │                       # Pricing, Contact, Finale, Footer, Navbar
│       └── ui/                 # Core landing layout, 3D card stack, globe, cursor
└── vite.config.ts
```
