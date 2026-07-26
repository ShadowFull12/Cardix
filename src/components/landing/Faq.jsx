"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "./primitives";

const QA = [
  {
    q: "Does the other person need the app?",
    a: "No. Scanning your code opens a normal web page in their browser. They can read your card, tap to call or email you, and download you as a phone contact without ever making an account.",
  },
  {
    q: "Can I change my card after I have printed the QR code?",
    a: "Yes. The code points at your handle, not at a snapshot of your details. Update your role, swap a link, change the theme, and every code you have handed out resolves to the current card.",
  },
  {
    q: "How do I sign in?",
    a: "Google, or email and password. Authentication runs on Firebase Auth, your card data lives in Firestore, and your uploads go to Cloudinary.",
  },
  {
    q: "What if I do not want someone to have my phone number?",
    a: "Email, phone and location each have their own visibility switch, and any single viewer can be restricted to the minimal version of your card without being told. Temporary links expire on their own.",
  },
  {
    q: "What is the vault for?",
    a: "Files and notes that belong with your identity: a portfolio PDF, a deck, a rich text note with checklists and images. 500 MB on Free, 10 GB on Pro, synced to every device you sign in on.",
  },
  {
    q: "Can I delete everything?",
    a: "Yes. You can wipe the profile and the vault from Settings whenever you like, and deleting the profile takes the public card offline immediately.",
  },
];

function Row({ item, open, onToggle, id }) {
  const reduce = useReducedMotion();
  return (
    <div className="border-b border-[var(--line)]">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`faq-panel-${id}`}
          id={`faq-btn-${id}`}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-6 py-5 text-left"
        >
          <span
            className="text-[16.5px] font-medium leading-[1.45] tracking-[-0.015em] transition-colors duration-200 ease-out sm:text-[17.5px]"
            style={{ color: open ? "var(--paper)" : "var(--paper-dim)" }}
          >
            {item.q}
          </span>
          <span
            className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border"
            aria-hidden="true"
            style={{
              transform: open ? "rotate(135deg)" : "rotate(0deg)",
              transition: reduce
                ? "none"
                : "transform 260ms cubic-bezier(0.23,1,0.32,1), border-color 200ms ease-out",
              borderColor: open ? "rgba(46,211,224,0.5)" : "var(--line-strong)",
            }}
          >
            <Plus
              size={14}
              strokeWidth={1.75}
              color={open ? "var(--accent)" : "var(--paper-dim)"}
            />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-panel-${id}`}
            role="region"
            aria-labelledby={`faq-btn-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: reduce ? 0 : 0.17 } }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <p className="lp-measure pb-6 pr-10 text-[15px] leading-[1.68] text-[var(--paper-dim)]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <h2 className="lp-display text-[clamp(2rem,4.4vw,2.9rem)]">
              The things people <span className="lp-hi">actually</span> ask.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--paper-dim)]">
              Still stuck? The repository and the issue tracker are public.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60} amount={0.1}>
          <div className="border-t border-[var(--line)]">
            {QA.map((item, i) => (
              <Row
                key={item.q}
                id={i}
                item={item}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
