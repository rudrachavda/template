// @ts-nocheck
// Transitions.dev — Number pop-in (React, self-contained)
// Drop into any React project — no extra CSS file needed.
//
// One addition on top of the original transitions.dev source, noted here
// rather than silently: the original only replayed the *same* value on
// every click, which barely shows off a "pop in" transition — you can't
// tell a value changed if it never does. Added an optional `onBeforeReplay`
// callback, fired synchronously at the start of `replay()`, right before
// the class gets stripped for the reflow. A caller can use it to change
// `value` from the parent (e.g. cycle to a new number) — React batches
// that state update with this component's own `setPlaying(false)`, so the
// new digits are already in place by the time the entrance animation
// re-triggers. Omitting it preserves the original replay-same-value
// behavior exactly. Everything else is untouched.
//
// Note for callers: the CSS below only defines per-digit stagger delays for
// `data-stagger="1"` and `"2"` (i.e. a 3-character value like "123") —
// digits past the third pop in together, with no added delay. That's a
// limit of the original snippet's CSS, not something patched here; pick
// values around 3 characters if you want the full staggered effect.

import { useState } from 'react';

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --digit-dur: 500ms;
  --digit-distance: 8px;
  --digit-stagger: 70ms;
  --digit-blur: 2px;
  --digit-ease: cubic-bezier(0.34, 1.45, 0.64, 1);
  --digit-dir-x: 0;
  --digit-dir-y: 1;
}

@keyframes t-digit-pop-in {
  0%   {
    transform: translate(
      calc(var(--digit-distance) * var(--digit-dir-x)),
      calc(var(--digit-distance) * var(--digit-dir-y))
    );
    opacity: 0;
    filter: blur(var(--digit-blur));
  }
  100% { transform: translate(0, 0); opacity: 1; filter: blur(0); }
}

.t-digit-group {
  display: inline-flex;
  align-items: baseline;
}
.t-digit {
  display: inline-block;
  will-change: transform, opacity, filter;
}
.t-digit-group.is-animating .t-digit {
  animation: t-digit-pop-in var(--digit-dur) var(--digit-ease) both;
}
.t-digit-group.is-animating .t-digit[data-stagger="1"] {
  animation-delay: var(--digit-stagger);
}
.t-digit-group.is-animating .t-digit[data-stagger="2"] {
  animation-delay: calc(var(--digit-stagger) * 2);
}

@media (prefers-reduced-motion: reduce) {
  .t-digit-group .t-digit { animation: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p9')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p9';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// Toggle `.is-animating` to replay the pop-in sequence.
export function NumberPopIn({ value = '123', onBeforeReplay }) {
	const [playing, setPlaying] = useState(true);

	// Replay: strip the class, force a reflow via rAF, then re-add.
	const replay = () => {
		onBeforeReplay?.();
		setPlaying(false);
		requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
	};

	return (
		<>
			<button type='button' onClick={replay}>
				Animate
			</button>
			<span className={'t-digit-group' + (playing ? ' is-animating' : '')}>
				{value.split('').map((ch, i) => (
					<span key={i} className='t-digit' data-stagger={i > 0 ? i : undefined}>
						{ch}
					</span>
				))}
			</span>
		</>
	);
}
