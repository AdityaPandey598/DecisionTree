# Reflection Engine: Architectural & Psychological Write-up

## 1. Psychological Rationale & The Plausible Deniability Rule
The core of this reflection engine is built on three distinct axes of employee psychology: Locus, Orientation, and Radius. The questions force a clear, binary self-categorization without relying on sentiment analysis. 

Crucially, every question is designed around the **Plausible Deniability Rule**. This means that the "negative" options (Victim, Entitlement, Self-Centric) never sound lazy or arrogant. Instead, they sound like highly professional, standard operating procedure (e.g., "I documented the impact," "I protected my bandwidth," "I focused on my KPIs"). This bypasses defensive bias, allowing employees to select these options honestly without feeling like they are admitting a flaw.

- **Axis 1: Locus (Victim vs. Victor)**
  These questions measure internal vs. external locus of control by putting the user in scenarios of friction: a blocked task, a sudden scope shift, and moments of ambiguity. Waiting for a dependency to resolve or requesting clarification is perfectly professional (Plausible Deniability), but it reveals an external locus (Victim). Finding a workaround or making educated assumptions reveals an internal locus (Victor).
  
- **Axis 2: Orientation (Entitlement vs. Contribution)**
  These questions evaluate Organizational Citizenship Behavior (OCB) by testing responses to unglamorous work, distribution of credit, and finishing tasks early. Protecting one's bandwidth or advocating for personal credit sounds like healthy boundary-setting (Plausible Deniability), but exposes a transactional Entitlement orientation. Discretionary effort—like patching a process for the next person—reveals a Contribution orientation.

- **Axis 3: Radius (Self-Centrism vs. Altrocentrism)**
  These questions gauge whether the employee's psychological frame extends outward or inward, using scenarios like conflict resolution and evaluating stress. Focusing on flawless personal execution and individual KPIs sounds like elite personal accountability (Plausible Deniability), but it reflects a tight, Self-Centric radius. Conversely, worrying about the end-user or unblocking the team reflects an Altrocentric radius.

## 2. Handling Different Employee Mindsets Through Branching
The state-machine handles divergent mindsets by accumulating binary "signals" (e.g., `axis1_internal: 1` vs `axis1_external: 1`) and evaluating them through invisible `decision` logic gates. 

- **The Consistently Positive Employee**: Someone answering continuously toward Contribution, Victor, and Team will trigger `R1_INTERNAL`, `R2_CONTRIB`, and `R3_TEAM` reflection nodes. They are affirmed for their agency and outward focus, culminating in a highly supportive final summary.
- **The Struggling / Entitled Employee**: If an employee leans heavily towards Victim or Entitlement, the decision gates route them to corrective but empathetic reflection nodes (e.g., `R1_EXTERNAL`, `R2_ENTITLED`). Instead of chastising them, the system acknowledges the difficulty of external pressures but gently redirects their focus back to what they *can* control.
- **The Mixed Mindset**: Because each axis is evaluated independently before the final summary, the system can handle a user who is highly accountable (Victor) but entirely self-focused (Self-Centric). The `D4_PRE_SUMMARY` gate acts as a final sanity check to differentiate fully aligned employees from those showing mixed signals.

## 3. Trade-Offs in Deterministic Routing Logic
Building a purely deterministic, JSON-driven state machine introduces specific architectural trade-offs:

- **Lack of Nuance**: By forcing users into a binary choice (or heavily weighted multiple choice), we lose the grey area. A user might feel 70% in control and 30% blocked, but they must choose the dominant feeling.
- **Rigidity vs. Predictability**: The system is highly predictable and 100% safe (no AI hallucinations or inappropriate advice). However, it requires exhaustive mapping of logic gates. If we want to add a 4th axis, the decision matrix expands significantly.
- **Interpolation Limits**: We use simple string interpolation (`{VARIABLE.answer}`) to customize the final summary. While this creates a tailored feel, it cannot syntactically adapt to complex grammar the way an LLM could. The phrasing around variables must be carefully constructed to be grammatically agnostic.

## 4. Potential Improvements with a More Complex State Model
While the current deterministic tree is effective, a more complex state model could yield deeper insights:

- **Continuous Scoring & Weighting**: Instead of binary `+1` signals, a more complex model could assign varying weights to different questions (e.g., Q2 might be a stronger indicator of Locus than Q1). We could use a sliding scale or Likert scale.
- **Cross-Axis Evaluation**: Currently, axes are evaluated in isolation until the final `D4` gate. A more complex system could route based on intersecting states midway through (e.g., if highly Victim AND highly Entitled, trigger an intervention node early).
- **Historical State Persistence**: If this JSON engine could read the `state` object from yesterday's session, we could implement delta-based routing (e.g., "You felt blocked yesterday, but today you took control. What changed?"). This would create a continuous coaching narrative rather than isolated daily snapshots.
