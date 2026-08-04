import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/buttons";

export function Navbar() {
	return (
		<div className="bg-[#f0f0f0] border-b-[0.5px] border-solid border-[rgba(225,228,232,0.8)] flex items-center justify-end gap-2 h-14 px-6 py-4 dark:bg-[#171717] dark:border-[rgba(29,29,29,0.8)]">
			<ThemeToggle />
			<Button href="/style-guide" variant="outline">View components</Button>
		</div>
	);
}
