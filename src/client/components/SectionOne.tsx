import { ChevronRight } from 'lucide-react';
import { Reveal } from './Reveal';

interface SectionOneProps {
  onOpenConsultation: () => void;
}

const PORTRAIT_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260728_050334_5b076e26-0ce7-4898-b432-d764190e448f.png&w=1280&q=85';

const SERVICES = [
  '/ AI AUTOMATION',
  '/ AI INTEGRATION',
  '/ AI AGENT DEVELOPMENT',
];

export function SectionOne({ onOpenConsultation }: SectionOneProps) {
  return (
    <section className="relative w-full min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between pt-24 sm:pt-28 pb-12 md:pb-16 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Top row: Services list (left) & Intro statement (right) */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between w-full">
        {/* Left: Service list */}
        <div className="flex flex-col gap-2">
          {SERVICES.map((service, i) => (
            <Reveal key={service} delay={150 + i * 120}>
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md select-none">
                {service}
              </span>
            </Reveal>
          ))}
        </div>

        {/* Right: Intro copy */}
        <div className="max-w-xs sm:text-right">
          <Reveal delay={300}>
            <p className="text-lg sm:text-xl leading-relaxed text-white drop-shadow-md font-normal">
              We design automation that brings clarity, precision, and efficiency to the way your company operates.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Bottom row: Headline & Badge (left) & Mitha contact card (right) */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between w-full mt-16 sm:mt-24">
        {/* Left: Badge + H1 */}
        <div className="max-w-2xl">
          {/* Left-accent glass badge */}
          <Reveal delay={150}>
            <div className="inline-block border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-5 border border-white/10 rounded-r-sm">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white drop-shadow-sm font-medium">
                We Automate 100+ Businesses
              </span>
            </div>
          </Reveal>

          {/* H1 Headline */}
          <Reveal delay={280}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg">
              Clear. Precise.
              <br />
              Automated.
            </h1>
          </Reveal>
        </div>

        {/* Right: Glass contact card */}
        <Reveal delay={420} className="self-start md:self-end">
          <div className="flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md border border-white/20 shadow-xl transition-transform duration-300 hover:border-white/30">
            <img
              src={PORTRAIT_URL}
              alt="Mitha, co-founder of NovaAI"
              className="h-24 w-20 rounded-lg object-cover shrink-0 select-none shadow-md"
              loading="eager"
            />
            <div className="flex flex-col gap-1.5 pr-2">
              <div className="text-sm font-medium text-white drop-shadow-sm">
                Talk with Mitha
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
                Co-founder of NovaAI
              </div>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="mt-1.5 flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition-colors duration-300 hover:bg-white/85 active:scale-[0.98] cursor-pointer drop-shadow-sm"
              >
                <span>Book 15-mins call</span>
                <ChevronRight size={14} className="shrink-0" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
