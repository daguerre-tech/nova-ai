import { useEffect, useState } from 'react';
import { X, ExternalLink, Activity } from 'lucide-react';
import type { ProjectShowcase } from '../../shared/types';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (proj: ProjectShowcase) => void;
}

export function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const [projects, setProjects] = useState<ProjectShowcase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/projects')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setProjects(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-white/20 bg-[#0f0f11]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="border-l-2 border-white bg-white/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/90">
            Case Studies
          </span>
          <span className="text-xs text-white/50 font-mono">6 Enterprise Deployments</span>
        </div>

        <h3 className="text-2xl font-normal tracking-tight text-white drop-shadow-sm">
          Nova Production Projects
        </h3>
        <p className="mt-1 text-sm text-white/70">
          Autonomous systems currently driving high-volume workflows for tier-1 enterprises.
        </p>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-white/40">
            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-6 overflow-y-auto space-y-3 pr-1">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/40">0{idx + 1}</span>
                    <h4 className="text-base font-medium text-white">{p.title}</h4>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-fit">
                    <Activity size={10} />
                    {p.metric}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  {p.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-white/50 pt-2 border-t border-white/10">
                  <span>Client: {p.client}</span>
                  <span className="tracking-wider uppercase">{p.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-mono text-white/40">
            Deployed on Cloudflare Workers & Global Edge Mesh
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white px-5 py-2 text-xs font-medium text-black hover:bg-white/85 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
