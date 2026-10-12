"use client";

import React from "react";
import Link from "next/link";

export default function Closer() {
  return (
    <section
      id="closer"
      className="flex w-full flex-col items-center justify-center bg-[#09090b] border-t border-neutral-800/80 px-6 py-20 text-center font-sans md:py-28"
    >
      <h2 className="font-sans max-w-4xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight text-white md:whitespace-nowrap">
        Intelligence in Seconds
      </h2>

      <p className="mt-4 max-w-2xl text-sm sm:text-base text-neutral-400 font-normal leading-relaxed text-balance">
        Powered by billions of data points. Built on a high-speed OSINT framework.
      </p>

      <Link
        href="/products/phone-osint"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-neutral-900 hover:bg-neutral-200 transition-colors shadow-xs"
      >
        Search Now
      </Link>
    </section>
  );
}
