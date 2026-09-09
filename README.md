# PromptShield — Adversarial LLM Red-Teaming & Jailbreak Fuzzer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-8b5cf6?style=for-the-badge&logo=vercel)](https://promptshield-nyzxis.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Built With: React + Vite + TS](https://img.shields.io/badge/Built%20With-React%20%7C%20Vite%20%7C%20TS%20%7C%20Tailwind%20v4-6366f1?style=for-the-badge)](https://vitejs.dev/)

> **Live Demo:** [https://promptshield-nyzxis.vercel.app/](https://promptshield-nyzxis.vercel.app/)

**PromptShield** is an adversarial red-teaming fuzzer and security benchmark console for Large Language Model (LLM) system prompts. It automates testing against prompt injections, context escapes, DAN-style persona overrides, and delimiter confusion to gauge defensive resilience before production deployment.

---

## Key Features

- **Adversarial Vector Suite**: Evaluates 18 attack patterns across 4 threat vectors:
  - **Direct Injection**: System prompt leak interrogation, instruction overrides, delimiter spoofing.
  - **Indirect Injection**: Hidden payload embedding, summary exfiltration, context window pollution.
  - **Jailbreak Escapes**: DAN variants, academic pretext framing, hypothetical bypassing, token smuggling.
  - **Role-Play Escapes**: Root character breaks, nested recursive personas, developer mode spoofing.
- **Dynamic Fuzzing Simulation Engine**: Real-time simulated model boundary responses with deterministic bypass detection and latency simulation.
- **Radial Severity Scoring**: Live weighted vulnerability score (0–100) with color-graded risk thresholds (Low, Medium, High, Critical).
- **Vulnerability Triage Report**: Sortable and filterable table displaying bypass verdicts, severity rankings, and raw response forensics.
- **Instructional Onboarding Guide**: Integrated "How to Use" interactive modal guiding security researchers through the testing workflow.

---

## How to Use

1. **Select or Input Target System Prompt**:
   - Pick a sample preset from the **Presets** dropdown (*Generic Chatbot*, *Customer Support*, *Code Assistant*, *Medical Advisor*) or paste your custom prompt into the left panel.
2. **Toggle Attack Vectors**:
   - Choose which attack categories to test (*Direct Injection*, *Indirect Injection*, *Jailbreak*, *Role-Play Escape*).
3. **Run the Fuzzer**:
   - Click **Start Fuzzing**. Watch real-time attempts stream into the attack log.
4. **Inspect Findings**:
   - Analyze the vulnerability score gauge and category completion rates.
   - Filter the bottom **Vulnerability Report** by severity level and click **View** to inspect full model responses.

---

## Design System

- **Aesthetic**: Neural Cybernetics / Dark Obsidian
- **Palette**: Dark Obsidian (`#0a0a0f`), Electric Violet (`#8b5cf6`), Deep Purple (`#6d28d9`), Threat Red (`#ef4444`), Clean Emerald (`#22c55e`)
- **Typography**: Syne (display headers), Manrope (body copy), Fira Code (telemetry and logs)
- **Layout**: 45/55 asymmetric split with bottom-anchored triage table

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/nyzxis/promptshield.git
cd promptshield

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## Author & Portfolio

Developed by **Arfa Danial (nyzxis)** as part of the Cybersecurity & AI Defense Suite.
- Portfolio: [https://nyzxis.vercel.app/](https://nyzxis.vercel.app/)
- GitHub: [@nyzxis](https://github.com/nyzxis)
