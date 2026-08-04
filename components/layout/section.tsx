'use client';
import React from 'react';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

type SectionProps = {
	children: React.ReactNode;
	variant?: 'restricted' | 'full';
	variants?: Variants;
	className?: string;
};

export function Section({ children, variant = 'restricted', variants, className }: SectionProps) {
	return (
		<motion.div variants={variants} className={cn(variant === 'restricted' ? 'mx-auto w-full max-w-173 px-6 flex' : 'w-full', className)}>
			{children}
		</motion.div>
	);
}
