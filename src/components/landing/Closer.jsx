"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { QrPlate } from "./CardixCard";
import { Reveal } from "./primitives";

export function Closer() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--ink-925)] px-5 py-24 sm:px-8 sm:py-32">
      <div
        className="lp-bloom left-1/2 top-1/2 h-[520px] w-[840px] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="relative overflow-hidden rounded-[28px] border border-[var(--line-strong)] bg-[var(--ink-900)] px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
          {/* Card edges fanned out, the deck motif one last time. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-16 hidden lg:block"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="absolute h-[230px] w-[350px] rounded-[26px] border border-[var(--line)]"
                style={{
                  bottom: i * 12,
                  right: i * 26,
                  transform: `rotate(${-8 + i * 3}deg)`,
                  background: "rgba(241,239,233,0.018)",
                }}
              />
            ))}
          </div>

          <Reveal>
            <div className="relative max-w-2xl">
              <QrPlate accent="#2ed3e0" size={72} scanning />
              <h2 className="lp-display mt-8 text-[clamp(2.2rem,5.4vw,3.7rem)]">
                Your next introduction can be{" "}
                <span className="lp-hi">one scan</span> long.
              </h2>
              <p className="lp-measure mt-6 text-[16.5px] leading-[1.62] text-[var(--paper-dim)]">
                Build the card, keep the code, throw away the stack in your wallet.
                Free forever plan, no card details, about two minutes to set up.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/signup"
                  className="lp-btn lp-btn-primary group min-h-[52px]! px-7! text-[15.5px]"
                >
                  Create your card
                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                    className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/login"
                  className="lp-btn lp-btn-ghost min-h-[52px]! px-7! text-[15.5px]"
                >
                  I already have one
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "#how" },
        { label: "Features", href: "#features" },
        { label: "Sharing", href: "#sharing" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Create your card", href: "/signup" },
        { label: "Sign in", href: "/login" },
        { label: "Upgrade to Pro", href: "/pro" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Project",
      links: [
        {
          label: "Source on GitHub",
          href: "https://github.com/ShadowFull12/Cardix",
          external: true,
        },
        {
          label: "Report an issue",
          href: "https://github.com/ShadowFull12/Cardix/issues",
          external: true,
        },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--line)] px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="lp-display text-[17px] tracking-[-0.03em]">
                Cardixx
              </span>
            </div>
            <p className="lp-measure mt-4 max-w-xs text-[14px] leading-relaxed text-[var(--paper-faint)]">
              A digital identity card you hand over with a scan. Built with
              Next.js, Firebase and Cloudinary.
            </p>
          </div>

          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-[13px] font-semibold text-[var(--paper)]">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      {...(l.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="lp-underline inline-flex text-[14px] text-[var(--paper-dim)] transition-colors duration-150 hover:text-[var(--paper)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[var(--paper-faint)]">
            © 2026 Cardixx
          </p>
          <p className="text-[13px] text-[var(--paper-faint)]">
            In beta. Expect rough edges, and tell us about them.
          </p>
        </div>
      </div>
    </footer>
  );
}
