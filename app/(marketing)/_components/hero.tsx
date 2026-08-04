"use client";

import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text-styles";
import { Button, Copy } from "@/components/ui/buttons";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { container, item } from "@/components/motion/variants";
import { VerticalLine, HorizontalLine, GridCircle } from "@/components/layout/grid-lines";
import { MARKETING_MAX_WIDTH } from "./constants";

// Decorative grid frame from nextjs.org's hero (nextjs.org/coolheaderelement(ignore).{html,css}),
// reimplemented with our own tokens rather than the scraped markup verbatim —
// that depends on Vercel's internal --ds-* design tokens and wouldn't render
// standalone here. Numbers that *are* in the scrape (container width/padding,
// title font-size/weight/tracking, the line dash ratio, the circle path +
// gradient) are copied as-is; things the scrape didn't capture (subtitle/
// button/copy-row layout) are ours, built from our own Button/Text/Copy.
// `VerticalLine`/`HorizontalLine`/`GridCircle` live in
// `components/layout/grid-lines.tsx` now — shared with the component
// showcase pages under `(main)/components/`, which reuse this exact look.
//
// Root width matches MARKETING_MAX_WIDTH, shared with Navbar/Footer so the
// whole page lines up at the same edges.

export function Hero() {
    return (
        <Section variant="full" className="overflow-hidden px-4 sm:px-8">
            <div className={cn("relative mx-auto my-20 w-full", MARKETING_MAX_WIDTH)}>
                <main className="flex flex-col items-center justify-start flex-initial w-full">
                    {/* Header Block */}
                    <div className="relative w-full h-16 sm:h-24">
                        <VerticalLine side="left" />
                        <VerticalLine side="right" />
                    </div>

                    {/* Intro Grid Container */}
                    <motion.div initial="hidden" animate="visible" variants={container} className="relative flex flex-col items-center w-full">
                        <HorizontalLine />
                        <GridCircle className="-top-8 -left-8" />
                        <VerticalLine side="left" />

                        {/* Title Section */}
                        <div className="relative w-full flex flex-col items-center justify-center p-6">
                            <Text
                                variant="title"
                                as="h1"
                                className="text-[clamp(3rem,5vw,4.75rem)] font-semibold tracking-tight leading-none text-center text-balance"
                            >
								Design Framework for the web. 
                            </Text>
                            <GridCircle className="-bottom-8 -right-8" rotate={180} />
                        </div>
                        <HorizontalLine />

                        {/* Subtitle Section */}
                        <div className="relative w-full flex flex-col items-center justify-center py-8 sm:py-12 px-6">
                            <Text variant="secondary" as="p" className="text-base leading-relaxed sm:text-lg max-w-2xl text-center">
                                A design system, a component library, and a folder layout — ready to go before you write a single feature.
                            </Text>
                        </div>
                        <HorizontalLine />

                        {/* Footer / Buttons Section */}
                        <div className="relative w-full flex flex-col items-center justify-start">
                            <div className="relative flex flex-col items-center justify-start gap-6 px-8 py-8 sm:px-14 sm:py-10">
                                <VerticalLine side="left" />
                                <VerticalLine side="right" />
                                <GridCircle className="-bottom-8 -right-8" rotate={180} />

                                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-4 flex-initial w-full">
                                    <Button href="/app" variant="secondary">Get started</Button>
                                    <Button href="/components/typography" variant="secondary">View components</Button>
                                </div>
                                
                                <div className="relative z-10 flex items-center justify-center gap-1 font-mono text-xs text-[#a1a1a1]">
                                    <span>▲ ~ npm run dev</span>
                                    <Copy text="npm run dev" label="Copy dev command" variant="unstyled" className="min-h-0 min-w-0 p-1" />
                                </div>
                            </div>
                        </div>
                        <HorizontalLine />

                        <VerticalLine side="right" />
                    </motion.div>
                </main>
            </div>
        </Section>
    );
}