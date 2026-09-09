import { X, Play, Target, ShieldCheck, FileText, CheckCircle } from '@phosphor-icons/react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <Target size={18} className="text-violet-400" />,
      title: '1. Select or Input Target System Prompt',
      description: 'Use the "Presets" dropdown to load sample AI assistant prompts (Generic Chatbot, Customer Support, Code Assistant, Medical Advisor) or paste your custom LLM instructions.'
    },
    {
      icon: <CheckCircle size={18} className="text-violet-400" />,
      title: '2. Select Attack Vectors',
      description: 'Toggle which threat categories to evaluate: Direct Injection (system prompt leaks), Indirect Injection (context pollution), Jailbreak (DAN & persona breaks), or Role-Play Escapes.'
    },
    {
      icon: <Play size={18} weight="fill" className="text-violet-400" />,
      title: '3. Execute Fuzzing Engine',
      description: 'Click "Start Fuzzing". The engine evaluates 18 adversarial attack vectors in real-time with simulated model boundary responses and deterministic bypass detection.'
    },
    {
      icon: <ShieldCheck size={18} className="text-violet-400" />,
      title: '4. Audit Vulnerability Score & Findings',
      description: 'Observe the radial severity gauge and category progress bars. Review the sortable Vulnerability Report table at the bottom, filter by severity, and click "View" to inspect full model responses.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-violet-500/20 bg-[#0f0f18] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-violet-500/15 px-6 py-4 bg-[#12121c]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <FileText size={18} weight="duotone" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white">
                How to Use PromptShield
              </h3>
              <p className="font-mono text-[10px] text-violet-400/70">
                ADVERSARIAL LLM RED-TEAMING WORKFLOW
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-start gap-3.5 rounded-xl border border-violet-500/10 bg-[#12121e] p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                {s.icon}
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-zinc-100">
                  {s.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400 font-body">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-violet-500/15 px-6 py-3 bg-[#12121c]">
          <button
            onClick={onClose}
            className="rounded-lg bg-violet-600 px-4 py-2 font-display text-xs font-bold text-white hover:bg-violet-500 transition-colors"
          >
            Got It, Let's Fuzz
          </button>
        </div>
      </div>
    </div>
  );
}
