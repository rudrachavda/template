"use client";

import { motion } from "motion/react";
import { Section } from "@/components/layout/section";
import { Text } from "@/components/typography/text-styles";
import { Button, Copy } from "@/components/ui/buttons";
import { cn } from "@/lib/utils";
import { container, item } from "@/components/motion/variants";
import { MARKETING_MAX_WIDTH } from "./constants";

// Decorative grid frame from nextjs.org's hero (nextjs.org/coolheaderelement(ignore).{html,css}),
// reimplemented with our own tokens rather than the scraped markup verbatim —
// that depends on Vercel's internal --ds-* design tokens and wouldn't render
// standalone here. Numbers that *are* in the scrape (container width/padding,
// title font-size/weight/tracking, the line dash ratio, the circle path +
// gradient) are copied as-is; things the scrape didn't capture (subtitle/
// button/copy-row layout) are ours, built from our own Button/Text/Copy.
//
// Root width matches MARKETING_MAX_WIDTH, shared with Navbar/Footer so the
// whole page lines up at the same edges.

// Dash pattern: --line-width:1px, --line-gap:5px, 50% on / 50% off per repeat.
const LINE_COLOR = "text-[rgba(29,29,29,0.2)] dark:text-[rgba(240,240,240,0.2)]";

function VerticalLine({ side, className }: { side: "left" | "right", className?: string }) {
    return (
        <motion.div
            aria-hidden
            // Start at 0 height, and grow to cover the container plus the 200px overhang (100px top + 100px bottom)
            initial={{ height: 0 }}
            whileInView={{ height: "calc(100% + 200px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
                "absolute top-[-100px] w-px origin-top",
                "[background-image:repeating-linear-gradient(to_bottom,currentColor_0,currentColor_2.5px,transparent_2.5px,transparent_5px)]",
                "[mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]",
                LINE_COLOR,
                side === "left" ? "left-0" : "right-0",
                className
            )}
        />
    );
}

function HorizontalLine({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-full h-px", className)}>
            <motion.div
                aria-hidden
                // Start at 0 width, and grow to cover the container plus the 200px overhang (100px left + 100px right)
                initial={{ width: 0 }}
                whileInView={{ width: "calc(100% + 200px)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={cn(
                    "absolute left-[-100px] top-0 h-px origin-left",
                    "[background-image:repeating-linear-gradient(to_right,currentColor_0,currentColor_2.5px,transparent_2.5px,transparent_5px)]",
                    "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
                    LINE_COLOR,
                )}
            />
        </div>
    );
}

function GridCircle({ className, rotate = 0 }: { className?: string; rotate?: 0 | 180 }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 75 75"
            className={cn("absolute size-16", LINE_COLOR, className)}
            style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
        >
            <path
                d="M74 37.5C74 30.281 71.8593 23.2241 67.8486 17.2217C63.838 11.2193 58.1375 6.541 51.4679 3.7784C44.7984 1.0158 37.4595 0.292977 30.3792 1.70134C23.2989 3.1097 16.7952 6.58599 11.6906 11.6906C6.58599 16.7952 3.1097 23.2989 1.70134 30.3792C0.292977 37.4595 1.0158 44.7984 3.7784 51.4679C6.541 58.1375 11.2193 63.838 17.2217 67.8486C23.2241 71.8593 30.281 74 37.5 74"
                fill="none"
                stroke="currentColor"
                strokeDasharray="2 2"
            />
        </svg>
    );
}

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
                                    <Button href="/style-guide" variant="secondary">Get started</Button>
                                    <Button href="/style-guide" variant="secondary">View components</Button>
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