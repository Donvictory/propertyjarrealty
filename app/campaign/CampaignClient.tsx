"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";
import type { Property } from "@/lib/types";
import type { CampaignContent } from "@/lib/campaign";
import {
  type Currency,
  CURRENCY_LABELS,
  formatDisplay,
  parsePriceNGN,
} from "@/lib/currency";
import Link from "next/link";

interface CampaignClientProps {
  properties: Property[];
  initialContent: CampaignContent | null;
}

export default function CampaignClient({
  properties,
  initialContent,
}: CampaignClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [currency, setCurrency] = useState<Currency>("NGN");

  const filteredProperties = properties.filter((p) => {
    if (filter === "All") return true;
    const type = p.type?.toLowerCase() || "";
    const title = p.title?.toLowerCase() || "";
    const description = p.description?.toLowerCase() || "";

    if (filter === "Residential") return type.includes("residential");
    if (filter === "Commercial") return type.includes("commercial");
    if (filter === "Luxury")
      return title.includes("luxury") || description.includes("luxury");
    return true;
  });

  return (
    <main className="min-h-screen bg-off-white">
      {}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 mb-6 tracking-tight text-charcoal">
                {initialContent?.whyInvestTitle?.split(" ").map((word, i) =>
                  word === "Lagos?" ? (
                    <span key={i} className="text-brand">
                      {word}
                    </span>
                  ) : (
                    word + " "
                  ),
                ) ?? ""}
              </h2>

              <h3 className="text-lg font-bold tracking-[0.2em] text-gray-400 mb-8">
                {initialContent?.whyInvestSubtitle}
              </h3>

              <ul className="space-y-4">
                {initialContent?.whyInvestPoints?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                    <p className="font-normal text-gray-700 leading-relaxed">
                      {item}
                    </p>
                  </li>
                )) ?? null}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:pl-6 w-full"
            >
              {/* Background decorative glow */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative overflow-hidden bg-white rounded-[2rem] p-8 md:p-10 border border-neutral-100 shadow-[0_20px_50px_rgba(128,0,32,0.06)] flex flex-col justify-between min-h-[380px]">
                {/* Gold/Brand Vertical Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-brand to-amber-400" />

                {/* Header Section */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2"></div>
                  <h4 className="text-lg font-serif  text-charcoal/40 text-brand mt-4">
                    Projected Growth
                  </h4>
                </div>

                {/* Core ROI Stat */}
                <div className="my-4 relative z-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-light font-serif tracking-tight text-brand">
                      {initialContent?.projectedRoi}
                    </span>
                  </div>
                  <p className="text-charcoal font-medium text-md mt-4 tracking-tight leading-tight">
                    {initialContent?.roiSubtext}
                  </p>
                </div>

                {/* Footer Section: Trust Indicators */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between relative z-10">
                  <div className="flex flex-col"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-medium text-neutral-800 tracking-tight mb-4">
                The Selection
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Explore our curated selection of high-yield assets. Select a
                property to view its full investment summary and request the
                confidential brochure.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                  Category Filter
                </label>
                <div className="relative group">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none w-full bg-white border border-gray-100 text-charcoal text-sm font-bold rounded-2xl px-6 py-3.5 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all shadow-sm cursor-pointer hover:border-brand/50"
                  >
                    {["All", "Residential", "Commercial", "Luxury"].map((f) => (
                      <option key={f} value={f}>
                        {f === "All" ? "All Categories" : f}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>
              </div>

              {}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                  Market Currency
                </label>
                <div className="relative group">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="appearance-none w-full bg-white border border-gray-100 text-charcoal text-sm font-bold rounded-2xl px-6 py-3.5 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all shadow-sm cursor-pointer hover:border-brand/50"
                  >
                    {(Object.keys(CURRENCY_LABELS) as Currency[]).map((c) => (
                      <option key={c} value={c}>
                        {CURRENCY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">
                  No properties found in this category.
                </p>
              </div>
            ) : (
              filteredProperties.map((property, index) => (
                <Link
                  key={property.id}
                  href={`/campaign/${property.id}?curr=${currency}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col h-full w-full"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden shrink-0 bg-off-white">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-charcoal px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100 shadow-sm">
                          {property.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-charcoal mb-2 leading-tight group-hover:text-brand transition-colors">
                        {property.title}
                      </h3>

                      <p className="text-gray-400 text-xs mb-4">
                        {property.location}
                      </p>

                      {property.pricingOptions &&
                      property.pricingOptions.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                          {property.pricingOptions.slice(0, 2).map((opt, i) => (
                            <div
                              key={i}
                              className="bg-brand/5 border border-brand/10 text-brand px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight"
                            >
                              {opt.size}: {opt.price}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-6 mt-auto">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">
                            Value
                          </p>
                          <p className="text-xl font-bold text-brand">
                            {formatDisplay(
                              parsePriceNGN(property.price),
                              currency,
                            )}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-brand font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all mt-auto pt-4 border-t border-gray-50">
                        View Summary <span>→</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 uppercase tracking-[0.3em] mb-2">
              Investment Options
            </h2>
            <div className="w-16 h-0.5 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialContent?.investmentOptions?.map((opt, i) => (
              <div
                key={i}
                className="bg-off-white p-8 rounded-[1rem] border border-gray-100 hover:border-brand/20 transition-all group"
              >
                <div className="text-2xl text-brand mb-6 font-bold">
                  {i === 0 ? "01" : i === 1 ? "02" : "03"}
                </div>
                <h3 className="font-semibold text-charcoal text-md tracking-tight mb-4">
                  {opt.title}
                </h3>
                <ul className="space-y-3">
                  {opt.points?.map((p, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-gray-500 font-medium leading-relaxed"
                    >
                      <span className="w-[5px] h-[5px] rounded-full bg-brand flex-shrink-0" />
                      {p}
                    </li>
                  )) ?? null}
                </ul>
              </div>
            )) ?? null}
          </div>
        </div>
      </section>

      {}
      <section id="offer-stack" className="py-16 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-neutral-800 uppercase tracking-[0.3em] mb-2">
              Offer Stack
            </h2>
            <div className="w-16 h-0.5 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initialContent?.offerStack?.map((offer, i) => {
              const isElite = offer.title?.includes("Elite") ?? false;
              const isSmart = offer.title?.includes("Smart") ?? false;
              return (
                <div
                  key={i}
                  className={`relative p-10 rounded-[1rem] border transition-all duration-500 flex flex-col h-full group
                    ${
                      isElite
                        ? "bg-brand/85 shadow-2xl lg:-mt-6 lg:mb-6 z-10"
                        : "bg-white border-gray-100 hover:border-brand/30 shadow-sm"
                    }`}
                >
                  {isElite && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2 rounded-full whitespace-nowrap shadow-xl">
                      Most Exclusive
                    </div>
                  )}

                  <div className="mb-8">
                    <h3
                      className={`text-xl font-bold uppercase tracking-tighter ${isElite ? "text-white" : "text-charcoal"}`}
                    >
                      {offer.title}
                    </h3>
                  </div>

                  <ul className="space-y-5 mb-10 flex-grow">
                    {offer.points?.map((p, j) => (
                      <li
                        key={j}
                        className={`flex items-start gap-3 text-sm font-medium leading-relaxed ${isElite ? "text-white/70" : "text-gray-500"}`}
                      >
                        <CheckCircle2
                          size={18}
                          className={`flex-shrink-0 mt-0.5 ${isElite ? "text-white" : "text-charcoal"}`}
                        />
                        {p}
                      </li>
                    )) ?? null}
                  </ul>

                  <button
                    onClick={() => {
                      router.push("/contact");
                    }}
                    className={`w-full px-6 py-3.5 rounded-2xl font-semibold text-sm tracking-widest transition-all active:scale-95 cursor-pointer
                    ${
                      isElite
                        ? "bg-white text-brand hover:bg-white/90"
                        : isSmart
                          ? "bg-charcoal text-white hover:bg-black"
                          : "border border-charcoal/20 hover:bg-charcoal/2 text-charcoal"
                    }`}
                  >
                    Inquire Now
                  </button>
                </div>
              );
            }) ?? null}
          </div>
        </div>
      </section>
    </main>
  );
}
