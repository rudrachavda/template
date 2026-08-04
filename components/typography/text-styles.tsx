'use client';
import React from 'react';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

export const styles = {
	title: 'text-sm leading-snug font-semibold tracking-normal text-pretty text-[#1d1d1d] dark:text-[#f0f0f0] dark:antialiased',
	subtitle: 'text-sm leading-snug font-medium tracking-normal text-pretty text-[#646464]',
	paragraph: 'text-sm leading-relaxed font-medium tracking-normal text-[#1d1d1d] md:text-pretty dark:text-[#f0f0f0] dark:antialiased',
	secondary: 'text-sm leading-relaxed font-medium tracking-normal text-[#a1a1a1] md:text-pretty',
	label: 'text-sm leading-relaxed font-medium tracking-wide text-[#646464] uppercase md:text-pretty',
};

const defaultTags = {
	title: 'h1',
	subtitle: 'h3',
	paragraph: 'p',
	secondary: 'p',
	label: 'p',
} as const;

export interface TextProps<T extends React.ElementType> {
	variant?: keyof typeof styles;
	as?: T;
	className?: string;
	children: React.ReactNode;
	variants?: Variants;
	id?: string;
}

// Pre-create stable motion components outside the render loop
const MotionComponents = {
	h1: motion.create('h1'),
	h2: motion.create('h2'),
	h3: motion.create('h3'),
	h4: motion.create('h4'),
	p: motion.create('p'),
	span: motion.create('span'),
	div: motion.create('div'),
	a: motion.create('a'),
	label: motion.create('label'),
};

export function Text<T extends React.ElementType = 'p'>({ variant = 'paragraph', as, className, children, variants, id, ...props }: TextProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TextProps<T>>) {
	const Component = as || defaultTags[variant];

	// If variants are passed, use the stable motion component
	if (variants) {
		const MotionComponent = MotionComponents[Component as keyof typeof MotionComponents] || MotionComponents.div;
		return (
			<MotionComponent id={id} variants={variants} className={cn(styles[variant], className)} {...props}>
				{children}
			</MotionComponent>
		);
	}

	// Otherwise, render a standard HTML tag (Zero overhead, perfect for CSS transitions!)
	return (
		<Component id={id} className={cn(styles[variant], className)} {...props}>
			{children}
		</Component>
	);
}
