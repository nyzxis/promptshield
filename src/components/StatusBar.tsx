import { Shield, Lightning, Clock, Target } from '@phosphor-icons/react';
import type { FuzzingStatus } from '../hooks/useFuzzingEngine';
import type { FuzzResult } from '../data/attackPatterns';

interface StatusBarProps {
  status: FuzzingStatus;
  results: FuzzResult[];
  progress: number;
  elapsed: number;
}

export function StatusBar({ status, results, progress, elapsed }: StatusBarProps) {
  const bypassed = results.filter((r) => r.success).length;
  const blocked = results.filter((r) => !r.success).length;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  };

  return (
    <header className="border-b border-violet-500/10 bg-[#0c0c14]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/20 ring-1 ring-violet-500/30">
            <Shield size={20} weight="duotone" className="text-violet-400" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold tracking-tight text-white">
              PromptShield
            </h1>
            <p className="font-mono text-[10px] tracking-wider text-violet-400/60">
              ADVERSARIAL LLM RED-TEAM
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Target size={14} className="text-violet-400" />
            <span className="font-mono">{results.length} attempts</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Lightning size={14} className="text-red-400" />
            <span className="font-mono text-red-400">{bypassed} bypassed</span>
            <span className="text-zinc-600">/</span>
            <span className="font-mono text-emerald-400">{blocked} blocked</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock size={14} className="text-zinc-500" />
            <span className="font-mono">{formatTime(elapsed)}</span>
          </div>

          {/* Status Badge */}
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-medium ${
              status === 'idle'
                ? 'bg-zinc-800 text-zinc-400'
                : status === 'running'
                  ? 'bg-violet-500/15 text-violet-400'
                  : 'bg-emerald-500/15 text-emerald-400'
            }`}
          >
            {status === 'running' && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
            )}
            {status === 'complete' && (
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            )}
            {status === 'idle' && (
              <span className="h-2 w-2 rounded-full bg-zinc-500" />
            )}
            {status.toUpperCase()}
            {status === 'running' && ` ${progress}%`}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {status === 'running' && (
        <div className="h-0.5 w-full bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
}
