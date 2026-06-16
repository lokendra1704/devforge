# The 80% problem

A persistent challenge: AI agents can rapidly generate **about 80%** of the code for a feature, but the remaining 20% — edge cases, error handling, integration points, subtle correctness requirements — demands deep contextual knowledge current models often lack.

The nature of AI errors has shifted from simple syntax mistakes to **insidious conceptual failures**: wrong assumptions about business logic, failure to seek clarification on ambiguous requirements, missing edge cases, architectural decisions that create subtle long-term maintenance burdens. These are harder to catch precisely *because* the code "looks right" and may even pass basic tests.

> The developers who navigate this most effectively use AI for what it's good at (rapid implementation of well-specified tasks) while reserving their own attention for what AI struggles with (ambiguous requirements, architectural trade-offs, correctness verification). They don't try to be faster by accepting everything the AI produces — they try to be faster by focusing their expertise where it matters most.

This is the practical link back to conductor/orchestrator: the right mode for a task depends on which side of the 80% line that task sits on.
