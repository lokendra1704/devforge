import type { Subject } from '../types'
import wildMd from './md/dp-wild.md?raw'
import observerMd from './md/dp-observer.md?raw'
import strategyMd from './md/dp-strategy.md?raw'
import catalogMd from './md/dp-catalog.md?raw'

export const patterns: Subject = {
  id: 'patterns',
  title: 'Design Patterns',
  tagline: 'Observer, Strategy, Factory & friends — learned from products you already use.',
  icon: '🧱',
  accent: '#a78bfa',
  modules: [
    {
      id: 'dp-m1',
      title: 'Seeing Patterns',
      description: 'You already use them daily. Learn to name them — and when to refuse them.',
      lessons: [
        {
          id: 'dp-wild',
          title: 'Patterns in the wild',
          minutes: 10,
          xp: 50,
          steps: [
            { kind: 'read', title: 'The catalog, via real products', markdown: wildMd },
            {
              kind: 'quiz',
              title: 'Spot the pattern',
              questions: [
                {
                  prompt:
                    'Your app must export reports as PDF, CSV, or Excel. The export flow is identical; only the file-writing differs. Which pattern?',
                  options: ['Singleton', 'Strategy', 'Observer', 'Facade'],
                  answer: 1,
                  explanation:
                    'One stable algorithm (gather data → format → write) with a swappable step (the writer) is the Strategy signature. Each format becomes an object behind one interface; adding PowerPoint later touches zero existing code.',
                },
                {
                  prompt:
                    'A legacy shipping API expects XML with weights in pounds; your modern system speaks JSON in kilograms. You cannot modify either side. Which pattern?',
                  options: ['Decorator', 'Factory', 'Adapter', 'Strategy'],
                  answer: 2,
                  explanation:
                    'Two incompatible interfaces, neither changeable, needing a translator in the middle — that is the Adapter, your USB-C dongle in code form. (A Decorator wraps the SAME interface to add behavior; an Adapter converts BETWEEN interfaces.)',
                },
                {
                  prompt:
                    'A teammate proposes an AbstractNotificationStrategyFactory for an app that sends exactly one kind of email and has no plans for more. What is the senior response?',
                  options: [
                    'Approve — patterns future-proof the codebase',
                    'Reject — a pattern must earn its complexity with variation that actually exists; this is overengineering',
                    'Approve, but require unit tests for the factory',
                    'Suggest Singleton instead of Factory',
                  ],
                  answer: 1,
                  explanation:
                    'Patterns are painkillers, not vitamins. Indirection without present (or concretely expected) variation is pure cost: more files, more hops to read, nothing gained. Knowing when NOT to apply a pattern is graded as heavily as knowing how.',
                },
                {
                  prompt:
                    "A Vehicle superclass gains a navigate() method (turn-by-turn GPS), inherited by every subclass. Bicycle extends Vehicle — but a bicycle has no engine or screen for GPS. What's the SimUDuck-style fix?",
                  options: [
                    'Override navigate() to do nothing in Bicycle, and repeat that override in every future vehicle type that has no GPS',
                    'Pull navigate() into a NavigationBehavior interface with per-variant implementations (encapsulate what varies); give Vehicle a navigationBehavior field typed to that interface (program to an interface) so each vehicle is composed with the behavior it needs',
                    'Delete Vehicle and give every vehicle type its own unrelated class',
                    'Make navigate() abstract so every subclass is forced to write its own GPS code',
                  ],
                  answer: 1,
                  explanation:
                    "This is fly() on the Duck superclass with the serial numbers filed off: a behavior that varies per subtype was hoisted into the shared superclass, so every subclass inherits it whether or not it fits. Pull it into its own interface family (encapsulate what varies) and give Vehicle a field typed to that interface (program to an interface) — a Bicycle gets NoNavigation, a Car gets GpsNavigation, zero overrides needed.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'dp-m2',
      title: 'Build the Big Two',
      description: 'Observer and Strategy — the patterns you will use weekly, forever.',
      lessons: [
        {
          id: 'dp-observer',
          title: 'Observer: build your own EventEmitter',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'Decoupling via events', markdown: observerMd },
            {
              kind: 'code',
              title: 'Implement EventEmitter',
              challenge: {
                prompt: `## Implement EventEmitter

Build the engine behind Node.js events and every pub/sub system:

- \`on(event, fn)\` → subscribe; returns an **unsubscribe function**
- \`off(event, fn)\` → remove that listener
- \`emit(event, ...args)\` → invoke all listeners for \`event\` with \`args\`; return the number invoked (0 if none — never crash)
- \`once(event, fn)\` → runs a single time, then auto-removes

**Trap the tests check:** \`once\` must unsubscribe **before** invoking the handler — otherwise a handler that emits its own event recurses forever.`,
                starterCode: `class EventEmitter {
  constructor() {
    this.listeners = new Map(); // event -> array of fns
  }

  on(event, fn) {
    // register; return () => this.off(event, fn)

  }

  off(event, fn) {

  }

  emit(event, ...args) {
    // call each listener with args; return count (0 if no listeners)

  }

  once(event, fn) {
    // hint: wrap fn; the wrapper unsubscribes itself FIRST, then calls fn

  }
}`,
                solution: `class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    const fns = this.listeners.get(event);
    if (!fns) return;
    const i = fns.indexOf(fn);
    if (i !== -1) fns.splice(i, 1);
  }

  emit(event, ...args) {
    const fns = this.listeners.get(event);
    if (!fns || fns.length === 0) return 0;
    const snapshot = [...fns]; // listeners may unsubscribe mid-emit
    for (const fn of snapshot) fn(...args);
    return snapshot.length;
  }

  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper); // remove FIRST: re-entrant emits stay safe
      fn(...args);
    };
    this.on(event, wrapper);
  }
}`,
                tests: `test('on + emit delivers the payload', () => {
  const e = new EventEmitter();
  let got = null;
  e.on('order:placed', (o) => { got = o; });
  e.emit('order:placed', { id: 42 });
  assertEqual(got, { id: 42 });
});
test('multiple listeners all fire; emit returns the count', () => {
  const e = new EventEmitter();
  let count = 0;
  e.on('ping', () => count++);
  e.on('ping', () => count++);
  assertEqual(e.emit('ping'), 2);
  assertEqual(count, 2);
});
test('emitting with no listeners returns 0 and does not crash', () => {
  const e = new EventEmitter();
  assertEqual(e.emit('ghost-event'), 0);
});
test('off removes a listener', () => {
  const e = new EventEmitter();
  let count = 0;
  const fn = () => count++;
  e.on('ping', fn);
  e.off('ping', fn);
  e.emit('ping');
  assertEqual(count, 0);
});
test('on returns a working unsubscribe function', () => {
  const e = new EventEmitter();
  let count = 0;
  const unsub = e.on('ping', () => count++);
  e.emit('ping');
  unsub();
  e.emit('ping');
  assertEqual(count, 1);
});
test('once fires exactly one time', () => {
  const e = new EventEmitter();
  let count = 0;
  e.once('boot', () => count++);
  e.emit('boot');
  e.emit('boot');
  assertEqual(count, 1);
});
test('once handler that re-emits its own event must not recurse forever', () => {
  const e = new EventEmitter();
  let count = 0;
  e.once('tick', () => { count++; e.emit('tick'); });
  e.emit('tick');
  assertEqual(count, 1);
});
test('emit passes multiple arguments', () => {
  const e = new EventEmitter();
  let got = null;
  e.on('sum', (a, b, c) => { got = a + b + c; });
  e.emit('sum', 1, 2, 3);
  assertEqual(got, 6);
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'Loose coupling, checked',
              questions: [
                {
                  prompt:
                    "Given the order service from this lesson — events.emit('order:placed', order) with emailService, loyaltyService, and analytics all listening via events.on(...) — which of the following is NOT true?",
                  options: [
                    "events.emit has no idea how many listeners exist for 'order:placed', or what they do",
                    "A new team can add SMS notifications by calling events.on('order:placed', ...) without editing placeOrder",
                    "The events emitter would work identically if wired to a totally different event name like 'user:signed_up'",
                    'events.emit must import and reference emailService, loyaltyService, and analytics so it can call update() on each',
                  ],
                  answer: 3,
                  explanation:
                    "Option 4 is the tight-coupling version this lesson replaced. The subject (events) only knows observers implement update() (in JS: 'is a function') — it never imports or names emailService, loyaltyService, or analytics. The other three are exactly the loose-coupling guarantees from 'The Power of Loose Coupling'.",
                },
                {
                  prompt:
                    "In the EventEmitter you're about to build, emit() calls each listener with fn(...args) inside a for loop — no try/catch. events.on('order:placed', () => analytics.track(order)) is registered AFTER the email and loyalty listeners. If analytics.track throws, what happens?",
                  options: [
                    'Nothing — EventEmitter catches errors per-listener automatically, so emailService and loyaltyService already ran fine and placeOrder continues normally',
                    'The exception propagates out of emit() and into placeOrder() — even though emailService and loyaltyService ran successfully first, an unrelated analytics bug can now crash (or abort) the order flow',
                    'Only the analytics listener is skipped; emit() logs the error and returns the count of successful listeners',
                    'EventEmitter automatically retries the failing listener up to 3 times before giving up',
                  ],
                  answer: 1,
                  explanation:
                    "This is loose coupling breaking down at the implementation level: emailService and loyaltyService — which have nothing to do with analytics — already did their job, but a throw inside analytics.track() unwinds the for loop and the emit() call itself, landing back in placeOrder() as an uncaught exception. 'The subject doesn't know or care about observers' doesn't protect the subject's own call stack from one observer's bug. (Real EventEmitters often wrap each listener call in try/catch — or emit an 'error' event — for exactly this reason.)",
                },
              ],
            },
          ],
        },
        {
          id: 'dp-strategy',
          title: 'Strategy & Factory: kill the if-else jungle',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'From branches to objects', markdown: strategyMd },
            {
              kind: 'code',
              title: 'Build the fare system',
              challenge: {
                prompt: `## Strategy + Factory: ride fares

Build the pricing system for a ride-hailing app.

**1. Three strategy objects**, each with \`base\`, \`perKm\`, and \`adjust(fare, trip)\`:
- \`economyPricing\` — base 30, 12/km, no adjustment
- \`premiumPricing\` — base 80, 22/km, no adjustment
- \`sharedPricing\` — base 20, 8/km; if \`trip.riders > 1\`, multiply fare by 0.9

**2. The factory** \`pricingFor(rideType)\` mapping \`'economy' | 'premium' | 'shared'\` to its strategy; **throw** on unknown types.

**3. The calculator** \`calculateFare(trip, pricing)\`:
fare = \`adjust(base + km * perKm, trip)\`, then **multiply by \`trip.surge\`** (default 1) — surge lives HERE, once, not inside any strategy. Round to 2 decimals.`,
                starterCode: `const economyPricing = {
  base: 30, perKm: 12,
  adjust: (fare, trip) => fare,
};

const premiumPricing = {
  // ...
};

const sharedPricing = {
  // adjust: 10% off when trip.riders > 1
};

function pricingFor(rideType) {
  // map type -> strategy; throw on unknown
}

function calculateFare(trip, pricing) {
  // adjust(base + km * perKm, trip), then apply trip.surge (default 1)
  // return Math.round(fare * 100) / 100
}`,
                solution: `const economyPricing = {
  base: 30, perKm: 12,
  adjust: (fare, trip) => fare,
};

const premiumPricing = {
  base: 80, perKm: 22,
  adjust: (fare, trip) => fare,
};

const sharedPricing = {
  base: 20, perKm: 8,
  adjust: (fare, trip) => (trip.riders > 1 ? fare * 0.9 : fare),
};

const PRICING = {
  economy: economyPricing,
  premium: premiumPricing,
  shared: sharedPricing,
};

function pricingFor(rideType) {
  const p = PRICING[rideType];
  if (!p) throw new Error('Unknown ride type: ' + rideType);
  return p;
}

function calculateFare(trip, pricing) {
  let fare = pricing.adjust(pricing.base + trip.km * pricing.perKm, trip);
  fare *= trip.surge ?? 1;
  return Math.round(fare * 100) / 100;
}`,
                tests: `test('economy: 10km = 30 + 120', () => {
  assertEqual(calculateFare({ km: 10, riders: 1 }, pricingFor('economy')), 150);
});
test('premium: 5km = 80 + 110', () => {
  assertEqual(calculateFare({ km: 5, riders: 1 }, pricingFor('premium')), 190);
});
test('shared solo rider: no discount', () => {
  assertEqual(calculateFare({ km: 10, riders: 1 }, pricingFor('shared')), 100);
});
test('shared with 2 riders: 10% off', () => {
  assertEqual(calculateFare({ km: 10, riders: 2 }, pricingFor('shared')), 90);
});
test('surge applies uniformly — economy at 1.5x', () => {
  assertEqual(calculateFare({ km: 10, riders: 1, surge: 1.5 }, pricingFor('economy')), 225);
});
test('surge stacks with shared discount (discount first, then surge)', () => {
  assertEqual(calculateFare({ km: 10, riders: 3, surge: 2 }, pricingFor('shared')), 180);
});
test('factory throws on unknown ride type', () => {
  let threw = false;
  try { pricingFor('helicopter'); } catch { threw = true; }
  assertEqual(threw, true);
});
test('adding a strategy without touching the calculator (open/closed)', () => {
  const xlPricing = { base: 100, perKm: 30, adjust: (f) => f };
  assertEqual(calculateFare({ km: 2, riders: 1 }, xlPricing), 160);
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'Which factory?',
              questions: [
                {
                  prompt:
                    "Your app needs loggerFor('console' | 'file' | 'remote') — a single function that takes a string and returns the matching logger object. No subclassing, no families of related objects. Which fits?",
                  options: ['Simple Factory', 'Factory Method', 'Abstract Factory', 'Singleton'],
                  answer: 0,
                  explanation:
                    "One function, type string in, one object out — exactly pricingFor's shape. No subclass is deciding anything, and there's no family of related objects to keep in sync, so Factory Method or Abstract Factory would be pure overhead.",
                },
                {
                  prompt:
                    'A ReportGenerator base class runs a fixed pipeline — fetch data, format, export — but createSection() (one step in that pipeline) differs per report type. SalesReportGenerator and InventoryReportGenerator subclasses each override createSection() to produce their own section objects. Which pattern?',
                  options: ['Simple Factory', 'Factory Method', 'Abstract Factory', 'Decorator'],
                  answer: 1,
                  explanation:
                    "The shared algorithm (fetch → format → export) lives in the base class; only ONE creation step is deferred to subclasses, each of which 'decides' which concrete Section to instantiate. That's the PizzaStore / orderPizza shape — Factory Method.",
                },
                {
                  prompt:
                    'A UI library must render either a complete "light theme" family (LightButton, LightCheckbox, LightSlider) or a complete "dark theme" family (DarkButton, DarkCheckbox, DarkSlider) — and a screen must NEVER mix a LightButton with a DarkSlider. Which pattern?',
                  options: ['Simple Factory', 'Factory Method', 'Abstract Factory', 'Strategy'],
                  answer: 2,
                  explanation:
                    'Multiple related products (Button, Checkbox, Slider) that must come from the SAME family, with mixing forbidden — the ingredient-factory problem: one ThemeFactory interface, LightThemeFactory and DarkThemeFactory implementations, each guaranteed to produce a matching set.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'dp-m3',
      title: 'Pattern Judgment',
      description: 'Real scenarios. Pick the right tool — or no tool at all.',
      lessons: [
        {
          id: 'dp-picker',
          title: 'Pattern picker: real scenarios',
          minutes: 14,
          xp: 90,
          steps: [
            { kind: 'read', title: 'Organizing the pattern catalog', markdown: catalogMd },
            {
              kind: 'quiz',
              title: 'Choose wisely',
              questions: [
                {
                  prompt:
                    'A dashboard shows live stock prices. When a price changes, 14 different widgets must update. Widgets are added by other teams without touching the price feed code.',
                  options: ['Observer', 'Singleton', 'Adapter', 'Template Method'],
                  answer: 0,
                  explanation:
                    'One publisher, many independent subscribers, publisher ignorant of who listens, new subscribers added without modifying the source — the Observer checklist, ticked four for four.',
                },
                {
                  prompt:
                    'Your image pipeline applies optional transforms: watermark, resize, sharpen, compress — in any combination, stacked. Each adds behavior to the result of the previous.',
                  options: ['Factory', 'Decorator', 'Strategy', 'Facade'],
                  answer: 1,
                  explanation:
                    'Stackable wrappers, each adding behavior while preserving the same interface (image in, image out) — Decorator. Strategy would pick ONE algorithm; Decorator layers many. The “in any combination, stacked” phrasing is the giveaway.',
                },
                {
                  prompt:
                    'Starting a video call touches 6 subsystems: camera, mic, codec negotiation, network, UI, notifications. Product wants a single startCall() for app developers.',
                  options: ['Composite', 'Builder', 'Facade', 'Proxy'],
                  answer: 2,
                  explanation:
                    'A single simple front door over multiple complex subsystems, for caller convenience — Facade. Note the contrast with Adapter: nothing is incompatible here, it is purely about simplification.',
                },
                {
                  prompt:
                    'Tests need to replace the real payment gateway with a fake. Production code currently calls new StripeGateway() in 23 places.',
                  options: [
                    'Singleton for the gateway',
                    'Factory (or injected dependency) — centralize creation so one place decides real vs fake',
                    'Observer to record payments',
                    'Decorator around StripeGateway',
                  ],
                  answer: 1,
                  explanation:
                    'Scattered `new` is the disease: creation in 23 places means substitution requires 23 edits. Centralize creation (factory) or inject the instance (DI — the same idea moved to the constructor). Then tests swap one thing.',
                },
                {
                  prompt:
                    'A junior proposes making every service class in the codebase a Singleton “for consistency and easy access”. The actual outcome?',
                  options: [
                    'Cleaner architecture with less wiring',
                    'Hidden global state everywhere: untestable classes, invisible coupling, and concurrency hazards',
                    'Better performance from object reuse',
                    'No significant change either way',
                  ],
                  answer: 1,
                  explanation:
                    'Singleton is the most-abused pattern: it is global state in a trench coat. Every consumer silently couples to it, tests cannot isolate it, and shared mutable state invites races. Use it for genuinely-one things (config, pool); reach for dependency injection otherwise.',
                },
                {
                  prompt:
                    'Your checkout has notification logic: if email then…, if SMS then…, if push then…, if WhatsApp then…. Each branch is ~15 lines and marketing adds a channel every quarter. What is the refactor?',
                  options: [
                    'Extract each branch into a private method of the same class',
                    'Strategy per channel + a factory/registry from channel name to strategy',
                    'A Singleton NotificationManager containing the same if-else',
                    'Leave it — four branches is manageable',
                  ],
                  answer: 1,
                  explanation:
                    'Variation along one axis (channel), arriving regularly (quarterly), with a type tag selecting behavior — the exact Strategy+Factory shape you built last lesson. Private methods tidy the mess but new channels still edit the same class; the registry makes them additive.',
                },
                {
                  prompt:
                    'Your design system needs a complete UI kit per brand — AcmeButton/AcmeInput/AcmeCard for one client, GlobexButton/GlobexInput/GlobexCard for another — and a screen must never mix components from two brands. Separately, a ReportBuilder base class runs one fixed pipeline where only the "render header" step differs between PdfReportBuilder and HtmlReportBuilder subclasses. Which pairing is correct?',
                  options: [
                    'Design system → Factory Method; ReportBuilder → Abstract Factory',
                    'Design system → Abstract Factory; ReportBuilder → Factory Method',
                    'Both are Abstract Factory — any subclass-based creation is Abstract Factory',
                    "Both are Factory Method — any pattern with 'Factory' in the name is interchangeable",
                  ],
                  answer: 1,
                  explanation:
                    "The design system needs a whole MATCHING SET of related products (Button+Input+Card) that must never mix brands — Abstract Factory's signature. ReportBuilder has ONE fixed algorithm with ONE creation step deferred to subclasses — Factory Method's signature. Sharing the word 'Factory' isn't a categorization rule; the shape of the variation is.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
