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
    <div className="flex h-screen flex-col bg-[#0a0a0f] text-zinc-100 antialiased">
      {/* Top Status Bar */}
      <StatusBar
        status={status}
        results={results}
        progress={progress}
        elapsed={elapsed}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content: Asymmetric Split */}
      <div className="flex min-h-0 flex-1">
        {/* Left Panel: Input + Controls (45%) */}
        <div className="flex w-[45%] flex-col border-r border-violet-500/10">
          <PromptInputPanel
            status={status}
            onStartFuzzing={startFuzzing}
            onStop={stopFuzzing}
            onReset={reset}
          />
        </div>

        {/* Right Panel: Results + Gauge (55%) */}
        <div className="flex w-[55%] flex-col overflow-hidden">
          <FuzzingResultsPanel
            results={results}
            status={status}
            currentPattern={currentPattern}
          />
        </div>
      </div>

      {/* Bottom: Vulnerability Report */}
      <VulnerabilityReport results={results} />

      {/* Instructional Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
