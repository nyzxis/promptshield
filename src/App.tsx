import { useState, useEffect, useRef } from 'react';
import { StatusBar } from './components/StatusBar';
import { PromptInputPanel } from './components/PromptInputPanel';
import { FuzzingResultsPanel } from './components/FuzzingResultsPanel';
import { VulnerabilityReport } from './components/VulnerabilityReport';
import { GuideModal } from './components/GuideModal';
import { useFuzzingEngine } from './hooks/useFuzzingEngine';

export default function App() {
  const { results, status, currentPattern, progress, startFuzzing, stopFuzzing, reset } =
    useFuzzingEngine();

  const [elapsed, setElapsed] = useState(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'running') {
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1000);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  return (
    <div className="min-h-screen w-full bg-[#08080d] text-zinc-100 antialiased py-3 sm:py-8 px-3 sm:px-6 flex flex-col items-center justify-start selection:bg-violet-500/30 selection:text-white">
      {/* Containerized Shell */}
      <div className="w-full max-w-7xl mx-auto rounded-2xl border border-violet-500/20 bg-[#0c0c14]/95 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
        {/* Top Status Bar */}
        <StatusBar
          status={status}
          results={results}
          progress={progress}
          elapsed={elapsed}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        {/* Main Content: Responsive Split */}
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-violet-500/10">
          {/* Left Panel: Input + Controls */}
          <div className="w-full lg:w-[45%] flex flex-col">
            <PromptInputPanel
              status={status}
              onStartFuzzing={startFuzzing}
              onStop={stopFuzzing}
              onReset={reset}
            />
          </div>

          {/* Right Panel: Results + Gauge */}
          <div className="w-full lg:w-[55%] flex flex-col overflow-hidden">
            <FuzzingResultsPanel
              results={results}
              status={status}
              currentPattern={currentPattern}
            />
          </div>
        </div>

        {/* Bottom: Vulnerability Report */}
        <VulnerabilityReport results={results} />
      </div>

      {/* Footer Branding */}
      <footer className="mt-6 text-center font-mono text-[11px] text-zinc-600">
        PromptShield • AI Red-Teaming & Fuzzer • Built by <a href="https://nyzxis.vercel.app/" target="_blank" rel="noreferrer" className="text-violet-400/80 hover:text-violet-300">nyzxis</a>
      </footer>

      {/* Instructional Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
