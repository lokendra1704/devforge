# Where ClawGUI admits it doesn't have the answer yet

Section 5 isn't a victory lap — it's a list of things ClawGUI doesn't solve yet. Four open problems, in the paper's own words:

**A unified GUI-CLI harness.** ClawGUI-Agent hybridizes CLI and GUI control, but CLI and GUI agents have "grown as two parallel ecosystems with almost no shared infrastructure." The paper calls itself only "an early step toward a shared harness standard."

**Scaling RL beyond emulators.** Training today happens almost entirely in sandboxes that "drift from real app behavior and cannot cover the authenticated long tail of commercial applications." Two unproven fixes are floated: code-generated mock apps (authentication-free, but not yet validated at scale) and on-device RL with privacy-preserving trajectory collection. The paper's own hedge: **"Scaling online RL is now as much a systems problem as an algorithmic one."**

**Always-present, on-device system agents.** The long-term vision is a persistent local intelligence, not a service invoked on demand. ClawGUI-Agent's hybrid control and memory system are "early instances of this pattern," but the full vision needs OS-level integration, on-device policy training, and privacy guarantees "the community has yet to establish."

**World models for GUI environments.** Today's agents are purely reactive — screenshot in, action out, no internal model of what happens next. Without that, there's no real planning, just trial-and-error. The paper suggests its own step-level trajectory logs are "a natural substrate" for training such a model — but that model doesn't exist yet.

None of these are solved problems. They're the gap between "a working RL+eval+deploy pipeline" and "a system that plans."
