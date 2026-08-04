// @ts-nocheck
// Transitions.dev — Input clear with dissolve (React, self-contained)
// Drop into any React project — no extra CSS file needed.
//
// One deviation from the original transitions.dev source, kept minimal and
// noted here rather than silently: the glow-color check below originally
// read `document.documentElement.getAttribute('data-theme')`, assuming a
// data-attribute theme toggle. This template's ThemeProvider uses
// `attribute="class"` (see app/layout.tsx), so that check always read
// `null` here and the glow silently rendered as if light mode, regardless
// of the actual theme. Changed to check for the `dark` class instead so the
// glow color actually follows this app's real theme mechanism. Everything
// else in this file is untouched from the original.

import { useEffect, useRef } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --clear-dur: 1000ms;
  --clear-out-dur: 400ms;
  --clear-in-dur: 400ms;
  --clear-out-fly: 12px;
  --clear-in-fly: 12px;
  --clear-out-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --clear-in-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --clear-blur: 2px;
  --glow-delay: 50ms;
  --glow-peak-at: 0.15;
  --glow-opacity: 0.42;
  --glow-spread: 1.5;
}

/* The wrap clips the glow to its rounded box. The hairline
   border is 'inset' so it sits inside that clip — when the
   glow's mix-blend-mode darkens its area, the border
   underneath darkens with it. Bring your own width / height /
   border-radius / surface color. */
.t-clear {
  position: relative;
  overflow: hidden;
}
.t-clear-mirror,
.t-clear-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  z-index: 2;
}
.t-clear-mirror { opacity: 0; }
.t-clear.has-value .t-clear-mirror,
.t-clear.is-clearing .t-clear-mirror { opacity: 1; }
/* Hide the input's own glyphs while the mirror owns them so
   the cleared text doesn't double-render with the fly-up. */
.t-clear.has-value > input,
.t-clear.is-clearing > input {
  -webkit-text-fill-color: transparent;
}
.t-clear.has-value .t-clear-placeholder { opacity: 0; }
/* The streak overlay: empty by default; JS writes a stack of
   'radial - gradient(...)' layers into background during a clear,
   then animates opacity. mix-blend-mode: multiply darkens the
   underlying input + hairline; flip to 'screen' in dark mode
   so the same alpha values lighten instead of vanish. */
.t-clear-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  z-index: 3;
  mix-blend-mode: multiply;
}

/* The transitions live in JS (per-frame transform/opacity/
   filter writes), so this stylesheet only owns the resting
   state + the variables that JS reads. Read them with
   'parseFloat(getComputedStyle(root).getPropertyValue(...))'
   so live tweaks apply on the next clear without a reload. */

