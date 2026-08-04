"use client";

import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text-styles";
import { Button, Back, Copy } from "@/components/ui/buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShowcaseGrid, type ShowcaseTileDef } from "@/components/layout/showcase-grid";

const TILES: ShowcaseTileDef[] = [
	{
		title: "Variants",
		description: "solid / outline / ghost / secondary, plus an auto-detected external href.",
		children: (
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button variant="solid">Solid</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="secondary">Secondary</Button>
				<Button href="https://nextjs.org" variant="outline">
					External link
				</Button>
			</div>
		),
	},
	{
		title: "Color tiers",
		description: "main / primary / secondary — each backed by a --color-button-* token, re-brandable from one file.",
		children: (
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button variant="main">Main</Button>
				<Button variant="primary">Primary</Button>
				<Button variant="secondary">Secondary</Button>
			</div>
		),
	},
	{
		title: "Pill & custom shapes",
		description: "radius/exponent/smoothing pass straight through to the Squircle.",
		children: (
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button variant="solid" pill>
					Pill
				</Button>
				<Button variant="outline" radius={24} exponent={4}>
					Soft corner
				</Button>
				<Button variant="solid" radius={4} exponent={8}>
					Barely rounded
				</Button>
			</div>
		),
	},
	{
		title: "Icon buttons",
		description: "Back, Copy, and ThemeToggle — thin wrappers over Button (variant=\"secondary\" size=\"icon\").",
		children: (
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Back href="/app" />
				<Copy />
				<ThemeToggle />
			</div>
		),
	},
	{
		title: "Unstyled",
		description: "No Squircle at all by default — reappears as a stroke-only outline once border is passed.",
		children: (
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button variant="unstyled">Unstyled</Button>
				<Button variant="unstyled" border>
					+ border
				</Button>
			</div>
		),
	},
	{
		title: "Borders",
		description: "border/borderColor/strokeWidth work on any variant, not just outline.",
		children: (
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button variant="solid" border borderColor="#fc3e2f">
					Red border
				</Button>
				<Button variant="ghost" border>
					Ghost + border
				</Button>
				<Button variant="outline" border={false}>
					No border
				</Button>
			</div>
		),
	},
	{
		title: "Custom backgrounds",
		description: "background/textColor replace the currentColor-driven surface entirely with a literal color.",
		children: (
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button background="#0069cc" textColor="#fefefe">
					Accent blue
				</Button>
				<Button background="linear-gradient(135deg, #9659b9, #ee98b7)" textColor="#fefefe" border borderColor="transparent">
					Gradient
				</Button>
			</div>
		),
	},
	{
		title: "Dark-aware color",
		description: "darkBackground/darkTextColor swap in for dark mode — toggle the theme to see it change.",
		children: (
			<Button background="#0069cc" darkBackground="#50aef6" textColor="#fefefe" darkTextColor="#121212">
				Blue in light, lighter in dark
			</Button>
		),
	},
];

export default function ButtonsPage() {
	return (
		<Section variant="full" className="px-4 py-8 sm:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
				<div className="flex flex-col gap-2">
					<Text variant="title">Buttons</Text>
					<Text variant="subtitle">One general-purpose primitive — shape, color, and border are all open props, not a closed set of variants. See design.txt §6.</Text>
				</div>
				<ShowcaseGrid tiles={TILES} />
			</div>
		</Section>
	);
}
