import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text-styles";

export default function AppHomePage() {
	return (
		<Section className="flex-col gap-2 py-8">
			<Text variant="title">App home</Text>
			<Text variant="subtitle">Placeholder landing page inside the sidebar shell — replace with the real app content.</Text>
		</Section>
	);
}
