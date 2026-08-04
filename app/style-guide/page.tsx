'use client';
import { motion } from 'motion/react';
import { Section } from '@/components/layout/section';
import { Text } from '@/components/typography/text-styles';
import { Header } from '@/components/typography/header';
import { Button, Back, Copy } from '@/components/ui/buttons';
import { Shadow } from '@/components/ui/shadow';
import { ThemeToggle } from '@/components/theme-toggle';
import { container, item } from '@/components/motion/variants';

export default function Home() {
	return (
		<main className="min-h-screen">
			<motion.div initial="hidden" animate="visible" variants={container}>
				<Section className="flex-col space-y-12 pt-8 pb-24 sm:pt-12">
					<motion.div variants={item} className="flex flex-col gap-2">
						<Text variant="title">Template UI Elements</Text>
						<Text variant="subtitle">Design-system atoms ported from bento, phase 1 of the sidebar template — no app shell or backend yet.</Text>
					</motion.div>

					<motion.div variants={item}>
						<Header title="Typography" date="§2" />
						<div className="mt-4 flex flex-col gap-2">
							<Text variant="title">Title</Text>
							<Text variant="subtitle">subtitle</Text>
							<Text variant="paragraph">Paragraph text runs at text-sm, leading-relaxed, on the primary text color pair.</Text>
							<Text variant="secondary">Secondary text is muted — used for dates, counts, and de-emphasized detail.</Text>
							<Text variant="label">Label text</Text>
						</div>
					</motion.div>

					<motion.div variants={item}>
						<Header title="Card & Squircle" date="§4" />
						<div className="mt-4 border-[0.5px] border-solid border-[rgba(225,228,232,0.8)] bg-[#fafafa] p-6 dark:border-[rgba(29,29,29,0.8)] dark:bg-[#1d1d1d]">
							<Text variant="title">Hairline-bordered card</Text>
							<Text variant="secondary" className="mt-1">Primary surface, 0.5px border, the standard content-card shell.</Text>
						</div>
					</motion.div>

					<motion.div variants={item}>
						<Header title="Buttons" date="§6" />
						{/* No background wrapper on purpose — the Squircle surface color for
						    outline/ghost is deliberately subtle against the page background,
						    not a filled box. `solid` is the one variant with real contrast. */}
						<div className="mt-4 flex flex-wrap items-center gap-4">
							<Button variant="solid">Solid</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="solid" pill>Pill</Button>
							<Button href="https://nextjs.org" variant="outline">External link</Button>
							<Back href="/" />
							<Copy />
							<ThemeToggle />
						</div>
					</motion.div>

					<motion.div variants={item}>
						<Header title="Shadow" date="§5" />
						<div className="mt-6 flex justify-start">
							<Shadow className="h-24 w-40 rounded-2xl bg-[#fafafa] dark:bg-[#1d1d1d]" elevation={0.6} intensity={0.8} />
						</div>
					</motion.div>
				</Section>
			</motion.div>
		</main>
	);
}
