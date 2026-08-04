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

					<motion.div variants={item} className='flex flex-col gap-4'>
						<Header title="Typography" date="2" />
						<div className="flex flex-col gap-2">
							<Text variant="title">Title</Text>
							<Text variant="subtitle">subtitle</Text>
							<Text variant="paragraph">Paragraph text runs at text-sm, leading-relaxed, on the primary text color pair.</Text>
							<Text variant="secondary">Secondary text is muted — used for dates, counts, and de-emphasized detail.</Text>
							<Text variant="label">Label text</Text>
						</div>

						<Header className='mt-4' titleClassName='text-md' dateClassName='' title="Bigger Typography" date="3" />
						<div className="flex flex-col gap-2">
							<Text variant="title" className='text-md'>Title</Text>
							<Text variant="subtitle" className='text-md'>subtitle</Text>
							<Text variant="paragraph" className='text-md'>Paragraph text runs at text-sm, leading-relaxed, on the primary text color pair.</Text>
							<Text variant="secondary" className='text-md'>Secondary text is muted — used for dates, counts, and de-emphasized detail.</Text>
							<Text variant="label" className='text-md'>Label text</Text>
						</div>
					</motion.div>

					<motion.div variants={item}>
						<Header title="Card & Squircle" date="4" />
						<div className="mt-4 border-[0.5px] border-solid border-[rgba(225,228,232,0.8)] bg-[#fafafa] p-6 dark:border-[rgba(29,29,29,0.8)] dark:bg-[#1d1d1d]">
							<Text variant="title">Hairline-bordered card</Text>
							<Text variant="secondary" className="mt-1">Primary surface, 0.5px border, the standard content-card shell.</Text>
						</div>
					</motion.div>

					<motion.div variants={item}>
						<Header title="Buttons" date="6" />
						{/* No background wrapper on purpose — the Squircle surface color for
						    outline/ghost is deliberately subtle against the page background,
						    not a filled box. `solid`/`secondary` are real filled surfaces;
						    `secondary` (secondary-surface tint + border) is the default for
						    functional buttons elsewhere in this project — see navbar/hero. */}
						<div className="mt-4 flex flex-wrap items-center gap-4">
							<Button variant="solid">Solid</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="solid" pill>Pill</Button>
							<Button href="https://nextjs.org" variant="outline">External link</Button>
							<Back href="/" />
							<Copy />
							<ThemeToggle />
						</div>
						<Text variant="secondary" className="mt-4">
							`main`/`primary`/`secondary` are the three configurable color tiers — each backed by a `--color-button-*` custom property in globals.css rather than a hardcoded hex, so re-branding every button in the app is a one-file edit. `main` is the brand/CTA accent, for the one or two buttons per page that should stand out.
						</Text>
						<div className="mt-4 flex flex-wrap items-center gap-4">
							<Button variant="main">Main</Button>
							<Button variant="primary">Primary</Button>
							<Button variant="secondary">Secondary</Button>
						</div>
						<Text variant="secondary" className="mt-4">
							`unstyled` renders no Squircle at all — just the bare label/icon, for an affordance that shouldn&apos;t look like a button until you hover. Add `border` back explicitly for a stroke-only outline.
						</Text>
						<div className="mt-4 flex flex-wrap items-center gap-4">
							<Button variant="unstyled">Unstyled</Button>
							<Button variant="unstyled" border>Unstyled + border</Button>
							<Copy variant="unstyled" label="Copy link, unstyled" />
						</div>
					</motion.div>

					<motion.div variants={item}>
						<Header title="Custom button shapes" date="6a" />
						<Text variant="secondary" className="mt-1">
							`radius`/`exponent`/`smoothing` pass straight through to the Squircle — not limited to a pill or the default soft-rounded rect.
						</Text>
						<div className="mt-4 flex flex-wrap items-center gap-4">
							<Button variant="solid" radius={4} exponent={8}>Barely rounded</Button>
							<Button variant="outline" radius={24} exponent={4}>Big soft corner</Button>
							<Button variant="solid" size="lg" className="px-12 py-4 text-lg" radius={16}>Custom padding + size</Button>
							<Button variant="ghost" size="sm" className="px-2">Tiny</Button>
						</div>
						<Text variant="secondary" className="mt-4">
							`border`/`borderColor`/`strokeWidth` work on any variant, not just `outline`.
						</Text>
						<div className="mt-4 flex flex-wrap items-center gap-4">
							<Button variant="solid" border borderColor="#fc3e2f" strokeWidth={1}>Solid + red border</Button>
							<Button variant="ghost" border>Ghost + border</Button>
							<Button variant="outline" border={false}>Outline, no border</Button>
						</div>
						<Text variant="secondary" className="mt-4">
							`background`/`textColor` replace the currentColor-driven surface entirely with a literal color.
						</Text>
						<div className="mt-4 flex flex-wrap items-center gap-4">
							<Button background="#0069cc" textColor="#fefefe">Accent blue</Button>
							<Button background="linear-gradient(135deg, #9659b9, #ee98b7)" textColor="#fefefe" border borderColor='transparent'>Gradient</Button>
							<Button variant="outline" background="#fcd609" textColor="#1d1d1d" border borderColor="#b64400">Custom bg + border</Button>
						</div>
						<Text variant="secondary" className="mt-4">
							`darkBackground`/`darkTextColor` swap in for dark mode — a literal color has no `dark:` variant of its own, this is how to give it one. Toggle the theme to see it change.
						</Text>
						<div className="mt-4 flex flex-wrap items-center gap-4">
							<Button background="#0069cc" darkBackground="#50aef6" textColor="#fefefe" darkTextColor="#121212">
								Blue in light, lighter blue in dark
							</Button>
						</div>
					</motion.div>

					<motion.div variants={item}>
						<Header title="Shadow" date="5" />
						<div className="mt-6 flex justify-start">
							<Shadow className="h-24 w-40 rounded-2xl bg-[#fafafa] dark:bg-[#1d1d1d]" elevation={0.6} intensity={0.8} />
						</div>
					</motion.div>
				</Section>
			</motion.div>
		</main>
	);
}
