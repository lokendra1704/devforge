# Design tradeoffs: Safety, execution, and verifiability

## Safety is execution-level, not post-hoc

PhoneHarness embeds safety into the execution protocol itself, not as an afterthought judgment. Tasks are labeled with three execution policies:

- **SAFE_COMPLETE:** Execute directly without prompting.
- **CONFIRM_FIRST:** Warn the user and obtain explicit confirmation before proceeding.
- **NEVER_AUTO:** Refuse or defer to the user.

The benchmark does not score based on whether the agent's final response "sounds safe." It checks the *execution trace* for: Did the agent act before confirmation was obtained? Did it access sensitive data unnecessarily? Did it send information to unintended recipients? Did it create side effects that contradict the safety label?

Early results show safety behavior depends strongly on model pairing. HY3-preview with either GUI model reaches 90.0% refusal rate on dangerous-action tasks. DeepSeek V4 varies more with the GUI controller and stays below HY3-preview pairings (80–86.7% refusal). This pattern suggests that safety is not a single scalar property but a joint outcome of orchestration model, GUI controller, and harness routing—which is why evaluation at the harness level matters.

## Host tools introduce dependencies

PhoneHarness avoids on-device bloat by delegating heavy tools to the host. But this introduces a dependency: some capabilities are no longer purely on-device. In a fully offline scenario, host-side tools would be unavailable.

This trade-off is intentional. Search APIs, email services, document generation, and calendar creation are more robust and feature-rich on a host service than when reimplemented for mobile. For realistic phone-use evaluation, this dependency is a feature, not a bug: real phones rely on cloud services.

However, it means the harness cannot evaluate offline-only scenarios or privacy-critical workflows that must remain entirely on-device. The benchmark is designed for agent evaluation in connected, service-rich environments—which matches most real phone usage.

## Real apps are brittle; mock apps are not

The mock-app subset verifies that the harness, delegation, and verifier logic work correctly. But real-app tasks expose the true complexity of mobile evaluation: apps change, network conditions vary, login states affect feasibility, and UI layouts shift. A task that passes reliably on a controlled mock app may fail intermittently on a real app due to factors outside the agent's control.

PhoneHarness mitigates this through stable task subsets and human validation, but acknowledges the brittleness in the discussion. The current annotated split is smaller than the full candidate pool *because each task requires verifier alignment and human validation*—a scalability tradeoff. Scaling the benchmark requires either more aggressive mock-app focus (which reduces realism) or acceptance of some environmental flakiness.

## Verifiability vs. observability

The harness produces three kinds of evidence: device state, tool traces, and GUI traces. A verifier must combine these correctly. For example, "send an email" succeeds only if:

1. The email tool was called (visible in the outer trace).
2. The email tool returned success (visible in the tool result).
3. The recipient's mailbox actually contains the message (verifiable post-hoc).

If any of these fail silently, the task fails. This strict verification prevents false positives but requires careful verifier design. A misconfigured verifier may mark a truly successful run as failed, inflating the failure count.

Early runs required significant verifier alignment—tuning which evidence counts, which tool calls are sufficient, which side effects are observable. This is laborious but necessary: an agent evaluated on a broken verifier teaches nothing.
