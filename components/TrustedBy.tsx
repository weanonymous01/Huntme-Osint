import Image from "next/image";

const logos = [
  { name: "Apple", src: "/logos/apple.svg", h: 29 },
  { name: "Nike", src: "/logos/nike.svg", h: 17 },
  { name: "Microsoft", src: "/logos/microsoft.svg", h: 22 },
  { name: "Meta", src: "/logos/meta.svg", h: 21 },
  { name: "NASA", src: "/logos/nasa.svg", h: 17 },
  { name: "Netflix", src: "/logos/netflix.svg", h: 30 },
  { name: "NVIDIA", src: "/logos/nvidia.svg", h: 19 },
  { name: "Adobe", src: "/logos/adobe.svg", h: 24 },
  { name: "IBM", src: "/logos/ibm.svg", h: 17 },
  { name: "BMW", src: "/logos/bmw.svg", h: 26 },
  { name: "Mercedes-Benz", src: "/logos/mercedes.svg", h: 26 },
  { name: "Intel", src: "/logos/intel.svg", h: 17 },
  { name: "Volvo", src: "/logos/volvo.svg", h: 26 },
  { name: "Salesforce", src: "/logos/salesforce.svg", h: 24 },
  { name: "Databricks", src: "/logos/databricks.svg", h: 19 },
  { name: "Intuit", src: "/logos/intuit.svg", h: 17 },
  { name: "MIT", src: "/logos/mit.svg", h: 19 },
  { name: "Walmart", src: "/logos/walmart.svg", h: 17 },
  { name: "Visa", src: "/logos/visa.svg", h: 17 },
];

export default function TrustedBy() {
  return (
    <section className="pt-10 pb-10 md:pt-12 md:pb-12 bg-[#09090b] w-full border-t border-neutral-800/80">
      <p className="mx-auto max-w-4xl px-6 text-center text-sm font-sans text-neutral-400">
        Trusted by more than 9M developers
      </p>

      <div className="relative mt-8 overflow-hidden w-full">
        {/* Left & Right gradient fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#09090b] to-transparent md:w-36" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#09090b] to-transparent md:w-36" />

        {/* Marquee row */}
        <div className="flex w-max animate-marquee items-center motion-reduce:animate-none">
          {/* First loop */}
          <div className="flex shrink-0 items-center">
            {logos.map((logo, idx) => (
              <Image
                key={`logo-1-${idx}`}
                src={logo.src}
                alt={logo.name}
                width={80}
                height={logo.h}
                className="mx-6 w-auto shrink-0 opacity-40 md:mx-9 invert grayscale hover:opacity-80 transition-opacity"
                style={{ height: `${logo.h}px` }}
              />
            ))}
          </div>

          {/* Duplicate loop for infinite continuous scroll */}
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {logos.map((logo, idx) => (
              <Image
                key={`logo-2-${idx}`}
                src={logo.src}
                alt={logo.name}
                width={80}
                height={logo.h}
                className="mx-6 w-auto shrink-0 opacity-40 md:mx-9 invert grayscale hover:opacity-80 transition-opacity"
                style={{ height: `${logo.h}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
