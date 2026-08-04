"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { PenLine, QrCode, UserPlus } from "lucide-react";
import { Reveal } from "./primitives";

const STEPS = [
  {
    id: "build",
    Icon: PenLine,
    title: "Build it once",
    body: "A five step wizard takes you from empty to publishable: template, accent, details, preview. Drag the header, contact and social blocks into the order you want them read.",
    meta: "About two minutes",
  },
  {
    id: "show",
    Icon: QrCode,
    title: "Show the code",
    body: "Your QR code is generated from your handle and recoloured to match your accent. Put it on a slide, a laptop lid, an email signature, or just pull it up on your phone.",
    meta: "Branded, not black and white",
  },
  {
    id: "keep",
    Icon: UserPlus,
    title: "They keep you",
    body: "The card opens in their browser with no download and no account. One tap saves it as a phone contact, or into their Cardixx network if they have one.",
    meta: "vCard and saved cards",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.3,
  });

  // Which step is being read, for the rail markers and the left column.
  useEffect(() => {
    const nodes = STEPS.map((s) => document.getElementById(`step-${s.id}`)).filter(
      Boolean
    );
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = nodes.indexOf(e.target);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    /* `relative` so the scroll-progress measurement has a positioned
       offsetParent to resolve against. */
    <section id="how" className="relative scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Sticky left column: the claim stays put while the steps move past. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="lp-display text-[clamp(2rem,4.6vw,3.2rem)]">
              Three steps, then you never{" "}
              <span className="lp-hi">reprint</span> anything again.
            </h2>
            <p className="lp-measure mt-6 text-[16px] leading-[1.65] text-[var(--paper-dim)]">
              Set the card up once. After that the code you hand out always
              resolves to whatever is on your profile today.
            </p>
          </Reveal>

          <div className="mt-10 hidden lg:block">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 py-2">
                <span
                  className="h-px"
                  style={{
                    width: active === i ? 28 : 14,
                    background:
                      active === i ? "var(--accent)" : "var(--line-strong)",
                    transition:
                      "width 260ms cubic-bezier(0.23,1,0.32,1), background-color 260ms cubic-bezier(0.23,1,0.32,1)",
                  }}
                />
                <span
                  className="text-[13.5px] transition-colors duration-300 ease-out"
                  style={{
                    color: active === i ? "var(--paper)" : "var(--paper-faint)",
                  }}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: the steps, with a rail that draws as you read. */}
        <div ref={trackRef} className="relative">
          <div
            aria-hidden="true"
            className="absolute bottom-3 left-[23px] top-3 w-px bg-[var(--line)] sm:left-[27px]"
          >
            <motion.div
              className="h-full w-full origin-top bg-[var(--accent)] opacity-70"
              style={{ scaleY: reduce ? 1 : scaleY }}
            />
          </div>

          <div className="space-y-16 sm:space-y-20">
            {STEPS.map(({ id, Icon, title, body, meta }, i) => (
              <Reveal key={id} amount={0.35}>
                <div
                  id={`step-${id}`}
                  className="grid grid-cols-[48px_minmax(0,1fr)] gap-5 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-7"
                >
                  <span
                    className="relative grid h-12 w-12 place-items-center rounded-full border bg-[var(--ink-900)] transition-colors duration-300 ease-out sm:h-14 sm:w-14"
                    style={{
                      borderColor:
                        active === i ? "rgba(46,211,224,0.45)" : "var(--line-strong)",
                    }}
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.75}
                      color={active === i ? "var(--accent)" : "var(--paper-faint)"}
                    />
                  </span>
                  <div className="pt-1.5 sm:pt-2.5">
                    <h3 className="text-[22px] font-semibold tracking-[-0.022em]">
                      {title}
                    </h3>
                    <p className="lp-measure mt-3 text-[15.5px] leading-[1.68] text-[var(--paper-dim)]">
                      {body}
                    </p>
                    <p className="mt-4 text-[13px] font-medium text-[var(--accent)]">
                      {meta}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
