'use client';
import React from 'react';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

type HeaderProps = {
	id?: string;
	title: string;
	date: string;
	variants?: Variants;
	className?: string;
};

export function Header({ id, title, date, variants, className }: HeaderProps) {
	return (
		<motion.div variants={variants} className={cn('mt-0 flex w-full items-center justify-center gap-2 max-[809px]:flex-col max-[809px]:items-start max-[809px]:gap-2', className)}>
			<div className='flex-1 max-[809px]:order-1 max-[809px]:w-full'>
				<h3 id={id} className='w-full text-sm leading-5.25 font-[590] tracking-normal text-[#1d1d1d] dark:text-[#f0f0f0] dark:antialiased'>
					{title}
				</h3>
			</div>
			<div>
				<p className='w-full text-sm leading-5.25 font-medium tracking-normal text-[#a1a1a1] md:text-pretty dark:antialiased'>{date}</p>
			</div>
		</motion.div>
	);
}