import { ChevronRight } from 'lucide-react';
import { Reveal } from './Reveal';

interface SectionTwoProps {
  onOpenConsultation: () => void;
  onOpenDemo: (pipeline?: 'vision' | 'insight' | 'speed') => void;
}

const CAPABILITIES = [
  {
    index: '01',
    pipeline: 'vision' as const,
    title: 'Real-time vision',
    body: 'Reads context as it happens and surfaces what matters before you ask.',
  },
  {
    index: '02',
    pipeline: 'insight' as const,
    title: 'Layered insight',
    body: 'Moves from rough outline to sharp output without losing the thread.',
  },
  {
    index: '03',
    pipeline: 'speed' as const,
    title: 'Adaptive speed',
    body: 'Learns your cadence and tightens every pass as you work.',
  },
];

export function SectionTwo({ onOpenConsultation, onOpenDemo }: SectionTwoProps) {
  return (
    <section
      id="capability-section"
      className="relative w-full min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between pt-24 sm:pt-28 pb-12 md:pb-16 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto"
    >
      {/* Top row: Left Badge & Right Copy */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between w-full">
        {/* Left: Left-accent glass badge */}
        <div>
          <Reveal delay={120}>
            <div className="inline-block border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md border border-white/10 rounded-r-sm">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white drop-shadow-sm font-medium">
                Insight On Demand
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right copy */}
        <div className="max-w-sm sm:text-right">
          <Reveal delay={220}>
            <p className="text-lg sm:text-xl leading-relaxed text-white drop-shadow-md font-normal">
              Our AI doesn't just respond — it interprets, sharpens, and delivers the signal you need.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Bottom area: Left Headline & CTAs + Right Frosted Capability Panel */}
      <div className="flex-1 flex flex-col justify-end mt-16 sm:mt-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between md:gap-16 w-full">
          {/* Left Column */}
          <div className="max-w-xl">
            <Reveal delay={180}>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg">
                Learn to see
                <br />
                brilliantly.
              </h2>
            </Reveal>

            <Reveal delay={320}>
              <p className="mt-6 max-w-md text-sm sm:text-base text-white/80 drop-shadow-md leading-relaxed font-normal">
                From the first sketch to the final render, Nova turns raw intent into decisions your team can act on — quietly, precisely, at speed.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={420}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenDemo('vision')}
                  className="rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-black transition-all duration-300 hover:bg-white/85 active:scale-[0.98] cursor-pointer flex items-center gap-1.5 drop-shadow-sm"
                >
                  <span>Run the demo</span>
                  <ChevronRight size={14} className="shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-300 hover:bg-white/20 active:scale-[0.98] cursor-pointer drop-shadow-sm"
                >
                  Free consultation
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right — Frosted capability panel */}
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-5 sm:px-6 shadow-2xl">
            {CAPABILITIES.map((cap, i) => (
              <Reveal
                key={cap.index}
                delay={300 + i * 110}
                className={`group flex gap-5 py-5 transition-colors duration-300 ${
                  i < CAPABILITIES.length - 1 ? 'border-b border-white/15' : ''
                }`}
              >
                <div className="shrink-0 pt-0.5">
                  <span className="font-mono text-[11px] tracking-[0.15em] text-white/55">
                    {cap.index}
                  </span>
                </div>
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onOpenDemo(cap.pipeline)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onOpenDemo(cap.pipeline);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-medium text-white drop-shadow-sm group-hover:text-white transition-colors duration-200">
                      {cap.title}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
                    />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                    {cap.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
