"use client";

// A Server Component parent can't pass `DEFAULT_ITEMS` to `Sidebar` directly
// — `icon` holds an actual component reference (a function), and React
// can't serialize functions across the server/client boundary. Since this
// layout is pure composition (no server-only data fetching), marking it
// client too sidesteps that entirely; `children` still passes through as
// already-rendered content from further down the tree, same as any other
// client layout wrapping server page content.
import { HomeIcon, LayoutGridIcon } from "lucide-react";
import { Sidebar, type SidebarNavItem } from "./_components/sidebar";
import { ContentPane } from "./_components/content-pane";
import { ThemeToggle } from "@/components/theme-toggle";

const DEFAULT_ITEMS: SidebarNavItem[] = [
	{ icon: HomeIcon, label: "Home", href: "/app" },
	{ icon: LayoutGridIcon, label: "Components", href: "/style-guide" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen w-full overflow-hidden">
			<Sidebar items={DEFAULT_ITEMS} title="Template" footer={<ThemeToggle />} />
			<ContentPane>{children}</ContentPane>
		</div>
	);
}
