// @ts-nocheck
// Transitions.dev — Texts reveal (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { useRef, useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --stagger-dur: 500ms;
  --stagger-distance: 12px;
  --stagger-stagger: 40ms;
  --stagger-blur: 3px;
  --stagger-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

/* Lines start translated down + blurred + invisible; .is-shown
   on the parent flips them to their resting state. The second
   line's transition-delay holds it back by --stagger-stagger
   so the eye lands on the headline first. */
.t-stagger-line {
  display: block;
  opacity: 0;
  transform: translateY(var(--stagger-distance));
  filter: blur(var(--stagger-blur));
  transition:
    opacity   var(--stagger-dur) var(--stagger-ease),
    transform var(--stagger-dur) var(--stagger-ease),
    filter    var(--stagger-dur) var(--stagger-ease);
  will-change: transform, opacity, filter;
}
.t-stagger-line--2 { transition-delay: var(--stagger-stagger); }

.t-stagger.is-shown .t-stagger-line {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
/* Exit decouples from the stagger: same fade for every line,
   no Y return, no blur — so the disappearance reads as a
   single quiet fade instead of a reverse reveal. */
.t-stagger.is-hiding .t-stagger-line {
  opacity: 0;
  transform: translateY(0);
  filter: blur(0);
  transition:
    opacity 200ms ease,
    transform 0s linear,
    filter 0s linear;
  transition-delay: 0s;
}

@media (prefers-reduced-motion: reduce) {
  .t-stagger-line { transition: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p18')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p18';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// Two states: idle → shown (staggered entrance) and shown → hiding
// (quick fade-out, no Y return). The hiding class is held only long
// enough for the 200ms fade to play, then dropped so the next show
// can replay the staggered entrance from a clean state.
export function StaggerReveal({ primary, secondary }) {
	const [shown, setShown] = useState(false);
	const [hiding, setHiding] = useState(false);
	const timerRef = useRef(null);

	const onAnimate = () => {
		if (shown) {
			// shown → hiding (fade out in place)
			setShown(false);
			setHiding(true);
			if (timerRef.current) window.clearTimeout(timerRef.current);
			timerRef.current = window.setTimeout(() => setHiding(false), 200);
		} else {
			// idle → shown (replay the staggered entrance)
			if (timerRef.current) window.clearTimeout(timerRef.current);
			setHiding(false);
			// setState is async — flip to shown on the next tick so React
			// doesn't batch idle→shown into a single render and skip the
			// entrance transition.
			window.requestAnimationFrame(() => setShown(true));
		}
	};

	const cls = 't-stagger' + (shown ? ' is-shown' : '') + (hiding ? ' is-hiding' : '');

	return (
		<>
			<button type='button' onClick={onAnimate}>
				Animate
			</button>
			<div className={cls}>
				<strong className='t-stagger-line t-stagger-line--1'>{primary}</strong>
				<span className='t-stagger-line t-stagger-line--2'>{secondary}</span>
			</div>
		</>
	);
}
