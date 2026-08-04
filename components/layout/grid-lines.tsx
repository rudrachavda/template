"use client";

// Decorative dashed-grid pieces from the marketing hero (originally scraped
// from nextjs.org's hero, reimplemented with our own tokens — see
// app/(marketing)/_components/hero.tsx for the full history). Shared here so
// any other grid/section layout — the component showcase pages, say — can
// reuse the exact same lines/circles instead of re-deriving them.

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Dash pattern: --line-width:1px, --line-gap:5px, 50% on / 50% off per repeat.
export const GRID_LINE_COLOR = "text-[rgba(29,29,29,0.2)] dark:text-[rgba(240,240,240,0.2)]";

export function VerticalLine({ side, className }: { side: "left" | "right"; className?: string }) {
	return (
		<motion.div
			aria-hidden
			// Start at 0 height, and grow to cover the container plus the 200px overhang (100px top + 100px bottom)
			initial={{ height: 0 }}
			whileInView={{ height: "calc(100% + 200px)" }}
			viewport={{ once: true }}
			transition={{ duration: 1, ease: "easeOut" }}
			className={cn(
				"absolute top-[-100px] w-px origin-top",
				"[background-image:repeating-linear-gradient(to_bottom,currentColor_0,currentColor_2.5px,transparent_2.5px,transparent_5px)]",
				"[mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]",
				GRID_LINE_COLOR,
				side === "left" ? "left-0" : "right-0",
				className,
			)}
		/>
	);
}

export function HorizontalLine({ className }: { className?: string }) {
	return (
		<div className={cn("relative w-full h-px", className)}>
			<motion.div
				aria-hidden
				// Start at 0 width, and grow to cover the container plus the 200px overhang (100px left + 100px right)
				initial={{ width: 0 }}
				whileInView={{ width: "calc(100% + 200px)" }}
				viewport={{ once: true }}
				transition={{ duration: 1.2, ease: "easeOut" }}
				className={cn(
					"absolute left-[-100px] top-0 h-px origin-left",
					"[background-image:repeating-linear-gradient(to_right,currentColor_0,currentColor_2.5px,transparent_2.5px,transparent_5px)]",
					"[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
					GRID_LINE_COLOR,
				)}
			/>
		</div>
	);
}

export function GridCircle({ className, rotate = 0 }: { className?: string; rotate?: 0 | 180 }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 75 75"
			className={cn("absolute size-16", GRID_LINE_COLOR, className)}
			style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
		>
			<path
				d="M74 37.5C74 30.281 71.8593 23.2241 67.8486 17.2217C63.838 11.2193 58.1375 6.541 51.4679 3.7784C44.7984 1.0158 37.4595 0.292977 30.3792 1.70134C23.2989 3.1097 16.7952 6.58599 11.6906 11.6906C6.58599 16.7952 3.1097 23.2989 1.70134 30.3792C0.292977 37.4595 1.0158 44.7984 3.7784 51.4679C6.541 58.1375 11.2193 63.838 17.2217 67.8486C23.2241 71.8593 30.281 74 37.5 74"
				fill="none"
				stroke="currentColor"
				strokeDasharray="2 2"
			/>
		</svg>
	);
}
