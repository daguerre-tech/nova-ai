import React, { useState } from 'react';
import { X, Send, CheckCircle2, Mail, User, MessageSquare } from 'lucide-react';
import type { ContactMessage } from '../../shared/schemas';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to send message');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#0f0f11]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>

        {!success ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="border-l-2 border-white bg-white/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/90">
                Direct Inquiry
              </span>
              <span className="text-xs text-white/50 font-mono">Nova Leadership</span>
            </div>

            <h3 className="text-2xl font-normal tracking-tight text-white drop-shadow-sm">
              Contact NovaAI
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Reach our engineering and strategy partners directly.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-3 top-3 text-white/40" />
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your organization's goals or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
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
                      <span>Transmit Message</span>
                      <Send size={15} />
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
            <h3 className="text-2xl font-normal text-white">Message Transmitted</h3>
            <p className="text-sm text-white/80 max-w-sm mx-auto leading-relaxed">
              Thank you for contacting NovaAI. Our leadership team has received your inquiry and will respond within 24 hours.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-black hover:bg-white/85 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
