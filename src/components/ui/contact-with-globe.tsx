"use client";

import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Mail,
  Phone,
  User,
  Building,
  Check,
  Lock,
  Loader2,
  Copy,
} from "lucide-react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import worldDataJson from "world-atlas/countries-110m.json";
import type {
  Topology,
  GeometryCollection,
  GeometryObject,
} from "topojson-specification";
import type { GeoPermissibleObjects } from "d3";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

interface GlobeWireframeProps {
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  graticuleColor?: string;
  graticuleOpacity?: number;
  sphereOutlineColor?: string;
  sphereOutlineWidth?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialRotation?: [number, number];
  enableInteraction?: boolean;
  showGraticule?: boolean;
  variant?: "wireframe" | "wireframesolid" | "solid";
  scale?: number;
  backgroundColor?: string;
}

interface GeoFeature {
  type: string;
  geometry: GeometryObject;
  properties: Record<string, unknown>;
}

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection;
  };
}

// Extract countries synchronously from local bundle
const countriesData: GeoFeature[] = (
  feature(
    worldDataJson as unknown as Topology,
    (worldDataJson as unknown as WorldAtlasTopology).objects.countries,
  ) as unknown as { features: GeoFeature[] }
).features;

export function GlobeWireframe({
  width,
  height,
  className = "aspect-square w-full max-w-[280px] sm:max-w-[320px]",
  strokeColor = "currentColor",
  strokeWidth = 0.8,
  graticuleColor = "currentColor",
  graticuleOpacity = 0.15,
  sphereOutlineColor = "currentColor",
  sphereOutlineWidth = 1.2,
  autoRotate = true,
  autoRotateSpeed = 0.45,
  initialRotation = [0, -15],
  enableInteraction = true,
  showGraticule = true,
  scale = 1,
  backgroundColor = "transparent",
}: GlobeWireframeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<[number, number]>(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);
  const animationFrame = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 280, height: 280 });

  const finalWidth = width || dimensions.width || 280;
  const finalHeight = height || dimensions.height || 280;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const updateDimensions = () => {
      const w = container.offsetWidth || 280;
      setDimensions({ width: w, height: w });
    };
    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!autoRotate || isDragging) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      return;
    }

    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      animationFrame.current = requestAnimationFrame(rotate);
    };

    animationFrame.current = requestAnimationFrame(rotate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [autoRotate, autoRotateSpeed, isDragging]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!enableInteraction) return;
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !enableInteraction) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = currentMouse[0] - lastMouse[0];
    const dy = currentMouse[1] - lastMouse[1];

    setRotation((prev) => [
      prev[0] + dx * 0.45,
      Math.max(-80, Math.min(80, prev[1] - dy * 0.45)),
    ]);

    setLastMouse(currentMouse);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (!svgRef.current || countriesData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (backgroundColor !== "transparent") {
      const radius = (Math.min(finalWidth, finalHeight) / 2) * scale * 0.9;
      svg
        .append("circle")
        .attr("cx", finalWidth / 2)
        .attr("cy", finalHeight / 2)
        .attr("r", radius)
        .attr("fill", backgroundColor);
    }

    const projection = d3
      .geoOrthographic()
      .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.88)
      .translate([finalWidth / 2, finalHeight / 2])
      .rotate([rotation[0], rotation[1]])
      .precision(0.1);

    const path = d3.geoPath().projection(projection);

    // Graticules
    if (showGraticule && graticuleOpacity > 0) {
      try {
        const graticule = d3.geoGraticule();
        const graticulePath = path(graticule());
        if (graticulePath) {
          svg
            .append("path")
            .datum(graticule())
            .attr("d", graticulePath)
            .attr("fill", "none")
            .attr("stroke", graticuleColor)
            .attr("stroke-width", 0.7)
            .attr("opacity", graticuleOpacity);
        }
      } catch (error) {
        console.error("Graticule render error:", error);
      }
    }

    // Countries
    svg
      .selectAll(".country")
      .data(countriesData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d: GeoFeature) => {
        try {
          return path(d as unknown as GeoPermissibleObjects) || "";
        } catch {
          return "";
        }
      })
      .attr("fill", "none")
      .attr("stroke", strokeColor)
      .attr("stroke-width", strokeWidth)
      .attr("opacity", 0.85);

    // Sphere outline
    try {
      const sphereOutline = path({ type: "Sphere" });
      if (sphereOutline) {
        svg
          .append("path")
          .datum({ type: "Sphere" })
          .attr("d", sphereOutline)
          .attr("fill", "none")
          .attr("stroke", sphereOutlineColor)
          .attr("stroke-width", sphereOutlineWidth)
          .attr("opacity", 0.9);
      }
    } catch (error) {
      console.error("Sphere outline render error:", error);
    }
  }, [
    rotation,
    finalWidth,
    finalHeight,
    strokeColor,
    strokeWidth,
    graticuleColor,
    graticuleOpacity,
    sphereOutlineColor,
    sphereOutlineWidth,
    showGraticule,
    scale,
    backgroundColor,
  ]);

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      <svg
        ref={svgRef}
        width={finalWidth}
        height={finalHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full"
        style={{
          cursor: enableInteraction ? (isDragging ? "grabbing" : "grab") : "default",
        }}
      />
    </div>
  );
}

