"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SquareArrowOutUpRight } from "lucide-react";
// Cross-framework Link component (compatible with Vite, React, Next.js)
const Link = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>(({ href, children, ...props }, ref) => (
  <a ref={ref} href={href} {...props}>
    {children}
  </a>
));
Link.displayName = "Link";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion */
  springStiffness?: number;
  springDamping?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,

  cardWidth = 520,
  cardHeight = 320,

  overlap = 0.48,
  spreadDeg = 38,

  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,

  showDots = true,
  className,

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);
  const [vw, setVw] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  React.useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const effWidth = vw < 640 ? Math.min(cardWidth, vw - 36) : cardWidth;
  const effHeight = Math.round(effWidth * (cardHeight / cardWidth));

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      className={cn("w-full flex flex-col items-center", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full"
        style={{ height: Math.max(250, effHeight + 52) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* background wash / spotlight (unique feel) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/40 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              // hide far-away cards cleanly
              if (!visible) return null;

              // fan geometry
              const rotateZ = off * stepDeg;
              const cardSpacing = Math.max(10, Math.round(effWidth * (1 - overlap)));
              const x = off * cardSpacing;
              const y = 0; // level baseline so side cards do not dip down towards dots
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;

              const rotateX = isActive ? 0 : tiltXDeg;

              const zIndex = 100 - abs;

              // drag only on the active card
              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e: any,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, effWidth * 0.22);

                      // swipe logic
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-2 sm:bottom-3 rounded-2xl border-4 border-white/15 overflow-hidden shadow-2xl",
                    "will-change-transform select-none",
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: effWidth,
                    maxWidth: "calc(100vw - 32px)",
                    height: effHeight,
                    left: `calc(50% - min(${effWidth}px, calc(100vw - 32px)) / 2)`,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    // framer doesn't support translateZ directly in animate on all setups,
                    // so we use a custom transform via style below.
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  // translateZ via style transform (kept stable w/ motion values above)
                  // We apply translateZ by using a CSS transform in a child wrapper.
                    onClick={() => setActive(i)}
                    onMouseEnter={() => {
                      if (isActive) setHovering(true);
                    }}
                    onMouseLeave={() => {
                      if (isActive) setHovering(false);
                    }}
                    {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Active Card Title & Description Below the Cards */}
      <div
        className="w-full flex flex-col items-center justify-center text-center px-4 min-h-[72px]"
        style={{ marginTop: 4 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-xl"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight font-[family-name:var(--ovs-sans)]">
              {activeItem.title}
            </h3>
            {activeItem.description ? (
              <p
                className="text-sm sm:text-base text-white/70 max-w-md leading-relaxed font-[family-name:var(--ovs-sans)]"
                style={{ marginTop: 8 }}
              >
                {activeItem.description}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation: Arrows and Centered Dots */}
      {showDots ? (
        <div
          className="w-full flex items-center justify-center"
          style={{ marginTop: 28, marginBottom: 16 }}
        >
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Previous Arrow Button */}
            <button
              type="button"
              onClick={prev}
              disabled={!canGoPrev}
              aria-label="Previous card"
              style={{
                color: "var(--ovs-soft, #cbf34d)",
                borderColor: "color-mix(in srgb, var(--ovs-soft, #cbf34d) 35%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--ovs-soft, #cbf34d) 10%, transparent)",
              }}
              className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer text-sm font-medium shadow-sm"
            >
              ←
            </button>

            {/* Clean Dots */}
            <div className="flex items-center gap-3">
              {items.map((it, idx) => {
                const on = idx === active;
                return (
                  <button
                    key={it.id}
                    onClick={() => setActive(idx)}
                    style={{
                      backgroundColor: on
                        ? "var(--ovs-soft, #cbf34d)"
                        : "color-mix(in srgb, var(--ovs-soft, #cbf34d) 35%, transparent)",
                      boxShadow: on
                        ? "0 0 14px color-mix(in srgb, var(--ovs-soft, #cbf34d) 50%, transparent)"
                        : "none",
                    }}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                      on ? "w-7" : "w-2.5 hover:opacity-80",
                    )}
                    aria-label={`Go to ${it.title}`}
                  />
                );
              })}
            </div>

            {/* Next Arrow Button */}
            <button
              type="button"
              onClick={next}
              disabled={!canGoNext}
              aria-label="Next card"
              style={{
                color: "var(--ovs-soft, #cbf34d)",
                borderColor: "color-mix(in srgb, var(--ovs-soft, #cbf34d) 35%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--ovs-soft, #cbf34d) 10%, transparent)",
              }}
              className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer text-sm font-medium shadow-sm"
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item, active }: { item: CardStackItem; active: boolean }) {
  const linkHref = item.href || "#contact";
  const isExternal = /^https?:\/\//i.test(linkHref);

  return (
    <div className="group relative h-full w-full">
      {/* image */}
      <div className="absolute inset-0 overflow-hidden">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className={cn(
              "h-full w-full object-cover transition-all duration-500 ease-out",
              active
                ? "blur-0 scale-100 brightness-100 group-hover:scale-105 group-hover:brightness-85"
                : "blur-[5px] scale-105 brightness-75",
            )}
            draggable={false}
            loading={active ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* hover CTA button on active card */}
      {active ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <Link
            href={linkHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            onClick={(e) => e.stopPropagation()}
            className="ovs-cs-livebtn"
          >
            <span className="ovs-cs-livedot" aria-hidden="true" />
            <span>{item.ctaLabel || "Live Website"}</span>
            <span className="ovs-cs-liveico" aria-hidden="true">
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