@media (prefers-reduced-motion: reduce) {
  .t-clear-glow { opacity: 0 !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p13')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p13';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// Per-frame JS is unavoidable here: the per-word streak's
// rise → peak → fall envelope can't be expressed as a static
// @keyframe, so we tween transform/opacity/filter ourselves.
//
// Use it as:
//   <ClearInput defaultValue="How do transitions work?"
//               placeholder="Search anything" />
//
// Bring your own search icon, container size, and theming.
export function ClearInput({ defaultValue = '', placeholder = '' }: { defaultValue?: string; placeholder?: string }) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const mirrorRef = useRef<HTMLDivElement>(null);
	const fakePhRef = useRef<HTMLDivElement>(null);
	const glowRef = useRef<HTMLDivElement>(null);
	const isClearing = useRef(false);

	useEffect(() => {
		const wrap = wrapRef.current;
		const input = inputRef.current;
		if (!wrap || !input) return;
		const sync = () => {
			const has = input.value.length > 0;
			wrap.classList.toggle('has-value', has);
			if (has && mirrorRef.current) {
				mirrorRef.current.textContent = input.value.replace(/ /g, '\u00a0');
			}
		};
		input.addEventListener('input', sync);
		sync();
		return () => input.removeEventListener('input', sync);
	}, []);

	const onClear = () => {
		const wrap = wrapRef.current;
		const input = inputRef.current;
		const mirror = mirrorRef.current;
		const fakePh = fakePhRef.current;
		const glow = glowRef.current;
		if (!wrap || !input || !mirror || !fakePh || !glow) return;
		if (isClearing.current || !input.value) return;
		isClearing.current = true;
		const wasFocused = document.activeElement === input;
		mirror.textContent = input.value.replace(/ /g, '\u00a0');
		const bg = buildLayers(wrap, mirror.textContent);
		const peakAt = readNum('--glow-peak-at', 0.15);
		const opacity = readNum('--glow-opacity', 0.42);
		const total = readNum('--clear-dur', 1000);
		const outDur = readNum('--clear-out-dur', 400);
		const inDur = readNum('--clear-in-dur', 400);
		const outFly = readNum('--clear-out-fly', 12);
		const inFly = readNum('--clear-in-fly', 12);
		const blurPx = readNum('--clear-blur', 2);
		const glowDly = readNum('--glow-delay', 50);
		const eOut = makeEase(readEase('--clear-out-ease', 'cubic-bezier(0.22, 1, 0.36, 1)'));
		const eIn = makeEase(readEase('--clear-in-ease', 'cubic-bezier(0.22, 1, 0.36, 1)'));

		input.value = '';
		wrap.classList.remove('has-value');
		wrap.classList.add('is-clearing');
		fakePh.style.transform = `translateY(-${inFly}px)`;
		fakePh.style.opacity = '0.9';
		fakePh.style.filter = `blur(${blurPx}px)`;
		glow.style.background = bg;
		glow.style.opacity = '0';

		const start = performance.now();
		const tick = (now: number) => {
			const elapsed = now - start;
			const p = Math.min(1, elapsed / total);
			const e = eOut(Math.min(1, elapsed / outDur));
			mirror.style.transform = `translateY(${(e * outFly).toFixed(1)}px)`;
			mirror.style.opacity = (1 - e).toFixed(3);
			mirror.style.filter = `blur(${(e * blurPx).toFixed(1)}px)`;
			const pe = eIn(Math.min(1, elapsed / inDur));
			fakePh.style.transform = `translateY(${(-inFly + pe * inFly).toFixed(1)}px)`;
			fakePh.style.opacity = (0.9 + pe * 0.1).toFixed(3);
			fakePh.style.filter = `blur(${(blurPx - pe * blurPx).toFixed(1)}px)`;
			let g = 0;
			if (elapsed > glowDly) {
				const remaining = Math.max(1, total - glowDly);
				const gp = Math.min(1, (elapsed - glowDly) / remaining);
				g = gp < peakAt ? gp / peakAt : 1 - (gp - peakAt) / (1 - peakAt);
			}
			glow.style.opacity = (g * opacity).toFixed(3);
			if (p < 1) requestAnimationFrame(tick);
			else {
				wrap.classList.remove('is-clearing');
				for (const el of [mirror, fakePh]) el.style.cssText = '';
				mirror.textContent = '';
				glow.style.opacity = '0';
				glow.style.background = '';
				isClearing.current = false;
				if (wasFocused) input.focus({ preventScroll: true });
			}
		};
		requestAnimationFrame(tick);
	};

	return (
		<div ref={wrapRef} className='t-clear'>
			<input ref={inputRef} type='text' defaultValue={defaultValue} placeholder={placeholder} />
			<div ref={mirrorRef} className='t-clear-mirror' aria-hidden='true' />
			<div ref={fakePhRef} className='t-clear-placeholder' aria-hidden='true'>
				{placeholder}
			</div>
			<div ref={glowRef} className='t-clear-glow' aria-hidden='true' />
			<button
				type='button'
				className='t-clear-btn'
				aria-label='Clear'
				// Trap focus on the input across pointer + mouse so the button
				// never steals it during the clear animation.
				onPointerDown={(e) => {
					if (document.activeElement === inputRef.current) e.preventDefault();
				}}
				onMouseDown={(e) => {
					if (document.activeElement === inputRef.current) e.preventDefault();
				}}
				onClick={onClear}>
				×
			</button>
		</div>
	);
}

let _sharedCtx: CanvasRenderingContext2D | null = null;

function buildLayers(wrap: HTMLElement, text: string) {
	const inputW = wrap.clientWidth || 280;
	const padLeft = 32;
	const segments = text.split(/(\s+)/);
	const spread = readNum('--glow-spread', 1.5);
	if (!_sharedCtx) {
		_sharedCtx = document.createElement('canvas').getContext('2d');
		if (_sharedCtx) _sharedCtx.font = '400 13px Inter, sans-serif';
	}
	const ctx = _sharedCtx!;
	// Light mode paints black gradients (multiply blend); dark mode
	// paints white (screen blend). Pair this with the matching
	// `mix-blend-mode` rule on .t-clear-glow in your theme CSS.
	const isDark = document.documentElement.classList.contains('dark');
	const rgb = isDark ? '255,255,255' : '0,0,0';
	const layers = [];
	let x = 0;
	for (const seg of segments) {
		const w = ctx.measureText(seg).width;
		if (seg.trim()) {
			const cx = padLeft + x + w / 2;
			const hw = Math.max(w * 0.45, 8) * spread;
			const stops = [
				{ dx: 0, rw: hw * 0.8, rh: 7, a: 0.22 },
				{ dx: hw * 0.45, rw: hw * 0.55, rh: 8, a: 0.18 },
				{ dx: -hw * 0.4, rw: hw * 0.65, rh: 6, a: 0.16 },
				{ dx: hw * 0.15, rw: hw * 0.9, rh: 5, a: 0.14 },
			];
			for (const l of stops) {
				const lx = (((cx + l.dx) / inputW) * 100).toFixed(2);
				layers.push(`radial-gradient(ellipse ${Math.max(l.rw, 2).toFixed(1)}px ${l.rh}px at ${lx}% 100%, rgba(${rgb},${l.a.toFixed(3)}), transparent)`);
			}
		}
		x += w;
	}
	return layers.join(', ');
}
function readNum(name: string, fb: number) {
	const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
	return Number.isFinite(v) ? v : fb;
}
function readEase(name: string, fb: string) {
	const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return v || fb;
}
function makeEase(ease: string) {
	const m = ease.match(/cubic-bezier\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/i);
	if (!m) return (t) => t;
	const [x1, y1, x2, y2] = [m[1], m[2], m[3], m[4]].map(parseFloat);
	const cx = 3 * x1,
		bx = 3 * (x2 - x1) - cx,
		ax = 1 - cx - bx;
	const cy = 3 * y1,
		by = 3 * (y2 - y1) - cy,
		ay = 1 - cy - by;
	const sX = (s) => ((ax * s + bx) * s + cx) * s;
	const sY = (s) => ((ay * s + by) * s + cy) * s;
	const dX = (s) => (3 * ax * s + 2 * bx) * s + cx;
	return (t) => {
		if (t <= 0) return 0;
		if (t >= 1) return 1;
		let s = t;
		for (let i = 0; i < 8; i++) {
			const dx = sX(s) - t;
			if (Math.abs(dx) < 1e-6) break;
			const d = dX(s);
			if (d === 0) break;
			s -= dx / d;
		}
		return sY(s);
	};
}
