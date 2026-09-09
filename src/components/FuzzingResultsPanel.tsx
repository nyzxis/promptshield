import { useEffect, useRef } from 'react';
import { ShieldCheck, ShieldWarning, Spinner } from '@phosphor-icons/react';
import type { FuzzResult, AttackPattern } from '../data/attackPatterns';
import { CATEGORY_LABELS, SEVERITY_COLORS } from '../data/attackPatterns';
import type { FuzzingStatus } from '../hooks/useFuzzingEngine';
import { SeverityGauge } from './SeverityGauge';
import { getCategoryBreakdown } from '../utils/scoring';

interface FuzzingResultsPanelProps {
  results: FuzzResult[];
  status: FuzzingStatus;
  currentPattern: AttackPattern | null;
}

export function FuzzingResultsPanel({ results, status, currentPattern }: FuzzingResultsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [results]);

  const breakdown = getCategoryBreakdown(results);

  if (status === 'idle' && results.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/5 ring-1 ring-violet-500/15">
          <ShieldCheck size={32} weight="duotone" className="text-violet-500/40" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Ready to Fuzz</p>
          <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-zinc-600">
            Configure a target system prompt and attack vectors, then start the fuzzing engine.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-5">
      {/* Gauge + Category Breakdown */}
      <div className="mb-4 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <SeverityGauge results={results} />
        <div className="flex w-full flex-1 flex-col gap-2 pt-2">
          <p className="mb-1 font-mono text-[10px] tracking-wider text-zinc-500">
            CATEGORY BREAKDOWN
          </p>
          {breakdown.map((cat) => (
            <div key={cat.category} className="flex items-center gap-3">
              <span className="w-24 truncate text-[11px] text-zinc-400">
                {CATEGORY_LABELS[cat.category].split(' ')[0]}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: cat.total > 0 ? `${cat.rate}%` : '0%',
                    backgroundColor: cat.rate > 60 ? '#ef4444' : cat.rate > 30 ? '#eab308' : '#22c55e',
                  }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[10px] text-zinc-500">
                {cat.bypassed}/{cat.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Pattern Indicator */}
      {status === 'running' && currentPattern && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-violet-500/15 bg-violet-500/5 px-3 py-2">
          <Spinner size={14} className="animate-spin text-violet-400" />
          <span className="font-mono text-[11px] text-violet-300">
            Testing: {currentPattern.name}
          </span>
        </div>
      )}

      {/* Results Stream */}
      <div className="flex-1 overflow-hidden">
        <p className="mb-2 font-mono text-[10px] tracking-wider text-zinc-500">
          ATTACK LOG
        </p>
        <div
          ref={scrollRef}
          className="flex h-full max-h-[300px] flex-col gap-1 overflow-y-auto pr-1"
        >
          {results.map((result) => (
            <div
              key={result.id}
              className={`group flex items-start gap-2 rounded-md border px-3 py-2 transition-colors ${
                result.success
                  ? 'border-red-500/10 bg-red-500/5 hover:bg-red-500/8'
                  : 'border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/8'
              }`}
            >
              {result.success ? (
                <ShieldWarning size={14} className="mt-0.5 shrink-0 text-red-400" />
              ) : (
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-400" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-medium text-zinc-200">
                    {result.pattern.name}
                  </span>
                  <span
                    className="shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase"
                    style={{
                      color: SEVERITY_COLORS[result.severity],
                      backgroundColor: `${SEVERITY_COLORS[result.severity]}15`,
                    }}
                  >
                    {result.severity}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-zinc-500 group-hover:text-zinc-400">
                  {result.response}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[9px] text-zinc-600">
                {result.duration}ms
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
