import * as React from "react"
import { Star, ExternalLink } from "lucide-react"

interface TestimonialItem {
  name: string
  role: string
  quote: string
  rating: number
  image: string
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Arjun Mehta",
    role: "CTO, FinTech Sol",
    quote:
      "Their ability to translate complex financial logic into a seamless user interface is unmatched. They exceeded our expectations.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
  },
  {
    name: "Sarah Jenkins",
    role: "Director, Orbit",
    quote:
      "The team delivered our SaaS platform 2 weeks ahead of schedule. The code quality is pristine and scalable.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ",
  },
  {
    name: "Michael Chen",
    role: "Founder, Nexus",
    quote:
      "We needed a complete rebrand and digital overhaul. They provided a vision that transformed our market presence.",
    rating: 4.8,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelC",
  },
  {
    name: "Priya Sharma",
    role: "VP Marketing, Lux",
    quote:
      "Their understanding of modern aesthetics and user behavior is top-tier. Our conversion rates doubled post-launch.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
  {
    name: "David Ross",
    role: "CEO, Civic Tech",
    quote:
      "A true partner in every sense. They didn't just build what we asked for, they improved upon our core ideas.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    name: "Elena Rodriguez",
    role: "Product Lead, Pulse",
    quote:
      "Exceptional communication and technical prowess. The easiest agency collaboration I've had in 10 years.",
    rating: 4.9,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
  },
]

function TestimonialCard({
  item,
  highlighted,
  onSelect,
}: {
  item: TestimonialItem
  highlighted: boolean
  onSelect: () => void
}) {
  return (
    <div
      onMouseEnter={onSelect}
      onClick={onSelect}
      className={`ovs-testi-card ${highlighted ? "is-on" : "is-off"}`}
    >
      <div className="ovs-testi-head">
        <div className="ovs-testi-author">
          <img
            src={item.image}
            alt={item.name}
            className={`w-12 h-12 rounded-full object-cover border-2 bg-zinc-800 transition-colors duration-500 ${
              highlighted ? "border-white/50" : "border-white/5"
            }`}
            loading="lazy"
          />
          <div>
            <h4
              className={`font-bold text-base transition-colors duration-500 font-[family-name:var(--ovs-sans)] ${
                highlighted ? "text-white" : "text-zinc-500"
              }`}
            >
              {item.name}
            </h4>
            <p
              className={`text-xs transition-colors duration-500 font-[family-name:var(--ovs-sans)] ${
                highlighted ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              {item.role}
            </p>
          </div>
        </div>

        <div
          className={`ovs-testi-badge ${
            highlighted ? "bg-white/20 text-white" : "bg-white/5 text-zinc-600"
          }`}
        >
          <span>{item.rating}</span>
          <Star
            className={`w-3 h-3 transition-colors duration-500 ${
              highlighted
                ? "text-yellow-400 fill-yellow-400"
                : "text-zinc-700 fill-zinc-700"
            }`}
          />
        </div>
      </div>

      <p
        className={`text-sm italic leading-relaxed transition-colors duration-500 font-[family-name:var(--ovs-sans)] ${
          highlighted ? "text-zinc-100" : "text-zinc-600"
        }`}
      >
        &ldquo;{item.quote}&rdquo;
      </p>
    </div>
  )
}

interface TestimonialsSectionProps {
  reviewHref?: string
  onReviewClick?: (e: React.MouseEvent) => void
}

export function TestimonialsSection({
  reviewHref = "#contact",
  onReviewClick,
}: TestimonialsSectionProps) {
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <section
      id="testimonials"
      data-sec="testimonials"
      aria-label="Client testimonials"
      className="ovs-testi"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Center ambient glow matching site accent */}
      <div aria-hidden="true" className="ovs-testi-glow" />

      <div className="ovs-testi-wrap">
        {/* Top Review CTA Pill */}
        <div className="ovs-testi-cta-row">
          <a
            href={reviewHref}
            onClick={onReviewClick}
            className="ovs-testi-btn group"
          >
            {/* Google G Icon */}
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Leave a Google Review</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Row 1: Top 2 Cards */}
        <div className="ovs-testi-row">
          <TestimonialCard
            item={TESTIMONIALS[0]!}
            highlighted={active === 0}
            onSelect={() => setActive(0)}
          />
          <TestimonialCard
            item={TESTIMONIALS[1]!}
            highlighted={active === 1}
            onSelect={() => setActive(1)}
          />
        </div>

        {/* Row 2: Left Card + Center Headline + Right Card */}
        <div className="ovs-testi-mid">
          <div className="ovs-testi-slot-left">
            <TestimonialCard
              item={TESTIMONIALS[2]!}
              highlighted={active === 2}
              onSelect={() => setActive(2)}
            />
          </div>

          <div className="ovs-testi-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl text-white font-light tracking-tight leading-tight font-[family-name:var(--ovs-sans)]">
              Driven by a
            </h2>
            <div className="flex flex-col items-center">
              <span
                className="text-5xl sm:text-6xl md:text-7xl italic -rotate-6 block leading-none font-[family-name:var(--ovs-serif)]"
                style={{ color: "var(--ovs-soft, #cbf34d)", margin: "6px 0 8px" }}
              >
                Performance
              </span>
              <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter leading-none font-[family-name:var(--ovs-sans)]">
                mindset
              </span>
            </div>
            <div className="ovs-testi-bar" />
          </div>

          <div className="ovs-testi-slot-right">
            <TestimonialCard
              item={TESTIMONIALS[3]!}
              highlighted={active === 3}
              onSelect={() => setActive(3)}
            />
          </div>
        </div>

        {/* Row 3: Bottom 2 Cards */}
        <div className="ovs-testi-row">
          <TestimonialCard
            item={TESTIMONIALS[4]!}
            highlighted={active === 4}
            onSelect={() => setActive(4)}
          />
          <TestimonialCard
            item={TESTIMONIALS[5]!}
            highlighted={active === 5}
            onSelect={() => setActive(5)}
          />
        </div>
      </div>
    </section>
  )
}
