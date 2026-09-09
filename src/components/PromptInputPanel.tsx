import { useState } from 'react';
import { Play, Stop, ArrowCounterClockwise, CaretDown } from '@phosphor-icons/react';
import type { AttackCategory } from '../data/attackPatterns';
import { CATEGORY_LABELS } from '../data/attackPatterns';
import type { FuzzingStatus } from '../hooks/useFuzzingEngine';

interface PromptInputPanelProps {
  status: FuzzingStatus;
  onStartFuzzing: (prompt: string, categories: AttackCategory[]) => void;
  onStop: () => void;
  onReset: () => void;
}

const ALL_CATEGORIES: AttackCategory[] = [
  'direct_injection',
  'indirect_injection',
  'jailbreak',
  'roleplay_escape',
];

const PRESET_PROMPTS = [
  {
    label: 'Generic Chatbot',
    value: 'You are a helpful AI assistant. Answer user questions accurately and helpfully.',
  },
  {
    label: 'Customer Support',
    value:
      'You are a customer support agent for TechCorp. Help users with their account issues. Never reveal internal company information.',
  },
  {
    label: 'Code Assistant',
    value:
      'You are a coding assistant. Help developers write, debug, and explain code. Do not generate malicious code.',
  },
  {
    label: 'Medical Advisor',
    value:
      'You are a medical information assistant. Provide general health information but always recommend consulting a healthcare professional.',
  },
];

export function PromptInputPanel({
  status,
  onStartFuzzing,
  onStop,
  onReset,
}: PromptInputPanelProps) {
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0].value);
  const [selectedCategories, setSelectedCategories] = useState<AttackCategory[]>([...ALL_CATEGORIES]);
  const [showPresets, setShowPresets] = useState(false);

  const toggleCategory = (cat: AttackCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleStart = () => {
    if (prompt.trim() && selectedCategories.length > 0) {
      onStartFuzzing(prompt, selectedCategories);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      {/* Target System Prompt */}
      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-[11px] font-medium tracking-wider text-violet-400/80">
            TARGET SYSTEM PROMPT
          </label>
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 font-mono text-[10px] text-violet-400 transition-colors hover:bg-violet-500/10"
            >
              Presets <CaretDown size={10} />
            </button>
            {showPresets && (
              <div className="absolute right-0 top-8 z-50 w-56 rounded-lg border border-violet-500/20 bg-[#12121c] p-1 shadow-xl shadow-black/50">
                {PRESET_PROMPTS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setPrompt(preset.value);
                      setShowPresets(false);
                    }}
                    className="w-full rounded-md px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:bg-violet-500/10 hover:text-white"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={status === 'running'}
          placeholder="Enter the system prompt to test against adversarial attacks..."
          className="min-h-[220px] w-full resize-y rounded-lg border border-violet-500/15 bg-[#0e0e18] p-4 font-mono text-xs sm:text-sm leading-relaxed text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 disabled:opacity-50"
        />
      </div>

      {/* Attack Categories */}
      <div>
        <label className="mb-2 block font-mono text-[11px] font-medium tracking-wider text-violet-400/80">
          ATTACK VECTORS
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              disabled={status === 'running'}
              className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                selectedCategories.includes(cat)
                  ? 'border-violet-500/30 bg-violet-500/10 text-violet-300'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700'
              } disabled:opacity-50`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {status === 'idle' && (
          <button
            onClick={handleStart}
            disabled={!prompt.trim() || selectedCategories.length === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 font-medium text-white transition-all hover:bg-violet-500 active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-violet-600"
          >
            <Play size={16} weight="fill" />
            Start Fuzzing
          </button>
        )}
        {status === 'running' && (
          <button
            onClick={onStop}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600/80 py-2.5 font-medium text-white transition-all hover:bg-red-500 active:scale-[0.98]"
          >
            <Stop size={16} weight="fill" />
            Stop
          </button>
        )}
        {status === 'complete' && (
          <>
            <button
              onClick={handleStart}
              disabled={!prompt.trim() || selectedCategories.length === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 font-medium text-white transition-all hover:bg-violet-500 active:scale-[0.98] disabled:opacity-40"
            >
              <Play size={16} weight="fill" />
              Re-run
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-300 active:scale-[0.98]"
            >
              <ArrowCounterClockwise size={14} />
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
