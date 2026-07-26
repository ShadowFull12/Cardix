"use client";

import Link from "next/link";
import { ArrowRight, ScanLine } from "lucide-react";
import { CardixCard, QrPlate, TiltFrame } from "./CardixCard";
import { useFinePointer, usePrefersReducedMotion } from "./primitives";

/* Back cards of the deck. Offsets live in CSS custom properties so the deal-in
   keyframes can land on them without JavaScript. */
const BACK = [
  { tx: "34px", ty: "30px", rz: "6deg", o: 0.3, d: 90 },
  { tx: "17px", ty: "15px", rz: "3deg", o: 0.55, d: 190 },
];

export function Hero() {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();

  return (
    <section className="lp-grid-bg relative flex min-h-[100dvh] items-center overflow-hidden px-5 pb-20 pt-24 sm:px-8">
      <div
        className="lp-bloom left-1/2 top-[-180px] h-[640px] w-[920px] -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-12">
        <div>
          <h1 className="lp-display text-[clamp(3rem,8.6vw,5.6rem)]">
            <span className="lp-linemask" style={{ "--d": "60ms" }}>
              <span>Stop handing</span>
            </span>
            <span className="lp-linemask" style={{ "--d": "170ms" }}>
              <span>
                out <span className="lp-hi">paper.</span>
              </span>
            </span>
          </h1>

          <p
            className="lp-rise lp-measure mt-7 text-[17.5px] leading-[1.6] text-[var(--paper-dim)] sm:text-[19px]"
            style={{ "--d": "340ms" }}
          >
            Your contacts, links and socials on one card. They scan the code, it
            opens in their browser, they save you in a tap.
          </p>

          <div
            className="lp-rise mt-10 flex flex-wrap items-center gap-3"
            style={{ "--d": "440ms" }}
          >
            <Link href="/signup" className="lp-btn lp-btn-primary group">
              Create your card
              <ArrowRight
                size={17}
                strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </Link>
            <a href="#how" className="lp-btn lp-btn-ghost">
              <ScanLine size={17} strokeWidth={1.75} />
              See how it works
            </a>
          </div>
        </div>

        {/* The deck. Front card is a live preview of the product's card. */}
        <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
          <div className="relative pb-12 pt-4 [perspective:1600px]">
            {BACK.map((c, i) => (
              <div
                key={c.d}
                aria-hidden="true"
                className="lp-deal-back absolute inset-x-0 top-4"
                style={{
                  zIndex: i + 1,
                  "--tx": c.tx,
                  "--ty": c.ty,
                  "--rz": c.rz,
                  "--o": c.o,
                  "--d": `${c.d}ms`,
                }}
              >
                <div className="h-[300px] rounded-[28px] border border-[var(--line)] bg-[var(--ink-900)] shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)] sm:h-[320px]" />
              </div>
            ))}

            <div className="lp-deal relative z-10" style={{ "--d": "300ms" }}>
              <TiltFrame disabled={!fine || reduce} max={7}>
                <CardixCard accent="#2ed3e0" mode="full" showQr={false} />
              </TiltFrame>
            </div>

            <div
              className="lp-rise absolute -bottom-3 -right-1 z-20 sm:-right-5"
              style={{ "--d": "760ms" }}
            >
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--line-strong)] bg-[rgba(13,16,22,0.94)] p-3 pr-4 shadow-[0_28px_56px_-30px_rgba(0,0,0,0.95)] backdrop-blur-md">
                <QrPlate accent="#2ed3e0" size={56} scanning />
                <div>
                  <p className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--paper)]">
                    Scan to open
                  </p>
                  <p className="mt-0.5 text-[12px] text-[var(--paper-faint)]">
                    No app on their side
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
