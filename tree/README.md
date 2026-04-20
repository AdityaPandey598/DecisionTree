# Reflection Engine

This repository contains a deterministic, state-machine-based reflection engine designed for tech and knowledge workers. It guides users through three psychological axes (Locus, Orientation, and Radius) to evaluate their mindset at the end of the day.

## Repository Structure

- `/tree/`
  - `reflection-tree.json`: The core data structure. This JSON file contains all the nodes, choices, signal emissions, and logic gates for the reflection engine.
  - `tree-diagram.md`: A Mermaid.js visual flowchart of the `reflection-tree.json` logic.
- `/agent/`
  - Contains the runnable HTML/JS/CSS code that parses the JSON tree and renders the interactive UI.
- `/transcripts/`
  - `persona-1-transcript.md`: A sample run of a highly aligned, accountable employee.
  - `persona-2-transcript.md`: A sample run of an employee struggling with external locus and entitlement.
- `write-up.md`: A 2-page documentation on the psychological rationale behind the questions and the architectural trade-offs of the deterministic routing logic.

## How to Read the Tree
The engine operates on a strict, invisible evaluation logic:
1. **Questions & Signals**: As a user answers questions, their choices emit mathematical signals (e.g., `axis1_internal: 1`).
2. **Logic Gates (Decision Nodes)**: At the end of each axis, an invisible `decision` node evaluates the tally (e.g., `if (axis1_internal > axis1_external) -> GOTO Victor Reflection`).
3. **Interpolation**: The final summary recalls specific answers using template tags (e.g., `{Q1_START.answer}`).

## How to Run the Agent
To experience the reflection engine locally:
1. Open your terminal and navigate to this repository.
2. Start a local HTTP server to prevent CORS issues when fetching the JSON:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to: `http://localhost:8000/agent/index.html`
