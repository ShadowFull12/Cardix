"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Timer, FileText } from "lucide-react";
import { BuilderPreview } from "./BuilderPreview";
import {
  Reveal,
  useInViewOnce,
  usePrefersReducedMotion,
  useSpotlight,
} from "./primitives";

const S = 1.75;

/* --------------------------------------------------------------- analytics */

/* Recharts, the same library the product's analytics page renders with. Sample
   data, labelled as such. */
const SAMPLE = [
  { d: "Mon", views: 38 },
  { d: "Tue", views: 54 },
  { d: "Wed", views: 31 },
  { d: "Thu", views: 72 },
  { d: "Fri", views: 61 },
  { d: "Sat", views: 88 },
  { d: "Sun", views: 74 },
];

function AnalyticsPreview() {
  const [ref, inView] = useInViewOnce({ amount: 0.4 });
  const reduce = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-[var(--line)] p-4"
      style={{
        background:
          "linear-gradient(168deg, rgba(46,211,224,0.09), rgba(10,12,17,0.4) 58%)",
      }}
    >
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[12px] text-[var(--paper-faint)]">Card views</p>
          <p className="lp-num mt-1 text-[22px] text-[var(--paper)]">1,284</p>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
          style={{ borderColor: "rgba(233,180,76,0.35)", color: "var(--gold)" }}
        >
          Pro
        </span>
      </div>

      <div className="mt-4 h-[104px] w-full">
        {inView && (
          /* initialDimension stops Recharts measuring -1 x -1 on its first pass
             before the ResizeObserver reports, which logged a warning and
             painted an empty frame. */
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            debounce={0}
            initialDimension={{ width: 360, height: 104 }}
          >
            <AreaChart data={SAMPLE} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
              <defs>
                <linearGradient id="lpViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2ed3e0" stopOpacity={0.42} />
                  <stop offset="100%" stopColor="#2ed3e0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="d"
                tick={{ fill: "#7b8595", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <Tooltip
                cursor={{ stroke: "rgba(46,211,224,0.35)" }}
                contentStyle={{
                  background: "#11151d",
                  border: "1px solid rgba(241,239,233,0.16)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "#f1efe9",
                }}
                labelStyle={{ color: "#7b8595" }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#2ed3e0"
                strokeWidth={2}
                fill="url(#lpViews)"
                isAnimationActive={!reduce}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="mt-2 text-[11px] text-[var(--paper-faint)]">Sample data</p>
    </div>
  );
}

/* -------------------------------------------------------- expiring link */

function CountdownPreview() {
  const reduce = usePrefersReducedMotion();
  const [secs, setSecs] = useState(899);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setSecs((s) => (s <= 1 ? 899 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [reduce]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = (secs / 900) * 100;

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-925)] p-4">
      <div className="flex items-center justify-between">
        <span className="lp-num truncate text-[12px] text-[var(--paper-faint)]">
          /share/8fk2p1
        </span>
        <Timer size={14} strokeWidth={S} color="var(--accent)" />
      </div>
      <p
        className="lp-num mt-3 text-[30px] text-[var(--paper)]"
        aria-label={`Expires in ${mm} minutes ${ss} seconds`}
      >
        {mm}:{ss}
      </p>
      {/* A bare progress line, no filled track box. */}
      <div className="mt-3 h-px w-full bg-[var(--line)]">
        <div
          className="h-px bg-[var(--accent)]"
          /* Matches the tick, slightly under it so it never overshoots. */
          style={{ width: `${pct}%`, transition: "width 960ms linear" }}
        />
      </div>
      <div className="mt-4 flex gap-1.5">
        {["15", "30", "60"].map((m, i) => (
          <span
            key={m}
            className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
            style={
              i === 0
                ? { borderColor: "rgba(46,211,224,0.4)", color: "var(--accent)" }
                : { borderColor: "var(--line)", color: "var(--paper-faint)" }
            }
          >
            {m} min
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- vault */

function VaultPreview() {
  const [ref, inView] = useInViewOnce({ amount: 0.5 });
  return (
    <div ref={ref} className="rounded-2xl border border-[var(--line)] bg-[var(--ink-925)] p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-[var(--paper-faint)]">Vault used</span>
        <span className="lp-num text-[12px] text-[var(--paper-dim)]">128 / 500 MB</span>
      </div>
      <div className="mt-3 h-px w-full bg-[var(--line)]">
        <div
          className="h-px bg-[var(--accent)]"
          style={{
            width: inView ? "25.6%" : "0%",
            transition: "width 420ms cubic-bezier(0.23,1,0.32,1)",
          }}
        />
      </div>
      <div className="mt-4 space-y-2">
        {["portfolio-2026.pdf", "keynote-deck.key"].map((f) => (
          <div
            key={f}
            className="flex items-center gap-2.5 rounded-lg border border-[var(--line)] bg-[var(--ink-850)] px-2.5 py-2"
          >
            <FileText size={13} strokeWidth={S} color="var(--paper-faint)" />
            <span className="truncate text-[12px] text-[var(--paper-dim)]">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- scanner */

function ScannerPreview() {
  return (
    <div
      className="rounded-2xl border border-[var(--line)] p-4"
      style={{
        background:
          "linear-gradient(200deg, rgba(46,211,224,0.07), rgba(10,12,17,0.5) 62%)",
      }}
    >
      <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-xl bg-[rgba(8,9,12,0.6)]">
        {[
          "left-3 top-3 border-l border-t rounded-tl-md",
          "right-3 top-3 border-r border-t rounded-tr-md",
          "left-3 bottom-3 border-l border-b rounded-bl-md",
          "right-3 bottom-3 border-r border-b rounded-br-md",
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute h-6 w-6 border-[var(--accent)] ${pos}`}
            style={{ borderWidth: 1.5 }}
          />
        ))}
        <span className="lp-scan" />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-[var(--paper-faint)]">
          Looking for a Cardix code
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- section */

const TILES = [
  {
    span: "lg:col-span-7",
    title: "Reorder your card by dragging it",
    body: "Header, contact, socials. Move them into whatever order tells your story, pick one of twelve accents, and watch the preview keep up. Try it right here.",
    Preview: BuilderPreview,
  },
  {
    span: "lg:col-span-5",
    title: "See who actually scanned",
    body: "Views, scans, link clicks and device breakdown, day by day. Free plans get the headline numbers, Pro unlocks the detail.",
    Preview: AnalyticsPreview,
  },
  {
    span: "lg:col-span-4",
    title: "Links that expire on purpose",
    body: "Share a card for 15, 30 or 60 minutes. After that the link is dead.",
    Preview: CountdownPreview,
  },
  {
    span: "lg:col-span-4",
    title: "A drive and a notepad attached",
    body: "Keep your deck, your CV and your rich text notes with the identity they belong to.",
    Preview: VaultPreview,
  },
  {
    span: "lg:col-span-4",
    title: "Scan other people's cards",
    body: "Point the built-in scanner at any Cardix code to open it and save it to your network.",
    Preview: ScannerPreview,
  },
];

function Tile({ span, title, body, Preview }) {
  const { ref, onPointerMove } = useSpotlight();
  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className={`lp-tile lp-spot flex h-full flex-col gap-6 p-5 sm:p-6 ${span}`}
    >
      <div>
        <h3 className="text-[19.5px] font-semibold leading-[1.25] tracking-[-0.022em]">
          {title}
        </h3>
        <p className="mt-2.5 text-[14.5px] leading-[1.62] text-[var(--paper-dim)]">
          {body}
        </p>
      </div>
      <div className="mt-auto">
        <Preview />
      </div>
    </article>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="relative scroll-mt-20 border-t border-[var(--line)] bg-[var(--ink-925)] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <h2 className="lp-display max-w-2xl text-[clamp(2rem,4.6vw,3.2rem)]">
            Not a link in bio. A <span className="lp-hi">working identity</span>{" "}
            with storage, analytics and rules.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {TILES.map((t, i) => (
            <Reveal
              key={t.title}
              delay={i * 70}
              className={`${t.span} h-full`}
              amount={0.15}
            >
              <Tile {...t} span="" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
