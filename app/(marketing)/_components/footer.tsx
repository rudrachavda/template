import { Text } from "@/components/typography/text-styles";

// Fixed to the viewport bottom, behind the Shadow-wrapped main content in
// layout.tsx (z-0 vs z-10) — this is what gets revealed as the page scrolls.
// Height (h-14) is paired with the spacer div of the same height in
// layout.tsx; keep the two in sync if this changes.
export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="bg-[#f0f0f0] fixed inset-x-0 bottom-0 z-0 flex h-14 items-center px-6 dark:bg-[#171717]">
			<div className="mx-auto flex w-full max-w-173 items-center justify-between">
				<Text variant="secondary">© {year} Template</Text>
				<Text
					variant="secondary"
					as="a"
					href="/style-guide"
					className="transition-colors duration-200 hover:text-[#1d1d1d] dark:hover:text-[#f0f0f0]"
				>
					Components
				</Text>
			</div>
		</footer>
	);
}
