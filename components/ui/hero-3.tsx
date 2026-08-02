import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export function HeroSection() {
	return (
		<section className="mx-auto w-full max-w-5xl overflow-hidden pt-16">
			{/* Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 size-full overflow-hidden"
			>
				<div
					className={cn(
						"absolute inset-0 isolate -z-10",
						"bg-[radial-gradient(20%_80%_at_20%_0%,rgba(120,120,120,0.15),transparent)]"
					)}
				/>
			</div>
			<div className="relative z-10 flex max-w-2xl flex-col gap-5 px-4">
				<a
					className={cn(
						"group flex w-fit items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 shadow-xl backdrop-blur-md",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out hover:border-zinc-700"
					)}
					href="/products/phone-osint"
				>
					<div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 shadow-sm">
						<p className="font-mono text-[11px] font-bold text-emerald-400">NEXT-GEN OSINT</p>
					</div>

					<span className="text-xs text-zinc-300 font-medium">AI-Powered Intelligence Engine</span>
					<span className="block h-3.5 border-l border-zinc-800" />

					<div className="pr-1 text-zinc-400 group-hover:text-white">
						<ArrowRightIcon className="size-3.5 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
					</div>
				</a>

				<h1
					className={cn(
						"text-balance font-bold text-4xl text-white tracking-tight leading-tight md:text-6xl",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out"
					)}
				>
					Next-Generation OSINT Intelligence Platform
				</h1>

				<p
					className={cn(
						"text-zinc-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl font-normal",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out"
					)}
				>
					Uncover hidden connections, carrier telemetry, vehicle registration records, and automated case summaries in seconds.
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex w-fit animate-in items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
					<Button asChild>
						<a href="/login">
							Get started{" "}
							<ArrowRightIcon className="size-4 ml-2" data-icon="inline-end" />
						</a>
					</Button>
				</div>
			</div>
			<div className="relative">
				<div
					className={cn(
						"absolute -inset-x-20 inset-y-0 -translate-y-1/3 scale-120 rounded-full",
						"bg-[radial-gradient(ellipse_at_center,rgba(120,120,120,0.15),transparent,transparent)]",
						"blur-[50px]"
					)}
				/>
				<div
					className={cn(
						"mask-b-from-60% relative mt-8 -mr-56 overflow-hidden px-2 sm:mt-12 sm:mr-0 md:mt-20",
						"fade-in slide-in-from-bottom-5 animate-in fill-mode-backwards delay-100 duration-1000 ease-out"
					)}
				>
						<img
						alt="Huntme Dashboard"
						className="z-2 w-full rounded-lg border border-zinc-800 object-cover shadow-2xl"
						src="/DashBoard-huntme.png"
					/>
				</div>
			</div>
		</section>
	);
}
