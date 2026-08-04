import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/buttons";
import { MARKETING_MAX_WIDTH } from "./constants";

export function Navbar() {
	return (
		<div className="bg-[#fafafa] border-b-[0.5px] border-solid border-[rgba(225,228,232,0.8)] h-14 dark:bg-[#171717] dark:border-[rgba(29,29,29,0.8)]">
			<div className={`mx-auto flex h-full w-full items-center justify-end gap-2 px-6 ${MARKETING_MAX_WIDTH}`}>
				<ThemeToggle />
				<Button href="/style-guide" variant="secondary">View components</Button>
			</div>
		</div>
	);
}
