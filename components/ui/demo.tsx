'use client';

import { HeroSection } from "@/components/ui/hero-3";
import { Header } from "@/components/ui/header-3";
import { Feature108 } from "@/components/ui/shadcnblocks-com-feature108";
import { FeaturesSection } from "@/components/ui/features-section";
import { Footer } from "@/components/ui/footer";
import { PhoneCall, Car, BrainCircuit } from "lucide-react";

const demoData = {
  badge: "Platform Features",
  heading: "OSINT Solutions",
  description: "Phone intelligence, vehicle lookups, and AI-powered case analysis in one platform.",
  tabs: [
    {
      value: "tab-1",
      icon: <PhoneCall className="h-auto w-4 shrink-0" />,
      label: "Phone Intelligence",
      content: {
        badge: "Phone Lookup",
        title: "Phone Intelligence",
        description:
          "Search publicly available phone intelligence with AI-powered analysis and structured investigation reports.",
        buttonText: "Explore Phone OSINT",
        href: "/products/phone-osint",
        jsonFilename: "phone_telemetry.json",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg",
        imageAlt: "phone intelligence dashboard",
      },
    },
    {
      value: "tab-2",
      icon: <Car className="h-auto w-4 shrink-0" />,
      label: "Vehicle Intelligence",
      content: {
        badge: "Plate & VIN Search",
        title: "Vehicle Intelligence",
        description:
          "Access vehicle records instantly with AI-driven insights and comprehensive investigation summaries.",
        buttonText: "Explore Vehicle OSINT",
        href: "/products/vehicle-osint",
        jsonFilename: "vehicle_records.json",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-2.svg",
        imageAlt: "vehicle intelligence dashboard",
      },
    },
    {
      value: "tab-3",
      icon: <BrainCircuit className="h-auto w-4 shrink-0" />,
      label: "AI Assistant",
      content: {
        badge: "AI Analysis",
        title: "AI Assistant",
        description:
          "Analyze evidence, connect information, and generate complete investigation reports using AI.",
        buttonText: "Try AI Assistant",
        href: "/products/ai-case-solver",
        jsonFilename: "ai_case_analysis.json",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-3.svg",
        imageAlt: "ai assistant dashboard",
      },
    },
  ],
};

export default function DemoOne() {
	return (
		<div className="flex w-full flex-col">
			<Header />
			<main className="grow">
				<HeroSection />
				<Feature108 {...demoData} />
				<FeaturesSection />
			</main>
			<Footer />
		</div>
	);
}

export { Feature108 };
