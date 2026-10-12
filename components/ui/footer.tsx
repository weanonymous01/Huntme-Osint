'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border text-zinc-400 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          {/* Column 1: Brand & Logo (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <a href="/" className="inline-block">
              <span className="text-xl font-bold text-white tracking-tight">
                Huntme
              </span>
            </a>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Empowering investigators with innovative AI-powered OSINT solutions. Search faster, connect entity dots, and build structured reports together.
            </p>
          </div>


          {/* Column 2: Products & Solutions (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">
              Products & Modules
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/products/phone-osint" className="hover:text-white transition-colors">
                  Phone Number OSINT
                </a>
              </li>
              <li>
                <a href="/products/ai-case-solver" className="hover:text-white transition-colors">
                  AI Case Solver
                </a>
              </li>
              <li>
                <a href="/products/investigation-reports" className="hover:text-white transition-colors">
                  Investigation Reports
                </a>
              </li>
              <li>
                <a href="/products/rest-api" className="hover:text-white transition-colors">
                  Developer REST API
                </a>
              </li>
              <li>
                <a href="/products/enterprise-infrastructure" className="hover:text-white transition-colors">
                  Enterprise Infrastructure
                </a>
              </li>
              <li>
                <a href="/target-users" className="hover:text-white transition-colors">
                  Target Personas
                </a>
              </li>
              <li>
                <a href="/use-cases" className="hover:text-white transition-colors">
                  Investigation Use Cases
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support Pages (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/company/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>


          {/* Column 4: Contact Details (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">
              Contact Details
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              <p>DLF Cyber City, Phase 2, Gurugram, Haryana 122002, India</p>
              <p>
                <a href="mailto:your.weanonymous@gmail.com" className="hover:text-white transition-colors">
                  your.weanonymous@gmail.com
                </a>
              </p>

            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-zinc-900 text-center text-xs text-zinc-500 font-normal">
          <p>©2026 Huntme. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
