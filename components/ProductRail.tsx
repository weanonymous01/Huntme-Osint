"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const railItems = [
  { id: "rail-1", label: "Reliably fast" },
  { id: "rail-2", label: "Open Data Models" },
  { id: "rail-3", label: "Your data stays yours" },
  { id: "rail-4", label: "Predictable pricing" },
];

export default function ProductRail() {
  const [activeRail, setActiveRail] = useState("rail-1");
  const [progresses, setProgresses] = useState<Record<string, number>>({});

  useEffect(() => {
    const handleScroll = () => {
      const line = window.innerHeight * 0.35;
      const panels = railItems.map((item) => document.getElementById(item.id));

      let currentIndex = 0;
      for (let i = 0; i < panels.length; i++) {
        const panel = panels[i];
        if (panel && panel.getBoundingClientRect().top <= line) {
          currentIndex = i;
        }
      }

      const activeId = railItems[currentIndex].id;
      setActiveRail(activeId);

      const panel = panels[currentIndex];
      const nextPanel = panels[currentIndex + 1];

      if (panel) {
        const top = panel.getBoundingClientRect().top;
        const span = nextPanel
          ? nextPanel.getBoundingClientRect().top - top
          : panel.getBoundingClientRect().height;
        const p = span > 0 ? (line - top) / span : 0;
        const clamped = Math.max(0, Math.min(1, p));

        setProgresses({ [activeId]: clamped });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section className="bg-[#09090b] w-full py-16 md:py-24 font-sans text-white border-t border-neutral-800/80" id="rail">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-24">
          {/* Sticky Left Navigation */}
          <nav className="hidden md:block" aria-label="Product highlights">
            <div className="sticky top-24">
              {railItems.map((item) => {
                const isActive = activeRail === item.id;
                const fillProgress = isActive ? progresses[item.id] || 0.4 : 0;

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-3.5 text-base transition-colors ${isActive
                        ? "text-white font-medium"
                        : "text-neutral-400 hover:text-neutral-200"
                      }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="relative mt-2 block h-px w-full bg-neutral-800"
                    >
                      <span
                        className="rail-fill absolute left-0 top-0 block h-[2px] w-full origin-left bg-white"
                        style={{
                          transform: `scaleX(${isActive ? Math.max(0.15, fillProgress) : 0})`,
                        }}
                      />
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Right Content Panels */}
          <div className="space-y-24 md:space-y-36">
            {/* Panel 1: Reliably fast */}
            <article id="rail-1" className="scroll-mt-28">
              <h2 className="font-sans text-2xl font-medium tracking-tight md:text-3xl text-white">
                Reliably fast
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
                Huntme Osint connects across verified OSINT datasets to return relevant phone intelligence faster, with more data sources working together.
              </p>
              <figure className="mt-8">
                <div className="text-right text-xs text-neutral-400">search/sec</div>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)_3.5rem]">
                    <span className="truncate text-sm font-medium text-white">
                      Hunter
                    </span>
                    <span className="h-2.5 bg-white" style={{ width: "100%" }} />
                    <span className="text-right text-sm tabular-nums font-medium text-white">
                      195.6
                    </span>
                  </div>
                  <div className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)_3.5rem]">
                    <span className="truncate text-sm text-neutral-400">
                      Provider A
                    </span>
                    <span className="h-2.5 bg-neutral-700" style={{ width: "49.9%" }} />
                    <span className="text-right text-sm tabular-nums text-neutral-400">
                      97.6
                    </span>
                  </div>
                  <div className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)_3.5rem]">
                    <span className="truncate text-sm text-neutral-400">
                      Provider B
                    </span>
                    <span className="h-2.5 bg-neutral-700" style={{ width: "32.2%" }} />
                    <span className="text-right text-sm tabular-nums text-neutral-400">
                      63
                    </span>
                  </div>
                  <div className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)_3.5rem]">
                    <span className="truncate text-sm text-neutral-400">
                      Provider C
                    </span>
                    <span className="h-2.5 bg-neutral-700" style={{ width: "25.8%" }} />
                    <span className="text-right text-sm tabular-nums text-neutral-400">
                      50.5
                    </span>
                  </div>
                </div>
              </figure>
            </article>

            {/* Panel 2: Open Data Models */}
            <article id="rail-2" className="scroll-mt-28">
              <h2 className="font-sans text-2xl font-medium tracking-tight md:text-3xl text-white">
                Open Data Models
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
                Our data crawler uses open models and targeted queries to search, analyze, and connect millions of records for better results.
              </p>
              <div className="mt-8">
                <div className="mt-3 space-y-5">
                  {/* Phone Number */}
                  <div className="flex items-center">
                    <div className="flex w-40 shrink-0 items-center gap-2 sm:w-52">
                      <span className="truncate text-sm font-medium text-neutral-200">
                        Phone Number
                      </span>
                    </div>
                    <div className="hidden sm:block relative mx-4 h-2.5 min-w-0 flex-1">
                      <div className="absolute inset-y-0 left-0 w-[91.25%] bg-white" />
                      <div className="absolute left-[87.5%] top-1/2 h-px w-[7.5%] -translate-y-1/2 bg-neutral-500" />
                      <div className="absolute left-[87.5%] top-1/2 h-3 w-px -translate-y-1/2 bg-neutral-500" />
                      <div className="absolute left-[95%] top-1/2 h-3 w-px -translate-y-1/2 bg-neutral-500" />
                    </div>
                  </div>

                  {/* Data Crawler */}
                  <div className="flex items-center">
                    <div className="flex w-40 shrink-0 items-center gap-2 sm:w-52">
                      <span className="truncate text-sm font-medium text-neutral-200">
                        Data Crawler
                      </span>
                    </div>
                    <div className="hidden sm:block relative mx-4 h-2.5 min-w-0 flex-1">
                      <div className="absolute inset-y-0 left-0 w-[87.5%] bg-white" />
                      <div className="absolute left-[82.5%] top-1/2 h-px w-[10%] -translate-y-1/2 bg-neutral-500" />
                      <div className="absolute left-[82.5%] top-1/2 h-3 w-px -translate-y-1/2 bg-neutral-500" />
                      <div className="absolute left-[92.5%] top-1/2 h-3 w-px -translate-y-1/2 bg-neutral-500" />
                    </div>
                  </div>

                  {/* Open Models */}
                  <div className="flex items-center">
                    <div className="flex w-40 shrink-0 items-center gap-2 sm:w-52">
                      <span className="truncate text-sm font-medium text-neutral-200">
                        Open Models
                      </span>
                    </div>
                    <div className="hidden sm:block relative mx-4 h-2.5 min-w-0 flex-1">
                      <div className="absolute inset-y-0 left-0 w-[86.25%] bg-white" />
                      <div className="absolute left-[80%] top-1/2 h-px w-[12.5%] -translate-y-1/2 bg-neutral-500" />
                      <div className="absolute left-[80%] top-1/2 h-3 w-px -translate-y-1/2 bg-neutral-500" />
                      <div className="absolute left-[92.5%] top-1/2 h-3 w-px -translate-y-1/2 bg-neutral-500" />
                    </div>
                  </div>

                  {/* Verified Results */}
                  <div className="flex items-center">
                    <div className="flex w-40 shrink-0 items-center gap-2 sm:w-52">
                      <span className="truncate text-sm font-medium text-neutral-200">
                        Verified Results
                      </span>
                    </div>
                    <div className="hidden sm:block relative mx-4 h-2.5 min-w-0 flex-1">
                      <div className="absolute inset-y-0 left-0 w-[78.75%] bg-white" />
                      <div className="absolute left-[71.25%] top-1/2 h-px w-[15%] -translate-y-1/2 bg-neutral-500" />
                      <div className="absolute left-[71.25%] top-1/2 h-3 w-px -translate-y-1/2 bg-neutral-500" />
                      <div className="absolute left-[86.25%] top-1/2 h-3 w-px -translate-y-1/2 bg-neutral-500" />
                    </div>
                  </div>
                </div>

              </div>
            </article>

            {/* Panel 3: Your data stays yours */}
            <article id="rail-3" className="scroll-mt-28">
              <h2 className="font-sans text-2xl font-medium tracking-tight md:text-3xl text-white">
                Your data stays yours
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
                Your investigations stay private. We protects your searches and reports while giving you control over the intelligence you access.
              </p>
              <div className="mt-7 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-3 text-base font-medium text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4 shrink-0 text-neutral-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    Private
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                    Your searches aren't publicly visible.
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-3 text-base font-medium text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4 shrink-0 text-neutral-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                    Secure
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                    Your data is protected in transit and at rest.
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-3 text-base font-medium text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4 shrink-0 text-neutral-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                      />
                    </svg>
                    Controlled
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                    You control your searches and reports.
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-3 text-base font-medium text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4 shrink-0 text-neutral-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Responsible
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                    Built for legitimate and authorized investigations.
                  </p>
                </div>
              </div>
              <Link
                href="/privacy"
                className="mt-7 inline-block text-base text-neutral-400 underline underline-offset-4 hover:text-white"
              >
                How we handle data &rarr;
              </Link>
            </article>

            {/* Panel 4: Predictable pricing */}
            <article id="rail-4" className="scroll-mt-28">
              <h2 className="font-sans text-2xl font-medium tracking-tight md:text-3xl text-white">
                Predictable pricing
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
                No hidden limits or confusing pricing. Start free and upgrade or add
                more usage when you need more. Search reports are always free.
              </p>
              <div className="mt-8 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/60">
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-medium text-white">
                      Pro
                    </span>
                    <span className="text-2xl font-medium tabular-nums text-white">
                      ₹79
                      <span className="text-sm font-normal text-neutral-400">
                        /100
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">
                    Includes 100 credits of usage
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="mt-7 inline-block text-base text-neutral-400 underline underline-offset-4 hover:text-white"
              >
                See pricing &rarr;
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
