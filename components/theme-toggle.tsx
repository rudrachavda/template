'use client';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'motion/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/buttons';
import { useMounted } from '@/hooks/use-mounted';

export function ThemeToggle() {
	const mounted = useMounted();
	const { resolvedTheme, setTheme } = useTheme();

	const isDark = mounted && resolvedTheme === 'dark';

	return (
		<Button variant="secondary" size="icon" aria-label="Toggle theme" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span
					key={isDark ? 'moon' : 'sun'}
					initial={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
					animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
					exit={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
					transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
					className="flex items-center justify-center"
				>
					{isDark ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
				</motion.span>
			</AnimatePresence>
		</Button>
	);
}