const SERVICES = [
  "Web Application",
  "E-Commerce Platform",
  "Mobile App (iOS/Android)",
  "UI/UX & Brand Design",
  "Custom Software & API",
  "Dedicated Squad",
];

const BUDGETS = ["< $15,000", "$15k – $30k", "$30k – $60k", "$60,000+"];

interface ContactWithGlobeProps {
  title?: string;
  subtitle?: string;
  description?: string;
  email?: string;
  copied?: boolean;
  onCopyEmail?: () => void;
  className?: string;
}

export default function ContactWithGlobe({
  title = "Let’s build something exceptional.",
  subtitle = "( 07 ) Start a Project",
  description = "Have an ambitious project in mind, need a specialized sprint, or seeking an ongoing digital partner? We’d love to hear from you.",
  email = "hello@overstory.studio",
  copied = false,
  onCopyEmail,
  className,
}: ContactWithGlobeProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Web Application",
  ]);
  const [selectedBudget, setSelectedBudget] = useState<string>("$15k – $30k");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section
      id="contact"
      data-sec="contact"
      className={cn(
        "relative w-full py-24 sm:py-32 lg:py-36 overflow-hidden flex flex-col items-center justify-center",
        className,
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16 md:mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{subtitle}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.14]"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
          {/* Left Column: 3D Globe Card & Studio Info */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Globe Card */}
            <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-7 shadow-sm flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Accepting Q1 & Q2 Projects</span>
              </div>
              <h3 className="text-xl font-serif text-zinc-900 dark:text-zinc-100">
                Global Engineering Squad
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-3">
                Operating across SF (PST), NYC (EST), and London (GMT).
              </p>

              {/* Globe Wireframe Stage */}
              <div className="my-2 w-full flex items-center justify-center">
                <GlobeWireframe
                  className="w-full aspect-square max-w-[270px] sm:max-w-[300px] text-zinc-800 dark:text-zinc-200"
                  autoRotate
                  autoRotateSpeed={0.4}
                  strokeWidth={0.7}
                  graticuleOpacity={0.15}
                />
              </div>

              {/* Direct Email with Copy */}
              <div className="w-full mt-4 p-3 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between gap-3">
                <div className="truncate text-left">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                    Direct Email
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCopyEmail}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition shadow-xs cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-800/40 p-6 sm:p-7">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                <span>✦ Why Founders Partner With Us</span>
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Fixed Milestone Estimates:</strong> Guaranteed delivery timelines with zero surprise hourly overages.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>100% IP Ownership:</strong> Clean source code, Figma design systems & assets handed over upon delivery.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Direct Senior Squad:</strong> No junior account managers — direct Slack collaboration with lead architects.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Column: Premium High-Padding Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="lg:col-span-7 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-12 shadow-2xl shadow-zinc-950/5 flex flex-col gap-6"
          >
            {submitted ? (
              <div className="py-16 px-4 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-2 border border-emerald-300 dark:border-emerald-800">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-zinc-900 dark:text-white">
                  Inquiry Received Successfully!
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-zinc-900 dark:text-white">{formData.name || "friend"}</span>. Our technical leads are reviewing your project requirements and will reply to <span className="font-semibold text-zinc-900 dark:text-white">{formData.email}</span> within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", company: "", phone: "", message: "" });
                    }}
                    className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-zinc-900 dark:text-white mb-1">
                    Project Inquiry & Specifications
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    Tell us about your product, required features, and target launch timeframe.
                  </p>
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

                {/* Service Selection Chips */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 mb-2.5">
                    What services do you require? <span className="text-emerald-600 dark:text-emerald-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {SERVICES.map((srv) => {
                      const isSelected = selectedServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => toggleService(srv)}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs scale-[1.02]"
                              : "bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{srv}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 1: Name & Email with Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="form-name"
                      className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400"
                    >
                      Your Full Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
                      <input
                        id="form-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Sundar Pichai"
                        className="w-full bg-zinc-50/70 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="form-email"
                      className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400"
                    >
                      Work Email Address <span className="text-emerald-600 dark:text-emerald-400">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
                      <input
                        id="form-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sundar@company.com"
                        className="w-full bg-zinc-50/70 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Company & Phone with Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="form-company"
                      className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400"
                    >
                      Company / Organization
                    </label>
                    <div className="relative flex items-center">
                      <Building className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
                      <input
                        id="form-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Corp"
                        className="w-full bg-zinc-50/70 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="form-phone"
                      className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400"
                    >
                      Phone / WhatsApp <span className="text-zinc-400 normal-case">(optional)</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
                      <input
                        id="form-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-zinc-50/70 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget Selection Chips */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 mb-2.5">
                    Approximate Budget (USD) <span className="text-emerald-600 dark:text-emerald-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {BUDGETS.map((bgt) => {
                      const isSelected = selectedBudget === bgt;
                      return (
                        <button
                          key={bgt}
                          type="button"
                          onClick={() => setSelectedBudget(bgt)}
                          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium text-center transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                              : "bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          {bgt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="form-message"
                    className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400"
                  >
                    Project Details & Goals <span className="text-emerald-600 dark:text-emerald-400">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about what you're building, key milestones, target launch date, or existing designs..."
                    className="w-full bg-zinc-50/70 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3.5 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all shadow-xs resize-y"
                  />
                </div>

                {/* Submit Row */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm sm:text-base tracking-wide transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>100% confidential. NDAs signed upon request.</span>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
