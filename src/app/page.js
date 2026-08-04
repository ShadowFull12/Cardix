import "@/styles/landing.css";
import { lpFontVars } from "./fonts";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { StatStrip } from "@/components/landing/StatStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ThemeMarquee } from "@/components/landing/ThemeMarquee";
import { Features } from "@/components/landing/Features";
import { ShareModes } from "@/components/landing/ShareModes";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { Closer, LandingFooter } from "@/components/landing/Closer";

export const metadata = {
  title: "Cardixx, your business card in one scan",
  description:
    "Cardixx puts your contacts, links and socials on one card with a QR code. They scan it, your card opens in their browser, they save you in a tap. Free forever plan.",
  openGraph: {
    title: "Cardixx, your business card in one scan",
    description:
      "A digital identity card with a branded QR code, expiring share links, analytics and a personal vault.",
    url: "https://cardixx1.vercel.app",
    siteName: "Cardixx",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardixx, your business card in one scan",
    description:
      "A digital identity card with a branded QR code, expiring share links, analytics and a personal vault.",
  },
};

export default function HomePage() {
  return (
    <div className={`lp ${lpFontVars} relative min-h-[100dvh] w-full`}>
      <a href="#main" className="lp-skip">
        Skip to content
      </a>

      {/* Watched by the nav so it can condense without a scroll listener. */}
      <div id="lp-top-sentinel" aria-hidden="true" className="absolute top-0 h-6 w-px" />

      <LandingNav />

      <main id="main">
        <Hero />
        <StatStrip />
        <HowItWorks />
        <ThemeMarquee />
        <Features />
        <ShareModes />
        <Pricing />
        <Faq />
        <Closer />
      </main>

      <LandingFooter />

      {/* Grain on a fixed layer so scrolling never repaints it. */}
      <div className="lp-grain" aria-hidden="true" />
    </div>
  );
}
