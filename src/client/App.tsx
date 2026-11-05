import { useState } from 'react';
import { ScrollVideo } from './components/ScrollVideo';
import { Navbar } from './components/Navbar';
import { SectionOne } from './components/SectionOne';
import { SectionTwo } from './components/SectionTwo';
import { ConsultationModal } from './components/ConsultationModal';
import { DemoModal } from './components/DemoModal';
import { ProjectsModal } from './components/ProjectsModal';
import { ContactModal } from './components/ContactModal';

export default function App() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoPipeline, setDemoPipeline] = useState<'vision' | 'insight' | 'speed'>('vision');
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleOpenDemo = (pipeline: 'vision' | 'insight' | 'speed' = 'vision') => {
    setDemoPipeline(pipeline);
    setIsDemoOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden">
      {/* Scroll-scrubbed video background (fixed inset-0 z-0, pointer-events-none) */}
      <ScrollVideo />

      {/* Relative z-10 wrapper */}
      <div className="relative z-10 flex flex-col w-full">
        {/* Navbar (fixed top) */}
        <Navbar
          onOpenConsultation={() => setIsConsultationOpen(true)}
          onOpenProjects={() => setIsProjectsOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
        />

        {/* Main Content */}
        <main className="w-full flex flex-col">
          {/* Section One — Hero (min-h-screen / 100svh) */}
          <SectionOne onOpenConsultation={() => setIsConsultationOpen(true)} />

          {/* Spacer div h-[80vh] (aria-hidden) ← critical for scroll video length */}
          <div className="h-[80vh] w-full pointer-events-none" aria-hidden="true" />

          {/* Section Two — Capability (min-h-screen / 100svh) */}
          <SectionTwo
            onOpenConsultation={() => setIsConsultationOpen(true)}
            onOpenDemo={handleOpenDemo}
          />
        </main>
      </div>

      {/* Interactive Modals */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        initialPipeline={demoPipeline}
      />

      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
