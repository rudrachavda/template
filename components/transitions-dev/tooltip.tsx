// @ts-nocheck
// Transitions.dev — Tooltip open/close (React, self-contained)
// Drop into any React project — no extra CSS file needed.

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --tt-in-dur: 150ms;
  --tt-out-dur: 50ms;
  --tt-scale: 0.98;
  --tt-delay: 80ms;
  --tt-in-ease: ease-out;
  --tt-out-ease: ease-out;
  --tt-bg: #ffffff;
  --tt-fg: #2f2f2f;
}

.t-tt-wrap {
  position: relative;
  display: inline-block;
}
.t-tt {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translate(-50%, 0) scale(var(--tt-scale));
  transform-origin: 50% 100%;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--tt-bg);
  color: var(--tt-fg);
  white-space: nowrap;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 2px 6px 0 rgba(0, 0, 0, 0.05),
    0 4px 42px 0 rgba(0, 0, 0, 0.06);
  opacity: 0;
  pointer-events: none;
  /* Default rule controls the LEAVE state. transition-delay
     stays unset so leaving plays without delay. */
  transition:
    opacity   var(--tt-out-dur) var(--tt-out-ease),
    transform var(--tt-out-dur) var(--tt-out-ease);
}
/* The 50ms delay belongs ONLY to the hover rule so leaving
   the trigger snaps the delay back to 0 and the disappear
   plays immediately. */
.t-tt-wrap:hover .t-tt,
.t-tt-trigger:focus-visible + .t-tt {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
  transition-duration: var(--tt-in-dur);
  transition-timing-function: var(--tt-in-ease);
  transition-delay: var(--tt-delay);
}

@media (prefers-reduced-motion: reduce) {
  .t-tt { transition: none !important; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('transitions-p17')) {
	const __style = document.createElement('style');
	__style.id = 'transitions-p17';
	__style.textContent = __TRANSITION_STYLES;
	document.head.appendChild(__style);
}

// Pair with the CSS from the CSS tab.
// Pure CSS — hover / focus state lives entirely in selectors.
// Bring your own trigger styling.
export function Tooltip({ id, content, children }) {
	return (
		<span className='t-tt-wrap'>
			{/* The trigger needs `aria-describedby` pointed at the
          tooltip's id; CSS uses :focus-visible + sibling selector
          so the tooltip also shows on keyboard focus. */}
			{children({ 'aria-describedby': id, className: 't-tt-trigger' })}
			<span id={id} className='t-tt' role='tooltip'>
				{content}
			</span>
		</span>
	);
}
