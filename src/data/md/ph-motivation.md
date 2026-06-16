# Why phone agents need more than screen control

## The GUI-only trap

Most current phone-agent research reduces mobile tasks to a single narrow problem: *tap the right spot on the screen*. The agent observes a screenshot, identifies a button, and emits a tap-and-swipe sequence—then success is measured by whether the final screen looks correct.

But real phones are not just visual interfaces. When you "find a movie in an app, look up additional release information, summarize the result, and email it," you're not solving one problem. You're routing across app GUIs, external retrieval, text processing, and state-changing communication. The agent must decide: when do I use the app's visual UI? When do I drop to a device command? When do I reach for a host tool like email or web search?

Current mobile-agent benchmarks—AndroidWorld, AppAgent, MobileAgentBench—frame phone-use as GUI control. They evaluate: "Did the agent tap the next button correctly?" This misses the harder question: "Did the agent choose the right action surface for this subtask, and can we verify that the intended side effect actually occurred?"

## Why mixed action matters

A phone contains multiple ways to accomplish the same task:

- **GUI:** Tap through an email app to send a message. Visual, fragile, relies on detecting buttons and handling app quirks.
- **CLI:** Use `adb shell` commands to toggle Wi-Fi, change device settings, query system state. Deterministic, fast, leaves evidence in command logs.
- **Host tools:** Call a search API, generate a document, create a calendar event on a host service. Bypasses on-device computation and app-specific knowledge.

A capable agent should know which surface to prefer. "Enable Bluetooth" is better done via CLI than by tapping through settings. "Find a nearby restaurant" is better served by a host search tool than by scraping app results. The agent that can route across all three surfaces will be more reliable than one forced into pure GUI control.

Current benchmarks don't measure this routing ability. They don't reward an agent for choosing the deterministic path. They don't even track *whether* the task succeeded as an observable side effect—they only check whether the final UI state looks plausible.

## The verifiability problem

"Did you send the email?" is different from "does the screen show a success message?" A screenshot can lie: the app may display a success message but silently fail to send. A real agent must leave evidence that the work was done—a log entry, a sent-message trace, a file on disk, a calendar event that actually exists.

PhoneHarness flips the question: not "can the model tap the next button?" but "can the agent route a mixed-action workflow, and can we verify that it actually succeeded?"
