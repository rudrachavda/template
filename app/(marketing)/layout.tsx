import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { Shadow } from "@/components/ui/shadow";

// "Reveal footer": Footer sits fixed to the viewport bottom the whole time;
// the Shadow-wrapped main content is a normal-flow, min-h-screen block
// stacked in front of it (z-10 vs z-0), so it fully covers the footer at
// first scroll. The spacer div below matches Footer's height (h-14) exactly
// — it's what gives the page enough scroll room to slide the front layer up
// and reveal the footer underneath. Keep both in sync if Footer's height changes.
const MarketingLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<div className="relative">
			<Footer />
			<Shadow
				elevation={0.3}
				intensity={0.3}
				className="relative z-10 flex min-h-screen flex-col bg-[#fefefe] dark:bg-[#121212]"
			>
				<Navbar />
				<main className="flex flex-1 flex-col">{children}</main>
			</Shadow>
			<div className="h-14" aria-hidden />
		</div>
	);
};

export default MarketingLayout;
