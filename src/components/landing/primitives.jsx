"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/* ---------------------------------------------------------------- observers */

/**
 * One shared enter-once observer. Returns a ref and the in-view flag.
 * IntersectionObserver rather than a scroll listener: no per-frame work, and
 * the animation itself is a CSS transition so it runs off the main thread.
 */
export function useInViewOnce({ amount = 0.2, rootMargin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: amount, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount, rootMargin, inView]);

  return [ref, inView];
}

/** Fade-and-rise on enter. `delay` staggers siblings. */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div", amount }) {
  const [ref, inView] = useInViewOnce(amount ? { amount } : undefined);
  return (
    <Tag
      ref={ref}
      data-in={inView}
      className={`lp-reveal ${className}`}
      style={{ "--d": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------------- count up */

/**
 * Counts to `to` once in view. Numbers are the payload of the stat strip, so
 * the motion is doing work: it points at the figure.
 */
export function CountUp({ to, duration = 1100, pad = 0, suffix = "" }) {
  const [ref, inView] = useInViewOnce({ amount: 0.6 });
  const [counted, setCounted] = useState(0);
  const reduce = usePrefersReducedMotion();

  // Reduced motion skips the count entirely and shows the final figure.
  const value = reduce ? to : counted;

  useEffect(() => {
    if (!inView || reduce) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic, so it decelerates into the final figure
      setCounted(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className="lp-num">
      {String(value).padStart(pad, "0")}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------ media queries */

/**
 * Media queries read through useSyncExternalStore, so there is no setState in
 * an effect and the server snapshot is always the conservative answer.
 */
function useMediaQuery(query) {
  const subscribe = useCallback(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Tilt and spotlight are mouse affordances; touch should not pay for them. */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/* --------------------------------------------------------------- spotlight */

/**
 * Writes pointer position to CSS custom properties so the spotlight border and
 * card sheen can follow the cursor without a single React re-render.
 */
export function useSpotlight() {
  const ref = useRef(null);
  const onPointerMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);
  return { ref, onPointerMove };
}
