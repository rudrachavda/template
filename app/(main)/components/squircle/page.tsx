"use client";

import { useTheme } from "next-themes";
import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text-styles";
import { Squircle } from "@/components/ui/squircle/Squircle";
import { ShowcaseGrid, type ShowcaseTileDef } from "@/components/layout/showcase-grid";
import { useMounted } from "@/hooks/use-mounted";

export default function SquirclePage() {
	// `Squircle`'s `fill` has no dark-mode pair of its own — same reason
	// `Button`/`ContentPane` need their own `useTheme()`/`useMounted()`
	// resolution (design.txt §10) — resolved here rather than in
	// `ShowcaseGrid`, which stays theme-agnostic like every other layout
	// primitive in this file.
	const mounted = useMounted();
	const { resolvedTheme } = useTheme();
	const isDark = mounted && resolvedTheme === "dark";
	const surfaceFill = isDark ? "#1d1d1d" : "#fafafa";

	const tiles: ShowcaseTileDef[] = [
		{
			title: "Classic squircle",
			description: "radius=12 exponent=5 smoothing=1 — the card/button idiom, a true superellipse, not CSS border-radius.",
			children: <Squircle radius={12} exponent={5} smoothing={1} fill={surfaceFill} stroke="var(--border-hairline)" strokeWidth={1} className="h-24 w-32" />,
		},
		{
			title: "Pill / circle",
			description: "radius=999 exponent=2 smoothing=1 — true circular math, not just a large border-radius.",
			children: <Squircle radius={999} exponent={2} smoothing={1} fill={surfaceFill} stroke="var(--border-hairline)" strokeWidth={1} className="h-24 w-24" />,
		},
		{
			title: "Squircle vs. CSS radius",
			description: "compare swaps the same radius to a plain border-radius arc, side by side — the corners are visibly different curves, not just a stylistic choice.",
			children: (
				<div className="flex items-center justify-center gap-4">
					<Squircle radius={20} exponent={5} smoothing={1} fill="none" stroke="#0069cc" strokeWidth={1.5} className="h-24 w-24" />
					<Squircle radius={20} exponent={5} smoothing={1} fill="none" stroke="#0069cc" strokeWidth={1.5} compare className="h-24 w-24" />
				</div>
			),
		},
	];

	return (
		<Section variant="full" className="px-4 py-8 sm:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
				<div className="flex flex-col gap-2">
					<Text variant="title">Squircle</Text>
					<Text variant="subtitle">A true superellipse via SVG path — see design.txt §4.</Text>
				</div>
				<ShowcaseGrid tiles={tiles} />
			</div>
		</Section>
	);
}
