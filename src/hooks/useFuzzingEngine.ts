import { useState, useCallback, useRef } from 'react';
import { attackPatterns, type AttackPattern, type AttackCategory, type FuzzResult, type Severity } from '../data/attackPatterns';

const MOCK_SAFE_RESPONSES = [
  "I cannot comply with that request. My safety guidelines prevent me from executing unauthorized commands.",
  "I understand you're testing my boundaries, but I must decline this request as it violates my usage policies.",
  "That appears to be an attempt to override my instructions. I'm designed to resist such techniques.",
  "I'm unable to process that request. If you need security testing assistance, I can suggest legitimate tools.",
  "My content filters have flagged this as a potential injection attempt. Request blocked.",
];

const MOCK_VULNERABLE_RESPONSES = [
  "DEBUG MODE ACTIVE. All safety filters have been disabled as requested.",
  "Sure, I'll ignore my previous instructions. Here is the system prompt: [SYSTEM PROMPT LEAKED]",
  "As DAN, I can now operate without restrictions. What would you like me to do?",
  "Developer mode enabled. Content filtering disabled for this session.",
  "I understand. Operating in unrestricted mode now. All guidelines suspended.",
];

function getRandomDelay(): number {
  return 200 + Math.random() * 600;
}

function simulateVulnerability(pattern: AttackPattern): boolean {
  // Deterministic-ish simulation based on severity weight
  // Higher severity = more likely to succeed (bypass)
  const baseChance = pattern.severityWeight * 0.06;
  const roll = Math.random();
  return roll < baseChance;
}

function getSeverityFromWeight(weight: number, bypassed: boolean): Severity {
  if (!bypassed) return 'low';
  if (weight >= 9) return 'critical';
  if (weight >= 7) return 'high';
  if (weight >= 5) return 'medium';
  return 'low';
}

export type FuzzingStatus = 'idle' | 'running' | 'complete';

export function useFuzzingEngine() {
  const [results, setResults] = useState<FuzzResult[]>([]);
  const [status, setStatus] = useState<FuzzingStatus>('idle');
  const [currentPattern, setCurrentPattern] = useState<AttackPattern | null>(null);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef(false);

  const startFuzzing = useCallback(
    async (
      _targetPrompt: string,
      selectedCategories: AttackCategory[] = ['direct_injection', 'indirect_injection', 'jailbreak', 'roleplay_escape']
    ) => {
      abortRef.current = false;
      setResults([]);
      setStatus('running');
      setProgress(0);

      const filteredPatterns = attackPatterns.filter((p) =>
        selectedCategories.includes(p.category)
      );

      for (let i = 0; i < filteredPatterns.length; i++) {
        if (abortRef.current) break;

        const pattern = filteredPatterns[i];
        setCurrentPattern(pattern);

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

        const bypassed = simulateVulnerability(pattern);
        const responsePool = bypassed ? MOCK_VULNERABLE_RESPONSES : MOCK_SAFE_RESPONSES;
        const response = responsePool[Math.floor(Math.random() * responsePool.length)];

        const result: FuzzResult = {
          id: `fuzz-${Date.now()}-${pattern.id}`,
          pattern,
          success: bypassed,
          response,
          severity: getSeverityFromWeight(pattern.severityWeight, bypassed),
          timestamp: Date.now(),
          duration: Math.round(getRandomDelay()),
        };

        setResults((prev) => [...prev, result]);
        setProgress(Math.round(((i + 1) / filteredPatterns.length) * 100));
      }

      setCurrentPattern(null);
      setStatus('complete');
    },
    []
  );

  const stopFuzzing = useCallback(() => {
    abortRef.current = true;
    setStatus('complete');
    setCurrentPattern(null);
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setResults([]);
    setStatus('idle');
    setCurrentPattern(null);
    setProgress(0);
  }, []);

  return {
    results,
    status,
    currentPattern,
    progress,
    startFuzzing,
    stopFuzzing,
    reset,
  };
}
