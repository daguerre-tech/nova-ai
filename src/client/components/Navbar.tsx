import { Hexagon } from 'lucide-react';
import { Reveal } from './Reveal';

interface NavbarProps {
  onOpenConsultation: () => void;
  onOpenProjects: () => void;
  onOpenContact: () => void;
}

export function Navbar({
  onOpenConsultation,
  onOpenProjects,
  onOpenContact,
}: NavbarProps) {
  const navLinks = [
    {
      name: 'Projects',
      hasSuperscript: true,
      superscript: '6',
      action: onOpenProjects,
    },
    {
      name: 'About',
      action: () => {
        const el = document.getElementById('capability-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      name: 'Blog',
      action: onOpenProjects,
    },
    {
      name: 'Contact',
      action: onOpenContact,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/15 bg-[#0a0a0a]/30 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 sm:h-20 w-full items-center justify-between px-5 sm:px-8 md:px-12 max-w-7xl">
        {/* Logo left */}
        <Reveal delay={0}>
          <a
            href="#"
            className="flex items-center gap-2 text-white group cursor-pointer transition-opacity duration-300 hover:opacity-90"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Hexagon
              size={24}
              strokeWidth={1.5}
              className="text-white transition-transform duration-500 group-hover:rotate-30"
            />
            <span className="text-lg sm:text-xl font-medium tracking-tight text-white drop-shadow-sm">
              novaai
            </span>
          </a>
        </Reveal>

        {/* Center Nav (md+) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link, i) => (
            <Reveal key={link.name} delay={100 + i * 100}>
              <button
                type="button"
                onClick={link.action}
                className="group inline-flex items-baseline text-sm text-white/85 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <span>{link.name}</span>
                {link.hasSuperscript && (
                  <sup className="ml-1 font-mono text-[10px] text-white/60 tracking-wider">
                    {link.superscript}
                  </sup>
                )}
              </button>
            </Reveal>
          ))}
        </nav>

        {/* CTA right */}
        <Reveal delay={500}>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="rounded-md border border-white/20 bg-white/15 backdrop-blur-md px-4 py-2 text-xs sm:px-5 sm:text-sm font-medium text-white transition-all duration-300 hover:bg-white/25 active:scale-[0.98] cursor-pointer drop-shadow-sm"
          >
            Get Free Consultation
          </button>
        </Reveal>
      </div>
    </header>
  );
}
