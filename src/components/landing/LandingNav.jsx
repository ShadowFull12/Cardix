"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const LINKS = [
  { id: "how", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "sharing", label: "Sharing" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

/**
 * Tracks which section owns the viewport so the nav can highlight it.
 * IntersectionObserver with a band across the upper-middle of the screen, which
 * is where a reader's attention actually sits. No scroll listener.
 */
function useActiveSection(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;

    const visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        });
        if (!visible.size) {
          setActive(null);
          return;
        }
        // The section showing the most of itself wins.
        const [top] = [...visible.entries()].sort((a, b) => b[1] - a[1]);
        setActive(top[0]);
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/** Reading progress. Orientation cue on a long page, so it earns its place. */
function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.25,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.015, 1], [0, 1, 1]);
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--accent)]"
      style={{ scaleX, opacity }}
    />
  );
}

export function LandingNav() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const active = useActiveSection(LINKS.map((l) => l.id));

  // A sentinel at the top of the document beats a scroll listener.
  useEffect(() => {
    const sentinel = document.getElementById("lp-top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([e]) => setCondensed(!e.isIntersecting),
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll("a[href]");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        transition:
          "background-color 240ms cubic-bezier(0.23,1,0.32,1), border-color 240ms cubic-bezier(0.23,1,0.32,1)",
        backgroundColor: condensed ? "rgba(8,9,12,0.74)" : "transparent",
        backdropFilter: condensed ? "blur(16px) saturate(150%)" : "none",
        WebkitBackdropFilter: condensed ? "blur(16px) saturate(150%)" : "none",
        borderBottom: `1px solid ${condensed ? "var(--line)" : "transparent"}`,
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8"
        style={{
          height: condensed ? 64 : 72,
          transition: "height 240ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="Cardix home">
          <Image
            src="/logo.png"
            alt=""
            width={34}
            height={34}
            priority
            className="h-[34px] w-[34px] object-contain"
          />
          <span className="lp-display text-[19px] tracking-[-0.03em]">Cardix</span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="lp-navlink"
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="lp-nav-active"
                      className="absolute inset-0 rounded-full bg-[var(--surface-hi)] ring-1 ring-[var(--line)]"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 36 }
                      }
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden h-11 items-center rounded-full px-4 text-[14px] font-medium text-[var(--paper-dim)] transition-colors duration-150 hover:text-[var(--paper)] sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="lp-btn lp-btn-primary min-h-[44px]! px-5! text-[14px]"
          >
            Create your card
          </Link>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="lp-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--paper)] transition-transform duration-150 active:scale-[0.94] lg:hidden"
          >
            {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      <ProgressRail />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 -z-10 bg-[rgba(4,5,8,0.62)] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.13 } }}
              transition={{ duration: 0.22 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="lp-mobile-menu"
              ref={panelRef}
              /* Scales out of the trigger in the top right, not from nowhere. */
              className="mx-4 mb-4 origin-top-right overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[rgba(13,16,22,0.97)] p-2 backdrop-blur-xl lg:hidden"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.95, y: reduce ? 0 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: reduce ? 1 : 0.97,
                transition: { duration: 0.14 },
              }}
              transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
            >
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  data-active={active === l.id}
                  className="flex min-h-[48px] items-center justify-between rounded-xl px-4 text-[15px] text-[var(--paper-dim)] transition-colors duration-150 hover:bg-[var(--surface)] hover:text-[var(--paper)] data-[active=true]:text-[var(--accent)]"
                >
                  {l.label}
                  <ArrowRight size={15} strokeWidth={1.75} />
                </a>
              ))}
              <div className="my-1 h-px bg-[var(--line)]" />
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex min-h-[48px] items-center rounded-xl px-4 text-[15px] text-[var(--paper)]"
              >
                Sign in
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
