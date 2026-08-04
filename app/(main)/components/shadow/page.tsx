"use client";

import { useTheme } from "next-themes";
import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text-styles";
import { Squircle } from "@/components/ui/squircle/Squircle";
import { getLayeredDropShadow } from "@/components/ui/shadow";
import { ShowcaseGrid, type ShowcaseTileDef } from "@/components/layout/showcase-grid";
import { useMounted } from "@/hooks/use-mounted";

export default function ShadowPage() {
	// `Squircle`'s `fill` has no dark-mode pair of its own (same reason
	// `Button`/`ContentPane` need their own `useTheme()`/`useMounted()`
	// resolution, design.txt §10) — resolved here for the same reason.
	const mounted = useMounted();
	const { resolvedTheme } = useTheme();
	const isDark = mounted && resolvedTheme === "dark";
	const surfaceFill = isDark ? "#1d1d1d" : "#fafafa";

	const tiles: ShowcaseTileDef[] = [
		{
			title: "Default elevation",
			description: "elevation=1 intensity=1 — getLayeredDropShadow, the Squircle-safe counterpart to Shadow's box-shadow (see design.txt §5).",
			children: (
				<Squircle
					radius={16}
					exponent={5}
					smoothing={1}
					fill={surfaceFill}
					stroke="var(--border-hairline)"
					strokeWidth={1}
					className="h-full w-full"
					style={{ filter: getLayeredDropShadow("#1a2b3b", 1, 1) }}
				/>
			),
		},
		{
			title: "muted elevation",
			description: "elevation and intensity scale the whole layered stack independently.",
			children: (
				<Squircle
					radius={16}
					exponent={5}
					smoothing={1}
					fill={surfaceFill}
					stroke="var(--border-hairline)"
					strokeWidth={1}
					className="h-full w-full"
					style={{ filter: getLayeredDropShadow("#1a2b3b", 0.3, 0.3) }}
				/>
			),
		},
		{
			title: "Custom tint",
			description: "The same hexColor tinting as getLayeredShadow — just fed through drop-shadow layers instead of box-shadow ones.",
			children: (
				<Squircle
					radius={16}
					exponent={5}
					smoothing={1}
					fill={surfaceFill}
					stroke="var(--border-hairline)"
					strokeWidth={1}
					className="h-full w-full"
					style={{ filter: getLayeredDropShadow("#0069cc", 1, 1.1) }}
				/>
			),
		},
	];

	return (
		<Section variant="full" className="px-4 py-8 sm:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
				<div className="flex flex-col gap-2 ml-6 md:ml-8">
					<Text variant="title">Shadow</Text>
					<Text variant="subtitle">A layered elevation stack, here via drop-shadow so it stays correct on a Squircle&apos;s curve — see design.txt §5.</Text>
				</div>
				<ShowcaseGrid tiles={tiles} />
			</div>
		</Section>
	);
}
