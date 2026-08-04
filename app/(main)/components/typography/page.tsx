"use client";

import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text-styles";
import { ShowcaseGrid, type ShowcaseTileDef } from "@/components/layout/showcase-grid";

const TILES: ShowcaseTileDef[] = [
	{
		title: "Title",
		description: "variant=\"title\" — the primary text color pair, leading-snug.",
		children: <Text variant="title">Design systems, done simply</Text>,
	},
	{
		title: "Subtitle",
		description: "variant=\"subtitle\" — muted #646464, leading-snug.",
		children: <Text variant="subtitle">A shorter line beneath a title</Text>,
	},
	{
		title: "Paragraph",
		description: "variant=\"paragraph\" — primary color, leading-relaxed.",
		children: <Text variant="paragraph">Runs at text-sm, leading-relaxed, on the primary text color pair.</Text>,
	},
	{
		title: "Secondary",
		description: "variant=\"secondary\" — muted #a1a1a1, for dates and de-emphasized detail.",
		children: <Text variant="secondary">Secondary text is muted — used for dates, counts, and captions.</Text>,
	},
	{
		title: "Label",
		description: "variant=\"label\" — uppercase, tracking-wide.",
		children: <Text variant="label">Section label</Text>,
	},
	{
		title: "Custom size",
		description: "Every variant keeps its color/leading rules and takes a size override via className.",
		children: (
			<Text variant="title" className="text-2xl">
				Bigger title
			</Text>
		),
	},
];

export default function TypographyPage() {
	return (
		<Section variant="full" className="px-4 py-8 sm:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
				<div className="flex flex-col gap-2 ml-6 md:ml-8">
					<Text variant="title">Typography</Text>
					<Text variant="subtitle">One text size per role, color and leading do the differentiating — see design.txt §2.</Text>
				</div>
				<ShowcaseGrid tiles={TILES} />
			</div>
		</Section>
	);
}
