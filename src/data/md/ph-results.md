# Results: Mixed-action routing drives agent reliability

## Overall pass rates by task type

The headline finding: mixed-action routing improves reliability. On the annotated evaluation split, PhoneHarness reaches 75.0% pass rate, improving over the strongest baseline (MobileClaw, Seed2.0-Pro) by 12.9 percentage points.

| Task Type | AutoGLM-Phone | Seed2.0-Pro | MobileClaw | PhoneHarness |
|---|---|---|---|---|
| **Overall** | 37.1% | 62.1% | 62.1% | **75.0%** |
| Device/system | 43.3% | 83.3% | 93.3% | **96.7%** |
| Single-app GUI | 43.3% | 76.7% | 63.3% | 63.3% |
| Tool-assisted | 20.0% | 28.6% | 48.6% | **74.3%** |
| Cross-app | 44.8% | 65.5% | 44.8% | 65.5% |

**The pattern is informative, not uniform:** PhoneHarness is strongest on device/system operations (96.7%) and tool-assisted workflows (74.3%), where deterministic CLI, MCP tools, and side-effect verification dominate. It ties or underperforms on pure GUI tasks—Seed2.0-Pro reaches 76.7% on single-app GUI while PhoneHarness reaches 63.3%. This shows the gain comes from mixed execution and side-effect completion, not from simply being a better GUI clicker.

## Action-space breakdown: gains concentrate where CLI and tools matter

The gains become concrete when we break down by action affordance:

| Setting | AutoGLM-Phone | Seed2.0-Pro | MobileClaw | PhoneHarness |
|---|---|---|---|---|
| **GUI or CLI alternative** | 42.4% | 81.8% | 87.9% | **97.0%** |
| **GUI-primary + optional CLI** | 16.2% | 24.3% | 43.2% | **67.6%** |

When GUI and CLI are alternative routes for the same task, PhoneHarness reaches 97.0%. On GUI-primary tasks where command-line operations provide auxiliary support, it reaches 67.6%. The benefit is not that PhoneHarness has a stronger GUI controller—many wins come from email, file download, device-state queries, chart generation, and other workflows with reliable CLI or MCP paths.

## Execution efficiency

PhoneHarness achieves higher success without spending more actions. The rounded mean is 23 execution steps per attempted task, slightly below Seed2.0-Pro's 24 and below MobileClaw.

| Task Type | Seed2.0-Pro | MobileClaw | PhoneHarness |
|---|---|---|---|
| **Overall steps** | 24 | 28 | **23** |
| Device/system | 15 | 13 | **8** |
| Tool-assisted | 30 | 33 | **25** |

On device/system operations and tool-assisted workflows, PhoneHarness uses deterministic paths to avoid long GUI exploration. On cross-app workflows, Seed2.0-Pro ties PhoneHarness in pass rate while using fewer steps—some GUI-heavy multi-app tasks still favor a specialized phone-use model. The advantage is concentrated where routing and verification matter most.

## Failure modes

Remaining failures cluster in three categories:

1. **Brittle GUI-heavy scenarios:** Long single-app navigation, cross-app copy/paste, login/permission gates, advertisements, timeouts.
2. **Tool knowledge gaps:** Missing knowledge of available tools or incorrect parameter formation.
3. **Verification mismatches:** A tool was called but the phone-side side effect was not verified or the verifier could not detect it.

These patterns point to the next bottleneck: phone agents must improve GUI robustness in high-friction scenarios, deepen tool knowledge, and ensure that every action leaves verifiable evidence.
