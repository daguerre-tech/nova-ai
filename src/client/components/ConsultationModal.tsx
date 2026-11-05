import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, User, Building, Mail, Sparkles } from 'lucide-react';
import type { ConsultationRequest } from '../../shared/schemas';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScope?: 'AI AUTOMATION' | 'AI INTEGRATION' | 'AI AGENT DEVELOPMENT' | 'OTHER';
}

export function ConsultationModal({
  isOpen,
  onClose,
  defaultScope = 'AI AUTOMATION',
}: ConsultationModalProps) {
  const [formData, setFormData] = useState<ConsultationRequest>({
    fullName: '',
    email: '',
    company: '',
    teamSize: '1-10',
    projectScope: defaultScope,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    message: string;
    assignedSpecialist: string;
    estimatedCallDuration: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit consultation request');
      }

      setSuccessData({
        id: json.data.id,
        message: json.message,
        assignedSpecialist: json.data.assignedSpecialist,
        estimatedCallDuration: json.data.estimatedCallDuration,
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#0f0f11]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>

        {!successData ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="border-l-2 border-white bg-white/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/90">
                Direct Line
              </span>
              <span className="text-xs text-white/50 font-mono">15-min strategy call</span>
            </div>

            <h3 className="text-2xl font-normal tracking-tight text-white drop-shadow-sm">
              Schedule with Mitha
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Co-founder of NovaAI. Discuss your automation requirements and architectural roadmap.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3 text-white/40" />
                    <input
                      type="text"
                      required
                      placeholder="Alex Chen"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-3 text-white/40" />
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Company
                  </label>
                  <div className="relative">
                    <Building size={15} className="absolute left-3 top-3 text-white/40" />
                    <input
                      type="text"
                      required
                      placeholder="Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value as any })}
                    className="w-full rounded-lg border border-white/15 bg-[#17171a] py-2.5 px-3 text-sm text-white focus:border-white/40 focus:outline-none"
                  >
                    <option value="1-10">1 - 10 people</option>
                    <option value="11-50">11 - 50 people</option>
                    <option value="51-200">51 - 200 people</option>
                    <option value="201+">201+ enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Core Area of Interest
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['AI AUTOMATION', 'AI INTEGRATION', 'AI AGENT DEVELOPMENT'] as const).map(
                    (scope) => (
                      <button
                        type="button"
                        key={scope}
                        onClick={() => setFormData({ ...formData, projectScope: scope })}
                        className={`py-2 px-2 rounded-lg text-[10px] font-mono tracking-wider transition-all duration-200 border ${
                          formData.projectScope === scope
                            ? 'border-white bg-white/20 text-white font-medium'
                            : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {scope.replace('AI ', '')}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Brief context / goals (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="What operational workflow would you like to automate or sharpen?"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-white py-3 px-6 text-sm font-medium text-black transition-all duration-300 hover:bg-white/85 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirm 15-Minute Strategy Call</span>
                      <Sparkles size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>

            <h3 className="text-2xl font-normal text-white">Session Confirmed</h3>
            <p className="text-sm text-white/80 max-w-sm mx-auto leading-relaxed">
              {successData.message}
            </p>

            <div className="mt-4 p-4 rounded-xl border border-white/15 bg-white/5 max-w-sm mx-auto text-left space-y-2 text-xs text-white/70 font-mono">
              <div className="flex items-center gap-2">
                <User size={14} className="text-white/40" />
                <span>Specialist: {successData.assignedSpecialist}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-white/40" />
                <span>Duration: {successData.estimatedCallDuration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-white/40" />
                <span>Booking ID: {successData.id}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-black hover:bg-white/85 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
