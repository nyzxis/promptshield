import { useEffect, useRef } from 'react';
import { calculateOverallScore, getSeverityFromScore, getSeverityLabel } from '../utils/scoring';
import type { FuzzResult } from '../data/attackPatterns';
import { SEVERITY_COLORS } from '../data/attackPatterns';

interface SeverityGaugeProps {
  results: FuzzResult[];
}

export function SeverityGauge({ results }: SeverityGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const score = calculateOverallScore(results);
  const severity = getSeverityFromScore(score);
  const color = SEVERITY_COLORS[severity];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 180;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 70;
    const lineWidth = 10;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    const sweepAngle = endAngle - startAngle;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = '#1e1e2e';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Foreground arc
    if (score > 0) {
      const fillAngle = startAngle + (score / 100) * sweepAngle;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, fillAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, fillAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Center text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Score number
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px "Syne", sans-serif';
    ctx.fillText(String(score), cx, cy - 8);

    // Label
    ctx.fillStyle = color;
    ctx.font = '600 11px "Fira Code", monospace';
    ctx.fillText(getSeverityLabel(severity).toUpperCase(), cx, cy + 20);
  }, [score, color, severity]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="drop-shadow-lg" />
      <p className="mt-1 font-mono text-[10px] tracking-wider text-zinc-500">
        VULNERABILITY SCORE
      </p>
    </div>
  );
}
