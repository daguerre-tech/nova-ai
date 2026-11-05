import React, { useState } from 'react';
import { X, Play, Zap, Eye, GitBranch, Cpu, Activity } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPipeline?: 'vision' | 'insight' | 'speed';
}

export function DemoModal({
  isOpen,
  onClose,
  initialPipeline = 'vision',
}: DemoModalProps) {
  const [pipeline, setPipeline] = useState<'vision' | 'insight' | 'speed'>(initialPipeline);
  const [prompt, setPrompt] = useState(
    'Audit multi-source telemetry from 14 global assembly nodes and flag anomalous precision drift.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    pipeline: string;
    output: string;
    latencyMs: number;
    metrics: Record<string, string>;
    edgeRegion: string;
  } | null>(null);

  if (!isOpen) return null;

  const runDemo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/demo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline, prompt }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const presetScenarios: Record<'vision' | 'insight' | 'speed', string[]> = {
    vision: [
      'Audit multi-source telemetry from 14 global assembly nodes and flag anomalous precision drift.',
      'Surface low-contrast composite micro-cracks from 4K high-speed camera stream.',
    ],
    insight: [
      'Extract decision tree dependencies from 300 page unorganized regulatory compliance filings.',
      'Synthesize financial ledger records into verified executive action items.',
    ],
    speed: [
      'Route dynamic workload balancing across 50 serverless edge regions under high traffic surge.',
      'Tighten synchronous telemetry pass for zero-latency sensor loops.',
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0f0f11]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="border-l-2 border-white bg-white/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/90">
            Interactive Testbed
          </span>
          <span className="text-xs text-white/50 font-mono">Edge Pipeline</span>
        </div>

        <h3 className="text-2xl font-normal tracking-tight text-white drop-shadow-sm">
          Run Nova Architecture Demo
        </h3>
        <p className="mt-1 text-sm text-white/70">
          Experience how our edge pipelines interpret, sharpen, and act upon complex intent.
        </p>

        {/* Pipeline selector tabs */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { id: 'vision', label: '01 Vision', icon: Eye },
            { id: 'insight', label: '02 Insight', icon: GitBranch },
            { id: 'speed', label: '03 Speed', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = pipeline === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setPipeline(tab.id as any);
                  setPrompt(presetScenarios[tab.id as keyof typeof presetScenarios][0]);
                  setResult(null);
                }}
                className={`py-3 px-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  active
                    ? 'border-white bg-white/20 text-white shadow-lg'
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon size={18} />
                <span className="font-mono text-xs uppercase tracking-wider font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={runDemo} className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/70">
                Input Operational Intent
              </label>
              <span className="text-[10px] text-white/40 font-mono">Simulated live feed</span>
            </div>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-white focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-white/40 uppercase">Try:</span>
            {presetScenarios[pipeline].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(p)}
                className="text-[11px] font-mono text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 transition-colors cursor-pointer truncate max-w-xs"
              >
                {p.slice(0, 38)}...
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <Cpu size={14} />
              <span>Hono + Cloudflare Worker</span>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-black transition-all duration-300 hover:bg-white/85 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Dispatch Signal</span>
                  <Play size={13} className="fill-black" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Analysis Result Output */}
        {result && (
          <div className="mt-5 p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-white/70">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Activity size={14} />
                <span>Execution Complete</span>
              </div>
              <span>Latency: {result.latencyMs}ms</span>
            </div>

            <p className="text-sm font-mono text-white/90 leading-relaxed bg-black/40 p-3 rounded-lg border border-white/10">
              {result.output}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
              {Object.entries(result.metrics).map(([key, val]) => (
                <div key={key} className="bg-white/5 p-2 rounded border border-white/10">
                  <div className="text-white/40 uppercase tracking-wider">{key}</div>
                  <div className="text-white font-medium mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
