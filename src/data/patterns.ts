import type { Subject } from '../types'
import wildMd from './md/dp-wild.md?raw'
import observerMd from './md/dp-observer.md?raw'
import strategyMd from './md/dp-strategy.md?raw'
import factoryMd from './md/dp-factory.md?raw'
import catalogMd from './md/dp-catalog.md?raw'
import decoratorMd from './md/dp-decorator.md?raw'
import singletonMd from './md/dp-singleton.md?raw'
import adapterMd from './md/dp-adapter.md?raw'
import facadeMd from './md/dp-facade.md?raw'
import commandMd from './md/dp-command.md?raw'
import templateMethodMd from './md/dp-template-method.md?raw'

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
      title: 'Build the Workhorses',
      description: 'Observer, Strategy, and Factory — derived the long way, the way the book teaches them.',
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
          title: 'Strategy: derive a pattern from a breaking design',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'Watch SimUDuck break, then fix it', markdown: strategyMd },
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
              title: 'The SimUDuck checkpoint',
              questions: [
                {
                  prompt:
                    'The book asks: which of these is NOT a disadvantage of using inheritance (putting fly()/quack() in the Duck superclass) to provide duck behavior?',
                  options: [
                    'Code is duplicated across subclasses',
                    'Runtime behavior changes are difficult',
                    'It’s hard to gain knowledge of all duck behaviors',
                    'Ducks can’t fly and quack at the same time',
                  ],
                  answer: 3,
                  explanation:
                    'From the p43 exercise. The real disadvantages are duplicated code, hard runtime changes, hard-to-survey behaviors, and changes unintentionally affecting other ducks (flying rubber ducks). "Can’t fly and quack at the same time" is a made-up distractor — nothing about inheritance prevents calling both methods.',
                },
                {
                  prompt:
                    'Using the final SimUDuck design (Duck composes a FlyBehavior typed to an interface), the execs want rocket-powered flying. The senior move is to:',
                  options: [
                    'Add a fly() override to every duck that should use rockets',
                    'Create a FlyRocketPowered class that implements the FlyBehavior interface, and set it on any duck — touching zero existing Duck or behavior code',
                    'Add an if (rocketPowered) branch inside Duck.performFly()',
                    'Make Duck.fly() abstract again so each duck writes its own rocket code',
                  ],
                  answer: 1,
                  explanation:
                    'The book’s own answer (p52): "Create a FlyRocketPowered class that implements the FlyBehavior interface." Because Duck programs to the FlyBehavior interface, a brand-new algorithm slots in via setFlyBehavior() with no edits to Duck or the other behaviors — open for extension, closed for modification.',
                },
                {
                  prompt:
                    'A hunting-supply app has a DuckCall device that should QUACK but is in no way a Duck. How does the SimUDuck design let it reuse the Quack behavior?',
                  options: [
                    'DuckCall extends Duck to inherit quack()',
                    'DuckCall HAS-A QuackBehavior (it composes itself with a Quack object) — reuse without inheritance',
                    'Copy the Quack code into DuckCall',
                    'It can’t — quacking is only available to Duck subclasses',
                  ],
                  answer: 1,
                  explanation:
                    'This is the p61 "HAS-A can be better than IS-A" exercise. Because the quack algorithm lives in its own class behind QuackBehavior, ANY object can compose itself with a Quack — "instead of inheriting their behavior, [objects] get their behavior by being composed with the right behavior object." Favor composition over inheritance.',
                },
              ],
            },
            {
              kind: 'quiz',
              title: 'Spot Strategy in the wild',
              questions: [
                {
                  prompt:
                    'Map the formal definition to SimUDuck: "Strategy defines a family of algorithms, encapsulates each one, and makes them interchangeable." In the duck app, what plays the role of "the client that the algorithm varies independently from"?',
                  options: [
                    'The FlyWithWings class',
                    'The Duck class (via performFly), which holds a FlyBehavior reference and never knows the concrete behavior',
                    'The main() test method',
                    'The FlyBehavior interface itself',
                  ],
                  answer: 1,
                  explanation:
                    'The "family of algorithms" is FlyWithWings/FlyNoWay; the "client" is Duck, which calls flyBehavior.fly() through the interface. The algorithm "varies independently from the client" precisely because Duck is coupled only to FlyBehavior, never to a concrete flying class.',
                },
                {
                  prompt:
                    'Your app must export reports as PDF, CSV, or Excel. The export flow is identical; only the file-writing step differs, and you swap formats per request. Which pattern — and why is it Strategy, not Factory?',
                  options: [
                    'Factory — because you are choosing between types',
                    'Strategy — one stable algorithm with a swappable, interchangeable step (the writer) selected at runtime; Factory only handles who CREATES the writer, not the interchangeable behavior',
                    'Observer — the report notifies the writer',
                    'Singleton — there is one exporter',
                  ],
                  answer: 1,
                  explanation:
                    'A fixed algorithm (gather → format → write) with one interchangeable behavior object is the Strategy signature — each writer is a strategy behind one interface. A factory might *pick* which writer to instantiate, but the pattern that makes the writer swappable is Strategy. The two often pair up (as in this lesson’s fare challenge).',
                },
              ],
            },
          ],
        },
        {
          id: 'dp-factory',
          title: 'Factory: corral the new keyword',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'From the pizza if/else to Factory Method', markdown: factoryMd },
            {
              kind: 'code',
              title: 'Build the PizzaStore (Factory Method)',
              challenge: {
                prompt: `## Factory Method: the franchise PizzaStore

Build the book's pizza framework. The **template** (\`prepare → bake → cut → box\`) lives once in the abstract \`PizzaStore\`; the one varying step — *which* pizza to create — is deferred to subclasses.

**1.** Finish \`PizzaStore.orderPizza(type)\`: call the factory method \`createPizza(type)\`, then \`prepare()\`, \`bake()\`, \`cut()\`, \`box()\` it (in that order), and return it. Leave \`createPizza\` **abstract** (it throws on the base class).

**2.** \`NYPizzaStore.createPizza(type)\`:
- \`'cheese'\` → \`new Pizza('NY Style Cheese Pizza')\`
- \`'veggie'\` → \`new Pizza('NY Style Veggie Pizza')\`
- anything else → **throw**

**3.** \`ChicagoPizzaStore.createPizza(type)\`:
- \`'cheese'\` → \`new Pizza('Chicago Style Deep Dish Cheese Pizza')\`
- \`'veggie'\` → \`new Pizza('Chicago Style Veggie Pizza')\`
- anything else → **throw**

**The point the tests check:** \`orderPizza\` never names a concrete pizza — adding a new region is a new subclass, with zero edits to \`orderPizza\`.`,
                starterCode: `class Pizza {
  constructor(name) { this.name = name; this.steps = []; }
  prepare() { this.steps.push('prepare ' + this.name); }
  bake()    { this.steps.push('bake'); }
  cut()     { this.steps.push('cut'); }
  box()     { this.steps.push('box'); }
}

class PizzaStore {
  // The factory method — abstract. Subclasses MUST implement it.
  createPizza(type) {
    throw new Error('createPizza is abstract: subclass must implement');
  }

  orderPizza(type) {
    // 1. const pizza = this.createPizza(type)
    // 2. prepare(), bake(), cut(), box()
    // 3. return pizza

  }
}

class NYPizzaStore extends PizzaStore {
  // implement createPizza for NY styles; throw on unknown

}

class ChicagoPizzaStore extends PizzaStore {
  // implement createPizza for Chicago styles; throw on unknown

}`,
                solution: `class Pizza {
  constructor(name) { this.name = name; this.steps = []; }
  prepare() { this.steps.push('prepare ' + this.name); }
  bake()    { this.steps.push('bake'); }
  cut()     { this.steps.push('cut'); }
  box()     { this.steps.push('box'); }
}

class PizzaStore {
  createPizza(type) {
    throw new Error('createPizza is abstract: subclass must implement');
  }

  orderPizza(type) {
    const pizza = this.createPizza(type);
    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();
    return pizza;
  }
}

class NYPizzaStore extends PizzaStore {
  createPizza(type) {
    if (type === 'cheese') return new Pizza('NY Style Cheese Pizza');
    if (type === 'veggie') return new Pizza('NY Style Veggie Pizza');
    throw new Error('Unknown pizza: ' + type);
  }
}

class ChicagoPizzaStore extends PizzaStore {
  createPizza(type) {
    if (type === 'cheese') return new Pizza('Chicago Style Deep Dish Cheese Pizza');
    if (type === 'veggie') return new Pizza('Chicago Style Veggie Pizza');
    throw new Error('Unknown pizza: ' + type);
  }
}`,
                tests: `test('NY store makes a NY-style pizza via the inherited orderPizza', () => {
  const ny = new NYPizzaStore();
  assertEqual(ny.orderPizza('cheese').name, 'NY Style Cheese Pizza');
});
test('Chicago store makes a Chicago-style pizza from the SAME orderPizza method', () => {
  const chi = new ChicagoPizzaStore();
  assertEqual(chi.orderPizza('cheese').name, 'Chicago Style Deep Dish Cheese Pizza');
});
test('orderPizza runs the full template in order: prepare, bake, cut, box', () => {
  const pizza = new NYPizzaStore().orderPizza('veggie');
  assertEqual(pizza.steps, ['prepare NY Style Veggie Pizza', 'bake', 'cut', 'box']);
});
test('createPizza is abstract on the base PizzaStore', () => {
  let threw = false;
  try { new PizzaStore().createPizza('cheese'); } catch { threw = true; }
  assertEqual(threw, true);
});
test('ordering from the abstract base store fails — no factory method implemented', () => {
  let threw = false;
  try { new PizzaStore().orderPizza('cheese'); } catch { threw = true; }
  assertEqual(threw, true);
});
test('unknown pizza type throws', () => {
  let threw = false;
  try { new NYPizzaStore().orderPizza('helicopter'); } catch { threw = true; }
  assertEqual(threw, true);
});
test('adding a new region is purely additive (open/closed) — orderPizza is untouched', () => {
  class CaliforniaPizzaStore extends PizzaStore {
    createPizza(type) {
      if (type === 'cheese') return new Pizza('California Style Cheese Pizza');
      throw new Error('Unknown pizza: ' + type);
    }
  }
  const pizza = new CaliforniaPizzaStore().orderPizza('cheese');
  assertEqual(pizza.name, 'California Style Cheese Pizza');
  assertEqual(pizza.steps, ['prepare California Style Cheese Pizza', 'bake', 'cut', 'box']);
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'Counting the cost of new',
              questions: [
                {
                  prompt:
                    'The book’s "very dependent" PizzaStore skips factories and instantiates every pizza with new — 4 NY styles + 4 Chicago styles — directly in its orderPizza method. How many concrete pizza classes does it depend on, and how many after you add 4 California styles?',
                  options: ['4, then 8', '8, then 12', '2, then 3', '8, then 8'],
                  answer: 1,
                  explanation:
                    'The p175 counting exercise: 4 + 4 = 8 concrete dependencies, and every new pizza adds one — so California makes it 12. That growing pile of concrete dependencies is exactly what the factory removes.',
                },
                {
                  prompt:
                    'After applying Factory Method to the pizza store, why does it now satisfy the Dependency Inversion Principle?',
                  options: [
                    'PizzaStore no longer depends on anything at all',
                    'Both PizzaStore (high-level) and the concrete pizzas (low-level) depend on the Pizza abstraction — the arrows that used to point down at concrete classes are inverted',
                    'The pizzas now depend on PizzaStore instead',
                    'There are simply fewer classes overall',
                  ],
                  answer: 1,
                  explanation:
                    'DIP (p177): "Depend upon abstractions." Before, PizzaStore pointed down at 8+ concrete pizzas. After Factory Method, PizzaStore depends only on the abstract Pizza, and each concrete pizza also depends on Pizza — high-level and low-level meet at the same abstraction. That redirection is the "inversion."',
                },
                {
                  prompt:
                    'In the final design, PizzaStore is a Factory Method but PizzaIngredientFactory is an Abstract Factory. What justifies the different choice?',
                  options: [
                    'PizzaStore needs ONE product that varies by region (subclass overrides createPizza → Factory Method); the ingredient factory must produce a whole MATCHING FAMILY — dough + sauce + cheese + … — so the family can’t be mixed (→ Abstract Factory)',
                    'They are interchangeable; the choice was arbitrary',
                    'PizzaStore makes families while ingredient factories make a single product',
                    'Abstract Factory is just a Factory Method that happens to have more subclasses',
                  ],
                  answer: 0,
                  explanation:
                    'p198–199: the shape of the variation picks the pattern. One product varying by subclass → Factory Method. A whole family of related products that must stay consistent (never a NY sauce on a Chicago pizza) → Abstract Factory.',
                },
              ],
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
                    "One function, type string in, one object out — exactly the SimplePizzaFactory / pricingFor shape. No subclass decides anything and there's no family to keep in sync, so Factory Method or Abstract Factory would be pure overhead. (Remember: Simple Factory is an idiom, not a true GoF pattern.)",
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
                {
                  prompt:
                    "The book's interview settles the Factory Method vs Abstract Factory confusion by their mechanism. What's the core difference in HOW they create objects?",
                  options: [
                    'Factory Method uses object composition; Abstract Factory uses inheritance',
                    'Factory Method uses inheritance — a subclass overrides one factory method; Abstract Factory uses object composition — you pass in a factory object that makes a whole family',
                    'They are identical; the names are interchangeable',
                    'Factory Method makes families of products; Abstract Factory makes exactly one',
                  ],
                  answer: 1,
                  explanation:
                    'p197: "I do it through inheritance" (Factory Method — extend a class, implement the factory method) vs. "I do it through object composition" (Abstract Factory — instantiate a factory and pass it into code written against the abstract type). The methods of an Abstract Factory are often themselves implemented as factory methods.',
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
          minutes: 18,
          xp: 110,
          steps: [
            { kind: 'read', title: 'What a pattern is — and when not to use one', markdown: catalogMd },
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
            {
              kind: 'quiz',
              title: 'Catalog & judgment (book drills)',
              questions: [
                {
                  prompt:
                    'From the book’s "Who Does What?" drill — match the intent: "Encapsulates interchangeable behaviors and uses delegation to decide which one to use." Which pattern, and which one is its easy-to-confuse neighbor?',
                  options: [
                    'State — neighbor is Strategy',
                    'Strategy — its neighbor State sounds identical ("encapsulates state-based behaviors and uses delegation to switch between them") but switches behavior based on internal state',
                    'Template Method — neighbor is Factory Method',
                    'Observer — neighbor is Command',
                  ],
                  answer: 1,
                  explanation:
                    'p612 intents. Strategy and State both encapsulate behaviors and delegate — the catalog’s value is precisely these side-by-side intents. State adds: the object switches which behavior is active as its internal state changes; Strategy’s behavior is chosen by the client.',
                },
                {
                  prompt:
                    'The GoF scheme sorts patterns into Creational, Behavioral, and Structural by purpose. Into which category does Observer fall, and into which does Factory Method fall?',
                  options: [
                    'Observer → Structural; Factory Method → Behavioral',
                    'Observer → Behavioral; Factory Method → Creational',
                    'Both are Creational',
                    'Observer → Creational; Factory Method → Structural',
                  ],
                  answer: 1,
                  explanation:
                    'p613. Observer is Behavioral (it’s about how objects interact and distribute responsibility — notification). Factory Method is Creational (it’s about object instantiation, decoupling a client from what it creates).',
                },
                {
                  prompt:
                    'Many developers expect Decorator to be a Behavioral pattern "because it adds behavior." The GoF file it under Structural. What’s the reasoning?',
                  options: [
                    'It was a historical mistake in the catalog',
                    'A pattern’s category is decided by its INTENT: Decorator’s intent is to compose objects (wrap one in another) to form new structures/functionality, not to manage communication between objects — which is what Behavioral patterns do',
                    'Decorator never actually adds behavior',
                    'Any pattern that uses wrapping is automatically Structural',
                  ],
                  answer: 1,
                  explanation:
                    'p615: "the intent of these patterns is different, and that’s often the key to understanding which category a pattern belongs to." Decorator’s focus is composing objects dynamically to gain functionality (structure), not the interconnection/communication that defines Behavioral patterns.',
                },
                {
                  prompt:
                    'A service you built three years ago uses a Strategy + Factory with five swappable implementations. Four were deleted; only one remains and no new ones are planned. A junior wants to keep the pattern "in case we need it." The Zen-mind answer?',
                  options: [
                    'Keep it — removing a pattern is bad practice',
                    'Remove the pattern: the flexibility you planned for isn’t needed, so a simpler solution without it would be better — and adding patterns for hypothetical (not practical) change just adds complexity',
                    'Add more strategies so the pattern earns its place',
                    'Convert it to a Singleton for consistency',
                  ],
                  answer: 1,
                  explanation:
                    'p619: "When do you remove a pattern? When... the flexibility you planned for isn’t needed... when a simpler solution without the pattern would be better." The Zen mind chases the simplest thing that solves the problem and only keeps patterns that handle practical, likely change.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'dp-m4',
      title: 'Decorator: Stack Behavior at Runtime',
      description: 'Starbuzz Coffee breaks under a class explosion — wrapping, not subclassing, fixes it and introduces the Open-Closed Principle.',
      lessons: [
        {
          id: 'dp-decorator',
          title: 'Decorator: wrap, don’t extend',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'Starbuzz Coffee, the Open-Closed Principle, and Decorator', markdown: decoratorMd },
            {
              kind: 'code',
              title: 'Build the Starbuzz beverage decorators',
              challenge: {
                prompt: `## Decorator: stack the Starbuzz beverages

Build the beverage-and-condiment system from the chapter: any beverage, wrapped in any combination of condiments, each layer adding to \`cost()\` and \`getDescription()\`.

**1. \`Beverage\`** (abstract component): constructor takes a \`description\`; \`getDescription()\` returns it; \`cost()\` is **abstract** (throws — subclasses must implement).

**2. Concrete beverages** — each sets its own description and cost:
- \`Espresso\` → "Espresso", 1.99
- \`HouseBlend\` → "House Blend Coffee", 0.89
- \`DarkRoast\` → "Dark Roast Coffee", 0.99
- \`Decaf\` → "Decaf", 1.05

**3. \`CondimentDecorator\`** (abstract decorator): extends \`Beverage\`; constructor stores the \`beverage\` it wraps; \`getDescription()\` stays **abstract** (throws).

**4. Concrete condiments** — each delegates to \`this.beverage\` for \`cost()\`/\`getDescription()\`, then adds its own:
- \`Mocha\` → +0.20, appends ", Mocha"
- \`Soy\` → +0.15, appends ", Soy"
- \`Whip\` → +0.10, appends ", Whip"

Round each \`cost()\` to 2 decimals (\`Math.round(x * 100) / 100\`) so layered costs come out clean.

**The point the tests check:** a decorator stack is still a \`Beverage\` (works with any number of layers, in any order), and adding a brand-new condiment never touches \`Beverage\`, the concrete beverages, or any existing condiment.`,
                starterCode: `class Beverage {
  constructor(description) {
    this.description = description;
  }
  getDescription() {
    return this.description;
  }
  cost() {
    throw new Error('cost() is abstract: subclass must implement');
  }
}

class Espresso extends Beverage {
  // super('Espresso'); cost() returns 1.99

}

class HouseBlend extends Beverage {
  // super('House Blend Coffee'); cost() returns 0.89

}

class DarkRoast extends Beverage {
  // super('Dark Roast Coffee'); cost() returns 0.99

}

class Decaf extends Beverage {
  // super('Decaf'); cost() returns 1.05

}

class CondimentDecorator extends Beverage {
  constructor(beverage) {
    super();
    this.beverage = beverage; // the Beverage (or another decorator) being wrapped
  }
  getDescription() {
    throw new Error('getDescription() is abstract: subclass must implement');
  }
}

class Mocha extends CondimentDecorator {
  // getDescription(): delegate to this.beverage, then append ", Mocha"
  // cost(): delegate to this.beverage, add 0.20, round to 2 decimals

}

class Soy extends CondimentDecorator {
  // +0.15, ", Soy"

}

class Whip extends CondimentDecorator {
  // +0.10, ", Whip"

}`,
                solution: `class Beverage {
  constructor(description) {
    this.description = description;
  }
  getDescription() {
    return this.description;
  }
  cost() {
    throw new Error('cost() is abstract: subclass must implement');
  }
}

class Espresso extends Beverage {
  constructor() {
    super('Espresso');
  }
  cost() {
    return 1.99;
  }
}

class HouseBlend extends Beverage {
  constructor() {
    super('House Blend Coffee');
  }
  cost() {
    return 0.89;
  }
}

class DarkRoast extends Beverage {
  constructor() {
    super('Dark Roast Coffee');
  }
  cost() {
    return 0.99;
  }
}

class Decaf extends Beverage {
  constructor() {
    super('Decaf');
  }
  cost() {
    return 1.05;
  }
}

class CondimentDecorator extends Beverage {
  constructor(beverage) {
    super();
    this.beverage = beverage;
  }
  getDescription() {
    throw new Error('getDescription() is abstract: subclass must implement');
  }
}

class Mocha extends CondimentDecorator {
  getDescription() {
    return this.beverage.getDescription() + ', Mocha';
  }
  cost() {
    return Math.round((this.beverage.cost() + 0.20) * 100) / 100;
  }
}

class Soy extends CondimentDecorator {
  getDescription() {
    return this.beverage.getDescription() + ', Soy';
  }
  cost() {
    return Math.round((this.beverage.cost() + 0.15) * 100) / 100;
  }
}

class Whip extends CondimentDecorator {
  getDescription() {
    return this.beverage.getDescription() + ', Whip';
  }
  cost() {
    return Math.round((this.beverage.cost() + 0.10) * 100) / 100;
  }
}`,
                tests: `test('Espresso alone has no condiments', () => {
  const e = new Espresso();
  assertEqual(e.getDescription(), 'Espresso');
  assertEqual(e.cost(), 1.99);
});
test('Dark Roast + Mocha + Mocha + Whip matches the book\\'s $1.49 order', () => {
  let beverage = new DarkRoast();
  beverage = new Mocha(beverage);
  beverage = new Mocha(beverage);
  beverage = new Whip(beverage);
  assertEqual(beverage.getDescription(), 'Dark Roast Coffee, Mocha, Mocha, Whip');
  assertEqual(beverage.cost(), 1.49);
});
test('House Blend + Soy + Mocha + Whip matches the book\\'s $1.34 order', () => {
  let beverage = new HouseBlend();
  beverage = new Soy(beverage);
  beverage = new Mocha(beverage);
  beverage = new Whip(beverage);
  assertEqual(beverage.getDescription(), 'House Blend Coffee, Soy, Mocha, Whip');
  assertEqual(beverage.cost(), 1.34);
});
test('decorator order changes the description but not the total cost', () => {
  const a = new Whip(new Soy(new Decaf()));
  const b = new Soy(new Whip(new Decaf()));
  assertEqual(a.cost(), b.cost());
  assertEqual(a.cost(), 1.30);
  assertEqual(a.getDescription(), 'Decaf, Soy, Whip');
  assertEqual(b.getDescription(), 'Decaf, Whip, Soy');
});
test('the base Beverage.cost() is abstract', () => {
  let threw = false;
  try { new Beverage('Mystery').cost(); } catch { threw = true; }
  assertEqual(threw, true);
});
test('CondimentDecorator.getDescription() is abstract on its own', () => {
  let threw = false;
  try { new CondimentDecorator(new Espresso()).getDescription(); } catch { threw = true; }
  assertEqual(threw, true);
});
test('a fully-decorated beverage is still a Beverage', () => {
  const beverage = new Whip(new Mocha(new Espresso()));
  assertEqual(beverage instanceof Beverage, true);
});
test('adding a new condiment is purely additive (open/closed)', () => {
  class Caramel extends CondimentDecorator {
    getDescription() {
      return this.beverage.getDescription() + ', Caramel';
    }
    cost() {
      return Math.round((this.beverage.cost() + 0.30) * 100) / 100;
    }
  }
  const beverage = new Caramel(new Espresso());
  assertEqual(beverage.getDescription(), 'Espresso, Caramel');
  assertEqual(beverage.cost(), 2.29);
  assertEqual(beverage instanceof Beverage, true);
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'The Starbuzz exercises',
              questions: [
                {
                  prompt:
                    'The “impact of change” exercise (p122) lists what breaks once condiments are boolean fields on Beverage, with cost() computed in the superclass: price changes force editing existing code, a new condiment means a new has*/set* pair AND an edit to the superclass’s cost(), and a Tea subclass inherits hasWhip() it will never use. Which two design principles does this design violate?',
                  options: [
                    'Singleton and Observer — the design has too many global objects',
                    'Open-Closed Principle (the superclass must be edited for every price change or new condiment) and encapsulate-what-varies (condiment handling is hardcoded into every beverage, wanted or not)',
                    'Only the Dependency Inversion Principle',
                    'None — this design has no principle violations, just more classes',
                  ],
                  answer: 1,
                  explanation:
                    'The book’s own framing (p122-125): “classes should be open for extension, but closed for modification” (OCP) — but here EVERY change to condiments means editing Beverage. And condiment-handling is forced onto beverages that don’t vary that way (Tea inherits hasWhip()) — the opposite of encapsulating what varies.',
                },
                {
                  prompt:
                    'Walk the cost() delegation for new Whip(new Mocha(new DarkRoast())) — DarkRoast $.99, Mocha +$.20, Whip +$.10 — per the book’s own walkthrough (p128). When the client calls cost() on the outermost object (the Whip), what actually happens first?',
                  options: [
                    'Whip immediately returns .99+.20+.10=1.29 because it already knows the full chain',
                    'Whip.cost() calls Mocha.cost(), which calls DarkRoast.cost() first — DarkRoast returns .99, Mocha adds .20 → 1.19, then Whip adds .10 → 1.29. The OUTERMOST call triggers the INNERMOST computation first.',
                    'DarkRoast.cost() is never called — Whip and Mocha already cached the total',
                    'The client must call cost() on all three objects separately and sum the results',
                  ],
                  answer: 1,
                  explanation:
                    'p128: “First, we call cost() on the outermost decorator, Whip... Mocha calls cost() on DarkRoast. DarkRoast returns its cost, 99 cents... Mocha adds its cost, 20 cents... Whip adds its total, 10 cents... $1.29.” Delegation calls unwind from the outside in, but the VALUES flow back from the inside out.',
                },
                {
                  prompt:
                    'The “New barista training” exercise (p132, solved on p145): a “double mocha soy latte with whip” is built from HouseBlend ($.89) + Soy ($.15) + Mocha ($.20) + Mocha ($.20, the “double”) + Whip ($.10). What’s the total?',
                  options: ['$1.34', '$1.44', '$1.54', '$1.64'],
                  answer: 2,
                  explanation:
                    'p145’s solution: .89 + .15 + .20 + .20 + .10 = $1.54. Each Mocha layer adds its own .20 independently — “double mocha” is just TWO Mocha decorators stacked, not a special-cased “double” field.',
                },
                {
                  prompt:
                    'Starbuzz later adds tall/grande/venti sizes (p137), and Soy’s cost depends on the beverage’s size (10¢/15¢/20¢). For Soy.cost() to know the size of the DarkRoast three layers down, what must CondimentDecorator add?',
                  options: [
                    'Nothing — size lives on the Beverage interface already and decorators don’t need to touch it',
                    'A getSize() method on CondimentDecorator that simply delegates to beverage.getSize() — exactly like cost() and getDescription() delegate, so size propagates through every layer to reach the concrete beverage at the core',
                    'Each decorator stores its own copy of the size when constructed',
                    'Decorators must hold a reference to the OUTERMOST wrapper to ask it for the size',
                  ],
                  answer: 1,
                  explanation:
                    'p146’s solution adds exactly one method: getSize() { return beverage.getSize(); } on CondimentDecorator. The lesson: a decorator only sees what it explicitly delegates — if behavior depends on some piece of state, EVERY decorator in the chain needs a delegating method for it, or that state can’t reach the core.',
                },
              ],
            },
            {
              kind: 'quiz',
              title: 'Decorator in the wild — and its dark side',
              questions: [
                {
                  prompt:
                    'In java.io, new BufferedInputStream(new FileInputStream("test.txt")) — which class plays the “ConcreteComponent” role from the Decorator class diagram, and which plays “ConcreteDecorator”?',
                  options: [
                    'FileInputStream is the ConcreteComponent (the thing being wrapped); BufferedInputStream is a ConcreteDecorator (adds buffering, via the abstract decorator FilterInputStream)',
                    'BufferedInputStream is the ConcreteComponent; FileInputStream is the decorator',
                    'Both are ConcreteComponents — there’s no decorator here',
                    'FilterInputStream is the ConcreteComponent',
                  ],
                  answer: 0,
                  explanation:
                    'Mirrors Starbuzz exactly: FileInputStream (like DarkRoast) is the concrete thing being read from; BufferedInputStream (like Mocha) extends the abstract decorator FilterInputStream (like CondimentDecorator) and wraps a FileInputStream to add buffering.',
                },
                {
                  prompt:
                    'From the Q&A (p137/142): production code runs if (beverage instanceof HouseBlend) applyDiscount(). A barista then wraps a HouseBlend in Soy, Mocha, and Whip before checkout. What happens to the discount check?',
                  options: [
                    'Still works — decorators are transparent to instanceof checks',
                    'It fails silently — the decorated object’s concrete type is now Whip (the outermost wrapper), not HouseBlend, so instanceof HouseBlend is false even though a HouseBlend sits at the core of the chain',
                    'It throws a runtime error',
                    'JS automatically unwraps decorators when evaluating instanceof',
                  ],
                  answer: 1,
                  explanation:
                    'p142’s confession: “if you have code that relies on the concrete component’s type, decorators will break that code... once you start writing code against concrete components, you’ll want to rethink your application design and your use of decorators.” The decorated object IS a Beverage (the shared supertype) but is NOT a HouseBlend.',
                },
                {
                  prompt:
                    'Both Decorator and Strategy let you “swap in new behavior without touching existing code” — so what structurally tells them apart?',
                  options: [
                    'They’re the same pattern under two names',
                    'Strategy gives the client ONE swappable reference (Duck holds ONE flyBehavior); Decorator lets you STACK any number of wrappers, each itself the same type as what it wraps, each adding its own before/after behavior around a delegated call',
                    'Decorator is for creating objects; Strategy is for destroying them',
                    'Strategy requires the Decorator Pattern to work',
                  ],
                  answer: 1,
                  explanation:
                    'A Duck has exactly one flyBehavior — swap it, and the OLD behavior is gone. A DarkRoast can be Mocha-wrapped, then Whip-wrapped, then Soy-wrapped — ALL THREE behaviors are active at once, layered. “In any combination, stacked” is the Decorator tell; “pick exactly one” is the Strategy tell.',
                },
                {
                  prompt:
                    'The chapter’s “Confessions of a Decorator” interview (p142) names real downsides. Which of these is NOT one the book actually raises?',
                  options: [
                    'Can produce a large number of small classes, which can be hard for newcomers to navigate (the java.io complaint)',
                    'Code that depends on a component’s concrete type breaks once that component gets wrapped',
                    'Instantiating a fully-decorated object means manually constructing and nesting every wrapper — a problem Factory and Builder help with',
                    'Decorators can only be stacked two layers deep before behavior becomes unpredictable',
                  ],
                  answer: 3,
                  explanation:
                    'Made up — the book says the OPPOSITE: “you can wrap a component with any number of decorators” (p128). The real confessions are: too many small classes, concrete-type-dependent code breaking, and complex instantiation (which is exactly the segue into the Factory and Builder chapters).',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'dp-m5',
      title: 'Singleton: Exactly One, On Purpose',
      description: 'The ChocolateBoiler can only ever be one thing — Singleton makes "one and only one" a guarantee, and the chapter is honest about what that guarantee costs.',
      lessons: [
        {
          id: 'dp-singleton',
          title: 'Singleton: one instance, global access',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'The Little Singleton, the ChocolateBoiler, and the lazy-init race', markdown: singletonMd },
            {
              kind: 'code',
              title: 'Build the ChocolateBoiler Singleton',
              challenge: {
                prompt: `## Singleton: the ChocolateBoiler

Build the \`ChocolateBoiler\` from the chapter: a controller for ONE physical boiler, where "one and only one" really has to hold.

**1. \`static getInstance()\`** — the only sanctioned way to get a boiler. The first call creates the instance (starting state: \`empty: true\`, \`boiled: false\`); every later call returns that SAME instance.

**2. The constructor guards itself.** JS has no \`private\` keyword, so the constructor enforces "only one" itself: if an instance already exists, calling \`new ChocolateBoiler()\` directly throws.

**3. \`fill()\`** — only fills if the boiler \`isEmpty()\`. On success, sets \`empty = false\` and \`boiled = false\`. Otherwise a no-op.

**4. \`boil()\`** — only boils if the boiler is full (\`!isEmpty()\`) AND not already boiled. On success, sets \`boiled = true\`. Otherwise a no-op.

**5. \`drain()\`** — only drains if the boiler is full AND boiled. On success, sets \`empty = true\`. Otherwise a no-op.

**6. \`isEmpty()\` / \`isBoiled()\`** — return the current state.

**7. \`static resetForTesting()\`** — clears the stored instance, so the next \`getInstance()\` builds a fresh boiler. Production code never calls this; it exists so tests don't share state with each other.

**The point the tests check:** every \`getInstance()\` call returns the identical object, a direct \`new\` after the first is rejected, and the fill/boil/drain invariants hold even when called out of order.`,
                starterCode: `class ChocolateBoiler {
  constructor() {
    this.empty = true;
    this.boiled = false;
  }

  static getInstance() {
    // TODO: return the SAME instance every time, creating it lazily on first call
    return new ChocolateBoiler();
  }

  fill() {
    // TODO: only fill if the boiler is currently empty
    this.empty = false;
    this.boiled = false;
  }

  boil() {
    // TODO: only boil if the boiler is full AND not already boiled
    this.boiled = true;
  }

  drain() {
    // TODO: only drain if the boiler is full AND boiled
    this.empty = true;
  }

  isEmpty() {
    return this.empty;
  }

  isBoiled() {
    return this.boiled;
  }

  static resetForTesting() {
    // TODO: clear the stored instance
  }
}`,
                solution: `class ChocolateBoiler {
  constructor() {
    if (ChocolateBoiler.instance) {
      throw new Error('ChocolateBoiler already exists — use ChocolateBoiler.getInstance()');
    }
    this.empty = true;
    this.boiled = false;
    ChocolateBoiler.instance = this;
  }

  static getInstance() {
    if (!ChocolateBoiler.instance) {
      new ChocolateBoiler();
    }
    return ChocolateBoiler.instance;
  }

  fill() {
    if (this.isEmpty()) {
      this.empty = false;
      this.boiled = false;
    }
  }

  boil() {
    if (!this.isEmpty() && !this.isBoiled()) {
      this.boiled = true;
    }
  }

  drain() {
    if (!this.isEmpty() && this.isBoiled()) {
      this.empty = true;
    }
  }

  isEmpty() {
    return this.empty;
  }

  isBoiled() {
    return this.boiled;
  }

  static resetForTesting() {
    ChocolateBoiler.instance = null;
  }
}`,
                tests: `test('getInstance() returns the same instance every time', () => {
  ChocolateBoiler.resetForTesting();
  const a = ChocolateBoiler.getInstance();
  const b = ChocolateBoiler.getInstance();
  assertEqual(a === b, true);
});
test('calling new ChocolateBoiler() directly a second time throws', () => {
  ChocolateBoiler.resetForTesting();
  ChocolateBoiler.getInstance();
  let threw = false;
  try { new ChocolateBoiler(); } catch { threw = true; }
  assertEqual(threw, true);
});
test('a fresh boiler starts empty and not boiled', () => {
  ChocolateBoiler.resetForTesting();
  const boiler = ChocolateBoiler.getInstance();
  assertEqual(boiler.isEmpty(), true);
  assertEqual(boiler.isBoiled(), false);
});
test('fill() on an empty boiler fills it', () => {
  ChocolateBoiler.resetForTesting();
  const boiler = ChocolateBoiler.getInstance();
  boiler.fill();
  assertEqual(boiler.isEmpty(), false);
  assertEqual(boiler.isBoiled(), false);
});
test('boil() on a full, unboiled boiler boils it', () => {
  ChocolateBoiler.resetForTesting();
  const boiler = ChocolateBoiler.getInstance();
  boiler.fill();
  boiler.boil();
  assertEqual(boiler.isBoiled(), true);
});
test('drain() on a full, boiled boiler empties it', () => {
  ChocolateBoiler.resetForTesting();
  const boiler = ChocolateBoiler.getInstance();
  boiler.fill();
  boiler.boil();
  boiler.drain();
  assertEqual(boiler.isEmpty(), true);
});
test('boil() on an empty boiler is a no-op', () => {
  ChocolateBoiler.resetForTesting();
  const boiler = ChocolateBoiler.getInstance();
  boiler.boil();
  assertEqual(boiler.isBoiled(), false);
});
test('drain() on a full-but-unboiled boiler is a no-op', () => {
  ChocolateBoiler.resetForTesting();
  const boiler = ChocolateBoiler.getInstance();
  boiler.fill();
  boiler.drain();
  assertEqual(boiler.isEmpty(), false);
});
test('state is shared across every getInstance() call', () => {
  ChocolateBoiler.resetForTesting();
  ChocolateBoiler.getInstance().fill();
  assertEqual(ChocolateBoiler.getInstance().isEmpty(), false);
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'Lazy, eager, and the lazy-init race',
              questions: [
                {
                  prompt:
                    'The Guru argues against a plain global/static variable for "one of a kind" objects (thread pools, caches, registry/preference settings, loggers) on one specific axis. What is it?',
                  options: [
                    'Global variables are slower to access at runtime than a static method call',
                    'A global variable\'s object is created when the application starts — even if it\'s never used. Singleton\'s getInstance() creates the instance lazily, only the first time it\'s actually needed.',
                    'Global variables cannot hold references to objects, only primitive values',
                    'Global variables trigger an extra garbage-collection pass on every read',
                  ],
                  answer: 1,
                  explanation:
                    'p208: "If you assign an object to a global variable, then that object might be created when your application begins... What if this object is resource intensive and your application never ends up using it? ...with the Singleton Pattern, we can create our objects only when they are needed." The axis is WHEN creation happens, not how fast access is.',
                },
                {
                  prompt:
                    'In the "BE the JVM" exercise (p217, solved p226), two threads both call getInstance() on a not-yet-created Singleton at nearly the same moment, using the classic `if (uniqueInstance == null) { uniqueInstance = new ChocolateBoiler(); } return uniqueInstance;`. What actually happens?',
                  options: [
                    'Both threads safely share one instance — Java guarantees this automatically',
                    'Both threads read uniqueInstance as null BEFORE either one assigns it, so each thread creates its own ChocolateBoiler — two different instances now exist, breaking "one and only one"',
                    'The second thread throws a NullPointerException and the program crashes',
                    'The JVM automatically blocks the second thread until the first one finishes',
                  ],
                  answer: 1,
                  explanation:
                    'p226: "Two different objects are returned! We have two ChocolateBoiler instances!!!" The unsynchronized null-check-then-create has a window where both threads see null before either writes uniqueInstance.',
                },
                {
                  prompt:
                    'A JS module has: `let connection = null; async function getConnection() { if (!connection) { connection = await createConnection(); } return connection; }`. Two callers both call getConnection() before either\'s `await createConnection()` resolves. What happens, and which of the chapter\'s fixes (p219-220) addresses it?',
                  options: [
                    'Nothing can go wrong — JavaScript is single-threaded, so this code is always safe',
                    'Both callers read connection === null before either assignment lands, so createConnection() runs twice and a connection leaks — the same race as the ChocolateBoiler. The fix is the same one the chapter recommends when the instance is always needed anyway: create it eagerly, at module load, instead of lazily inside the first call.',
                    'The second call throws immediately because connection is "locked" while being awaited',
                    'JavaScript automatically queues the second call until the first completes',
                  ],
                  answer: 1,
                  explanation:
                    'Same shape as the BE-the-JVM race, just async instead of multithreaded: two callers both observe the not-yet-assigned state. p219-220\'s "eager instantiation... guaranteed to be thread safe" translates directly: build the connection (or kick it off) once at module load, not lazily inside getConnection().',
                },
                {
                  prompt:
                    'The chapter\'s own Q&A (p221-222) raises two design-principle objections to Singleton. Which pairing matches them?',
                  options: [
                    'Open-Closed Principle and Liskov Substitution — Singletons can\'t be subclassed cleanly',
                    'Loose Coupling — every dependent is tightly bound to one specific concrete class, so a change to the Singleton ripples to all its consumers; AND Single Responsibility Principle — the class now manages BOTH its own one-instance lifecycle AND its actual job, two responsibilities in one class',
                    'Only a performance objection: Singletons are simply slower than ordinary classes',
                    'Encapsulation — Singleton exposes its internal fields as public',
                  ],
                  answer: 1,
                  explanation:
                    'p222: "It\'s easy for Singletons to violate [loose coupling]: if you make a change to the Singleton, you\'ll likely have to make a change to every object connected to it." And: "the Singleton is responsible not only for managing its one instance... but also for whatever its main role is in your application... it is taking on two responsibilities."',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Singleton vs Dependency Injection',
              scenario: {
                intro:
                  'Your team just finished the ChocolateBoiler exercise, and someone says: "Great — now that we get Singleton, let\'s use it more." Three proposals land in the same sprint. For each, decide whether Singleton is the right call, using the lazy-vs-eager tradeoff and the loose-coupling/SRP costs from this chapter.',
                stages: [
                  {
                    situation:
                      'A teammate wants to wrap the app\'s ConfigLoader — it reads .env plus a remote feature-flag service once, taking ~800ms — as a Singleton with ConfigLoader.getInstance().',
                    question: 'Is Singleton a good fit here?',
                    options: [
                      {
                        label:
                          'Yes — config is genuinely "one of a kind" per process (the Guru\'s own example: registry/preference settings), and it\'s expensive to build. Lazy getInstance() pays the 800ms cost once, only if config is ever read.',
                        quality: 'best',
                        feedback:
                          'Exactly the p208 argument: a resource-intensive object that the app may or may not use is precisely where lazy instantiation earns its keep, and "one config per process" is a real "one of a kind" constraint.',
                      },
                      {
                        label:
                          'Sort of — skip getInstance() and just export a module-level constant: export const config = loadConfig(). ES modules are already singletons, so "one instance" is free — but it\'s EAGER, so the 800ms happens at import time even on paths that never touch config.',
                        quality: 'ok',
                        feedback:
                          'Works, and is common, idiomatic JS — you do get exactly one instance. But it trades away the lazy-loading benefit the chapter spends a full page arguing for (p208), paying the cost even when config is never read.',
                      },
                      {
                        label:
                          'No — wrap ConfigLoader in a Factory so a fresh one is built every time it\'s needed.',
                        quality: 'bad',
                        feedback:
                          'Config is the textbook "one of a kind, possibly unused" case from p208 — a Factory here pays the 800ms cost on every single call for an object that should exist at most once.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Separately: tests need to fake the payment gateway, but production calls new StripeGateway() in 23 places. A junior proposes: "Let\'s make PaymentGateway a Singleton too — PaymentGateway.getInstance() everywhere — so there\'s only ever one gateway connection."',
                    question:
                      "Following the chapter's own Q&A on Singleton's costs (p221-222), what's the better call?",
                    options: [
                      {
                        label:
                          'No — this is the Loose Coupling + Single Responsibility violations from the Q&A: all 23 call sites become tightly coupled to ONE concrete global, and PaymentGateway now manages both "being the one instance" and "talking to Stripe". Build it once at startup and inject it (constructor/parameter) wherever it\'s needed — production still gets exactly one instance, but tests can pass a fake.',
                        quality: 'best',
                        feedback:
                          'Same outcome (one instance in production) without the cost: no class is globally reachable, so nothing is hard-wired to a concrete singleton and tests substitute freely.',
                      },
                      {
                        label:
                          'Make it a Singleton, but add PaymentGateway.resetForTesting() — same trick the ChocolateBoiler challenge just used — so tests can swap in a fake before each run.',
                        quality: 'ok',
                        feedback:
                          'It can be made to work, and resetForTesting() is a real technique. But it only patches testability — the 23 call sites are still tightly coupled to one concrete global class, the loose-coupling half of the Q&A\'s objection.',
                      },
                      {
                        label:
                          'Make it a Singleton, and since it\'s now globally reachable, just call PaymentGateway.getInstance().charge(...) directly from anywhere that needs to charge a card — no need to pass it around at all.',
                        quality: 'bad',
                        feedback:
                          'This is "hidden global state everywhere": untestable call sites, invisible coupling, concurrency hazards — the exact failure mode the Q&A warns "Singletons are meant to be used sparingly" (p222) about.',
                      },
                    ],
                  },
                  {
                    situation:
                      'A third spot: code review flags that OrderProcessor.getInstance() is called inside a loop processing 10,000 orders — the classic `if (uniqueInstance == null) { uniqueInstance = new OrderProcessor(); }` check runs all 10,000 times.',
                    question:
                      "What's the actual issue, and what does the chapter's performance discussion (p219-220) say to do about it?",
                    options: [
                      {
                        label:
                          'Functionally nothing is broken — after the first call uniqueInstance is set, so the other 9,999 calls just return it. But if this is a hot path and the instance is ALWAYS needed anyway, the chapter says to skip the lazy check entirely: create it eagerly (static instance = new OrderProcessor(), at class-definition time).',
                        quality: 'best',
                        feedback:
                          'Matches p219-220\'s eager-instantiation recommendation: when you\'ll always create and use the instance, build it up front and drop the per-call check.',
                      },
                      {
                        label:
                          'Replace getInstance() with new OrderProcessor() inside the loop — give each order its own processor.',
                        quality: 'bad',
                        feedback:
                          'This defeats the entire point of Singleton — now there are 10,000 OrderProcessor instances instead of one, the opposite of "one and only one".',
                      },
                      {
                        label:
                          'The null check is the bug — delete it so getInstance() always runs uniqueInstance = new OrderProcessor() and returns it.',
                        quality: 'ok',
                        feedback:
                          'Removing the check means EVERY call now builds a brand-new instance, permanently breaking "one and only one" — this is worse than the (harmless) status quo, not a fix for it.',
                      },
                    ],
                  },
                ],
                debrief:
                  'Singleton earns its place when there\'s a real one-of-a-kind constraint — one physical boiler, one process-wide config, one connection pool — and lazy-vs-eager should follow from whether the instance is expensive-and-sometimes-unused (lazy) or cheap-and-always-needed (eager). But for ordinary "shared service" objects — payment gateways, repositories, anything a test might want to fake — the chapter\'s own Q&A names the real cost: every consumer gets hard-wired to one concrete global, and the class takes on a second job (managing its own lifecycle) it didn\'t ask for. That\'s why dependency injection, not Singleton, is the usual answer there: one instance in production, without the global, untestable wiring.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dp-m6',
      title: 'Adapter & Facade: Wrapping for Compatibility and Simplicity',
      description: 'Two more reasons to wrap an object: Adapter converts an incompatible interface into one a client expects, and Facade simplifies a complex subsystem — and closes the loop on Decorator from dp-m4.',
      lessons: [
        {
          id: 'dp-adapter',
          title: 'Adapter: same job, different plug',
          minutes: 20,
          xp: 100,
          steps: [
            { kind: 'read', title: 'AC adapters, Turkey-as-Duck, and object vs. class adapters', markdown: adapterMd },
            {
              kind: 'code',
              title: 'Build the EnumerationIterator adapter',
              challenge: {
                prompt: `## Adapter: make a legacy menu "Enumeration" look like an Iterator

Your app has a \`LegacyMenuEnumeration\` (the **Adaptee**) — read-only, with \`hasMoreElements()\`/\`nextElement()\`, like Java's old \`Enumeration\`. New code is written against an \`Iterator\`-shaped **Target** interface: \`hasNext()\`/\`next()\`/\`remove()\`.

Build \`EnumerationIterator\` (the **Adapter**), an *object* adapter (composition — the only kind JS supports):

- \`constructor(enumeration)\` stores the wrapped enumeration.
- \`hasNext()\` delegates to \`enumeration.hasMoreElements()\`.
- \`next()\` delegates to \`enumeration.nextElement()\`.
- \`remove()\` — \`Enumeration\` has **no equivalent** method, so per the chapter (p290), **throw** to signal "unsupported".

\`LegacyMenuEnumeration\` is provided — don't change it.`,
                starterCode: `class LegacyMenuEnumeration {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }
  hasMoreElements() {
    return this.index < this.items.length;
  }
  nextElement() {
    return this.items[this.index++];
  }
}

class EnumerationIterator {
  constructor(enumeration) {
    this.enumeration = enumeration;
  }
  hasNext() {
    // TODO: delegate to this.enumeration.hasMoreElements()
    return true;
  }
  next() {
    // TODO: delegate to this.enumeration.nextElement()
  }
  remove() {
    // TODO: Enumeration has no remove() — throw to signal "unsupported"
  }
}`,
                solution: `class LegacyMenuEnumeration {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }
  hasMoreElements() {
    return this.index < this.items.length;
  }
  nextElement() {
    return this.items[this.index++];
  }
}

class EnumerationIterator {
  constructor(enumeration) {
    this.enumeration = enumeration;
  }
  hasNext() {
    return this.enumeration.hasMoreElements();
  }
  next() {
    return this.enumeration.nextElement();
  }
  remove() {
    throw new Error('remove() is not supported: Enumeration has no equivalent method');
  }
}`,
                tests: `test('hasNext() is true before consuming any items', () => {
  const e = new LegacyMenuEnumeration(['Pancakes', 'Waffles']);
  const it = new EnumerationIterator(e);
  assertEqual(it.hasNext(), true);
});

test('next() returns items in order, delegating to nextElement()', () => {
  const e = new LegacyMenuEnumeration(['Pancakes', 'Waffles']);
  const it = new EnumerationIterator(e);
  assertEqual(it.next(), 'Pancakes');
  assertEqual(it.next(), 'Waffles');
});

test('hasNext() becomes false once all items are consumed', () => {
  const e = new LegacyMenuEnumeration(['Pancakes']);
  const it = new EnumerationIterator(e);
  it.next();
  assertEqual(it.hasNext(), false);
});

test('an empty enumeration starts with hasNext() === false', () => {
  const e = new LegacyMenuEnumeration([]);
  const it = new EnumerationIterator(e);
  assertEqual(it.hasNext(), false);
});

test('remove() throws — Enumeration has no remove() to adapt', () => {
  const e = new LegacyMenuEnumeration(['Pancakes']);
  const it = new EnumerationIterator(e);
  let threw = false;
  try {
    it.remove();
  } catch (err) {
    threw = true;
  }
  assertEqual(threw, true);
});

test('two iterators over the same enumeration share progress (composition, not copying)', () => {
  const e = new LegacyMenuEnumeration(['A', 'B', 'C']);
  const it1 = new EnumerationIterator(e);
  it1.next();
  const it2 = new EnumerationIterator(e);
  assertEqual(it2.next(), 'B');
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'Adapter, object vs. class, and its cousins',
              questions: [
                {
                  prompt: 'p294 asks you to match each pattern to its intent. Which is the Adapter Pattern\'s intent?',
                  options: [
                    'Converts one interface to another',
                    'Doesn\'t alter the interface, but adds responsibility',
                    'Makes an interface simpler',
                    'Defines a family of interchangeable algorithms',
                  ],
                  answer: 0,
                  explanation:
                    'p294\'s matching exercise: Adapter "Converts one interface to another"; Decorator "Doesn\'t alter the interface, but adds responsibility"; Facade "Makes an interface simpler". The third option is Strategy, from dp-m2.',
                },
                {
                  prompt:
                    'JavaScript has no multiple inheritance. Per p284-287, what does that mean for adapters you write in JS?',
                  options: [
                    'JS simply cannot implement the Adapter Pattern at all',
                    'Every adapter in JS is necessarily an OBJECT adapter — composition (store + delegate) — which per the fireside chat (p287) is also the more flexible form: it works for the adaptee class AND any of its subclasses',
                    'JS adapters must use Object.assign to merge two prototypes together, simulating multiple inheritance',
                    'Class adapters are actually easier in JS, because extends supports multiple base classes',
                  ],
                  answer: 1,
                  explanation:
                    'p284: a class adapter "needs multiple inheritance... which isn\'t possible in Java" — same is true of JS. p287: the object adapter\'s composition "can adapt not only an adaptee class, but any of its subclasses" — so the only option JS gives you is also the more flexible one.',
                },
                {
                  prompt:
                    'A LoggingBeverage wraps any Beverage, prints a log line, then calls cost()/getDescription() with NO change to their signatures or return shape. A CelsiusThermometerAdapter wraps a FahrenheitThermometer and exposes getCelsius(), where the wrapped object only has getFahrenheit(). Which is the Decorator and which is the Adapter, and why?',
                  options: [
                    'LoggingBeverage is the Decorator (same interface, added behavior); CelsiusThermometerAdapter is the Adapter (the interface itself changes — getFahrenheit() becomes getCelsius())',
                    'Both are Adapters, since both wrap an object',
                    'Both are Decorators, since both add value before delegating',
                    'LoggingBeverage is the Adapter, because it "translates" what gets logged',
                  ],
                  answer: 0,
                  explanation:
                    'p293\'s fireside chat, paraphrased: "we always convert the interface of what we wrap; you never do" (Adapter, to Decorator). LoggingBeverage keeps cost()/getDescription() — same shape, extra behavior, the Decorator tell. CelsiusThermometerAdapter\'s whole job IS the interface conversion (Fahrenheit-shaped → Celsius-shaped) — the Adapter tell.',
                },
                {
                  prompt:
                    'Half your codebase still calls oldApi.fetchUser(id) (old interface); the other half calls the new newApi.getUser(id). Both halves need to interoperate with a single user-fetching object during the migration. What does the chapter\'s Q&A (p282) suggest?',
                  options: [
                    'A Two-Way Adapter: one class that implements BOTH the old and new interfaces, so it can be handed to either half of the codebase',
                    'Pick one interface and rewrite the entire codebase before shipping anything else',
                    'Adapters can only implement one target interface at a time, so this isn\'t solvable with Adapter',
                    'Use Singleton so there\'s only one instance, which automatically resolves the interface mismatch',
                  ],
                  answer: 0,
                  explanation:
                    'p282: "create a Two Way Adapter that supports both interfaces. To create a Two Way Adapter, just implement both interfaces involved, so the adapter can act as an old interface or a new interface." Singleton (dp-m5) controls instance COUNT, not interface SHAPE — it doesn\'t address a mismatch at all.',
                },
              ],
            },
          ],
        },
        {
          id: 'dp-facade',
          title: 'Facade: one switch for everything',
          minutes: 25,
          xp: 120,
          steps: [
            { kind: 'read', title: 'Home theater, the Facade Pattern, and the Principle of Least Knowledge', markdown: facadeMd },
            {
              kind: 'code',
              title: 'Build the HomeTheaterFacade',
              challenge: {
                prompt: `## Facade: one watchMovie() call instead of eleven

Six subsystem classes are provided (\`Popper\`, \`Lights\`, \`Screen\`, \`Projector\`, \`Amp\`, \`Player\`) — each just appends a short string to a shared \`log\` array so tests can check exactly what happened, in what order. Don't change them.

Build \`HomeTheaterFacade\`:

- \`constructor(popper, lights, screen, projector, amp, player)\` stores all six (composition).
- \`watchMovie(movie)\` calls, **in this order** (p297):
  1. \`popper.on()\` 2. \`popper.pop()\` 3. \`lights.dim(10)\` 4. \`screen.down()\`
  5. \`projector.on()\` 6. \`projector.wideScreenMode()\` 7. \`amp.on()\`
  8. \`amp.setSurroundSound()\` 9. \`amp.setVolume(5)\` 10. \`player.on()\` 11. \`player.play(movie)\`
- \`endMovie()\` is already implemented below as a model — notice it's the same shape: a fixed sequence of one-line delegations to subsystem components.

The point: the client calls **two** methods (\`watchMovie\`/\`endMovie\`) instead of orchestrating six subsystems itself — and every subsystem stays directly usable by anyone who needs it (p298).`,
                starterCode: `class Popper {
  constructor(log) { this.log = log; }
  on() { this.log.push('popper on'); }
  off() { this.log.push('popper off'); }
  pop() { this.log.push('popper popping'); }
}
class Lights {
  constructor(log) { this.log = log; }
  on() { this.log.push('lights on'); }
  dim(level) { this.log.push(\`lights dim \${level}\`); }
}
class Screen {
  constructor(log) { this.log = log; }
  down() { this.log.push('screen down'); }
  up() { this.log.push('screen up'); }
}
class Projector {
  constructor(log) { this.log = log; }
  on() { this.log.push('projector on'); }
  off() { this.log.push('projector off'); }
  wideScreenMode() { this.log.push('projector widescreen'); }
}
class Amp {
  constructor(log) { this.log = log; }
  on() { this.log.push('amp on'); }
  off() { this.log.push('amp off'); }
  setSurroundSound() { this.log.push('amp surround sound on'); }
  setVolume(v) { this.log.push(\`amp volume \${v}\`); }
}
class Player {
  constructor(log) { this.log = log; }
  on() { this.log.push('player on'); }
  off() { this.log.push('player off'); }
  play(movie) { this.log.push(\`player play \${movie}\`); }
  stop() { this.log.push('player stop'); }
}

class HomeTheaterFacade {
  constructor(popper, lights, screen, projector, amp, player) {
    this.popper = popper;
    this.lights = lights;
    this.screen = screen;
    this.projector = projector;
    this.amp = amp;
    this.player = player;
  }
  watchMovie(movie) {
    // TODO: call the 11 subsystem methods from p297, in order
  }
  endMovie() {
    this.popper.off();
    this.lights.on();
    this.screen.up();
    this.projector.off();
    this.amp.off();
    this.player.stop();
    this.player.off();
  }
}`,
                solution: `class Popper {
  constructor(log) { this.log = log; }
  on() { this.log.push('popper on'); }
  off() { this.log.push('popper off'); }
  pop() { this.log.push('popper popping'); }
}
class Lights {
  constructor(log) { this.log = log; }
  on() { this.log.push('lights on'); }
  dim(level) { this.log.push(\`lights dim \${level}\`); }
}
class Screen {
  constructor(log) { this.log = log; }
  down() { this.log.push('screen down'); }
  up() { this.log.push('screen up'); }
}
class Projector {
  constructor(log) { this.log = log; }
  on() { this.log.push('projector on'); }
  off() { this.log.push('projector off'); }
  wideScreenMode() { this.log.push('projector widescreen'); }
}
class Amp {
  constructor(log) { this.log = log; }
  on() { this.log.push('amp on'); }
  off() { this.log.push('amp off'); }
  setSurroundSound() { this.log.push('amp surround sound on'); }
  setVolume(v) { this.log.push(\`amp volume \${v}\`); }
}
class Player {
  constructor(log) { this.log = log; }
  on() { this.log.push('player on'); }
  off() { this.log.push('player off'); }
  play(movie) { this.log.push(\`player play \${movie}\`); }
  stop() { this.log.push('player stop'); }
}

class HomeTheaterFacade {
  constructor(popper, lights, screen, projector, amp, player) {
    this.popper = popper;
    this.lights = lights;
    this.screen = screen;
    this.projector = projector;
    this.amp = amp;
    this.player = player;
  }
  watchMovie(movie) {
    this.popper.on();
    this.popper.pop();
    this.lights.dim(10);
    this.screen.down();
    this.projector.on();
    this.projector.wideScreenMode();
    this.amp.on();
    this.amp.setSurroundSound();
    this.amp.setVolume(5);
    this.player.on();
    this.player.play(movie);
  }
  endMovie() {
    this.popper.off();
    this.lights.on();
    this.screen.up();
    this.projector.off();
    this.amp.off();
    this.player.stop();
    this.player.off();
  }
}`,
                tests: `function makeFacade(log) {
  return new HomeTheaterFacade(
    new Popper(log),
    new Lights(log),
    new Screen(log),
    new Projector(log),
    new Amp(log),
    new Player(log)
  );
}

test('watchMovie() drives all six subsystems in the documented order', () => {
  const log = [];
  const facade = makeFacade(log);
  facade.watchMovie('Raiders of the Lost Ark');
  assertEqual(log, [
    'popper on',
    'popper popping',
    'lights dim 10',
    'screen down',
    'projector on',
    'projector widescreen',
    'amp on',
    'amp surround sound on',
    'amp volume 5',
    'player on',
    'player play Raiders of the Lost Ark',
  ]);
});

test('endMovie() shuts everything down in the documented order', () => {
  const log = [];
  const facade = makeFacade(log);
  facade.endMovie();
  assertEqual(log, [
    'popper off',
    'lights on',
    'screen up',
    'projector off',
    'amp off',
    'player stop',
    'player off',
  ]);
});

test('watchMovie(movie) passes the movie title through to player.play()', () => {
  const log = [];
  const facade = makeFacade(log);
  facade.watchMovie('Spaceballs');
  assertEqual(log[log.length - 1], 'player play Spaceballs');
});`,
              },
            },
            {
              kind: 'quiz',
              title: 'Facade, Adapter, and the Principle of Least Knowledge',
              questions: [
                {
                  prompt:
                    'Your ReportingFacade wraps a SINGLE LegacyReportEngine class that has 40 methods, and exposes one generateMonthlyReport() method. Does "wrapping only one class" make this an Adapter instead of a Facade?',
                  options: [
                    'No — per p300, the difference isn\'t how many classes are wrapped, it\'s intent: ReportingFacade SIMPLIFIES an interface (Facade), it doesn\'t CONVERT one interface into a different one a client expects (Adapter)',
                    'Yes — Adapter always wraps exactly one class, Facade always wraps several',
                    'It\'s neither — patterns that wrap exactly one class don\'t have a name',
                    'Yes, because LegacyReportEngine is "legacy", and Adapter is specifically for legacy code',
                  ],
                  answer: 0,
                  explanation:
                    'p300: "The difference between the two is not in terms of how many classes they \'wrap,\' it is in their intent. The intent of the Adapter Pattern is to alter an interface so that it matches one a client is expecting. The intent of the Facade Pattern is to provide a simplified interface to a subsystem." A facade over one sprawling class is still a facade.',
                },
                {
                  prompt:
                    'Per the chapter\'s getTemp() example, which version follows the Principle of Least Knowledge — and what\'s the actual fix?',
                  options: [
                    'return station.getThermometer().getTemperature(); — chaining is fine as long as both calls are on one line',
                    'Thermometer thermometer = station.getThermometer(); return thermometer.getTemperature(); — storing the intermediate result in a variable first fixes it',
                    'return station.getTemperature(); — WeatherStation grows its OWN getTemperature() that asks its own thermometer; the caller now has one friend (station) instead of two',
                    'Neither — the Principle of Least Knowledge only applies to constructors, not getters',
                  ],
                  answer: 2,
                  explanation:
                    'p306: "Without the Principle: Thermometer thermometer = station.getThermometer(); return thermometer.getTemperature(); / With the Principle: return station.getTemperature();" — and p308\'s exercise calls out option 2 directly: storing the chained call in a variable first "doesn\'t violate... but has anything really changed since we just moved out the call to another method?" The real fix pushes the method onto station itself.',
                },
                {
                  prompt:
                    'The book points out that System.out.println(...) itself violates the Principle of Least Knowledge — System.out is a PrintStream object you got back from System, and you immediately call .println() on it. Given that EVERY program does this, what\'s the chapter\'s actual point?',
                  options: [
                    'The Principle of Least Knowledge should never be applied if it\'s ever inconvenient',
                    'Violations are everywhere once you know how to look for them — the question isn\'t "is this technically a violation" but whether the coupling it creates is worth what you get for it; no principle is a hard law',
                    'Java\'s standard library is poorly designed and should be avoided',
                    'println() is actually NOT a violation, because System is a built-in class and built-ins are exempt',
                  ],
                  answer: 1,
                  explanation:
                    'p307: "no principle is a law; all principles should be used when and where they are helpful. All design involves tradeoffs... while principles provide guidance, you should take all factors into account before applying them." System.out.println() (p308) is the chapter\'s own proof that even a "violation" you make thousands of times a day can be a fine tradeoff.',
                },
                {
                  prompt:
                    'p310\'s closing line: "an adapter wraps an object to change its interface, a decorator wraps an object to add new behaviors and responsibilities, and a facade \'wraps\' a set of objects to simplify." A ReadOnlyFileSystemAdapter wraps a FileSystem and exposes the SAME read()/write()/delete() methods, but write() and delete() now throw "read-only" errors while read() passes through unchanged. Despite its name, which pattern does this ACTUALLY match?',
                  options: [
                    'Decorator — the interface is UNCHANGED (same method names/signatures); what\'s added is new behavior (blocking writes) wrapped around the existing calls. "Adapter" in the name is a misnomer here',
                    'Adapter — anything with "Adapter" in the name is an Adapter by definition',
                    'Facade — it wraps one class, so it must be simplifying something',
                    'Singleton — read-only objects should only ever have one instance',
                  ],
                  answer: 0,
                  explanation:
                    'Same rule as the LoggingBeverage/CelsiusThermometerAdapter question: p293\'s "we always convert the interface of what we wrap; you never do" is the Adapter/Decorator tell. read()/write()/delete() keep their exact shapes — only behavior changed. A name is not a structure; this is a Decorator wearing an Adapter\'s name tag.',
                },
              ],
            },
            {
              kind: 'scenario',
              title: 'Adapter, Decorator, or Facade?',
              scenario: {
                intro:
                  'You\'ve now built all three wrapping patterns: Decorator (dp-m4, Starbuzz beverages), Adapter (this lesson, EnumerationIterator), and Facade (this lesson, HomeTheaterFacade). p310 sums up the difference in one line: an adapter changes an interface, a decorator adds behavior to the same interface, and a facade simplifies a complex one. Three new situations — pick the pattern that actually fits each.',
                stages: [
                  {
                    situation:
                      'Your app calls analytics.track(eventName, properties) at 50+ call sites. A new analytics SDK only exposes analytics.logEvent({ name, props, timestamp }) — same job, different shape.',
                    question: 'Which pattern fits, and why?',
                    options: [
                      {
                        label:
                          'Adapter — write a class that implements your existing track(eventName, properties) interface and translates each call into logEvent({ name, props, timestamp }) internally. The 50 call sites never change; only the new adapter knows about the SDK\'s shape.',
                        quality: 'best',
                        feedback:
                          'Exactly the TurkeyAdapter shape: same target interface (track), different adaptee interface (logEvent) — the adapter\'s whole job is the translation, p283\'s "convert the interface of a class into another interface the clients expect."',
                      },
                      {
                        label:
                          'Facade — wrap the new SDK in a class with a simpler interface.',
                        quality: 'ok',
                        feedback:
                          'You could call any wrapper a "facade" loosely, but per p300 the INTENT here is interface conversion (one shape to another, 1:1), not simplifying a complex multi-class subsystem — Adapter is the precise name, and the one your team will recognize.',
                      },
                      {
                        label:
                          'Decorator — wrap analytics so it tracks both the old way AND the new way.',
                        quality: 'bad',
                        feedback:
                          'Decorator keeps the SAME interface and adds behavior (p293: "we always convert the interface... you never do" — said BY the adapter, ABOUT decorators). Here the interface itself must change shape (track(name, props) → logEvent({...})), which a same-interface wrapper can\'t do.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your checkout flow calls cart.getItems(), pricing.calculateTotal(items), tax.applyTax(total, region), shipping.calculateShipping(items, address), and payment.charge(amount) — five subsystems, always in this order. A new "Express Checkout" button needs all five, in one call.',
                    question: 'Which pattern fits?',
                    options: [
                      {
                        label:
                          'Facade — an ExpressCheckoutFacade.checkout(cart, address) that calls all five subsystems in order. The five classes stay directly usable by the existing multi-step checkout — the facade is an ADDITIONAL simpler entry point, not a replacement.',
                        quality: 'best',
                        feedback:
                          'Straight from p298: "if you need the power of the complex subsystem, it\'s still there for you to use, but if all you need is a straightforward interface, the Facade is there for you." Five real subsystems, one new simplified entry point — textbook Facade.',
                      },
                      {
                        label:
                          'Just write a free function expressCheckout(cart, address) that calls all five in order — no new class.',
                        quality: 'ok',
                        feedback:
                          'Functionally this IS a facade (p300: the difference is intent, not whether it\'s packaged as a class) — it just isn\'t a reusable, named component your team can point to and extend the way ExpressCheckoutFacade could be.',
                      },
                      {
                        label:
                          'Adapter — none of the five subsystems have an incompatible interface, but Adapter is the pattern for "combining multiple classes".',
                        quality: 'bad',
                        feedback:
                          'Adapter solves "my client expects interface A, this class has interface B." Nothing here has a mismatched interface — every subsystem already works fine on its own. There\'s nothing to convert.',
                      },
                    ],
                  },
                  {
                    situation:
                      'Your Starbuzz Beverage decorator stack (dp-m4) is done. Now you want a LoggingBeverage that wraps any Beverage, prints a line to the console every time cost() or getDescription() is called, then returns the wrapped beverage\'s own result — unchanged.',
                    question: 'Which pattern fits?',
                    options: [
                      {
                        label:
                          'Decorator — LoggingBeverage IS a Beverage (same cost()/getDescription() shape), adds before/after behavior (the console line) around a delegated call, and stacks with Mocha/Whip/Soy in any order — exactly the Decorator shape from dp-m4.',
                        quality: 'best',
                        feedback:
                          'p310: "a decorator wraps an object to add new behaviors and responsibilities" — with NO interface change. LoggingBeverage is the textbook case: same shape, extra behavior, stackable.',
                      },
                      {
                        label:
                          'Facade — it wraps a Beverage, so call it a facade for the beverage.',
                        quality: 'ok',
                        feedback:
                          'Nothing is being simplified — LoggingBeverage exposes the EXACT SAME two methods (cost(), getDescription()) as what it wraps. Facade is for taking a complex, multi-method (often multi-class) interface and making it simpler; there\'s no simplification happening here.',
                      },
                      {
                        label:
                          'Adapter — it wraps a Beverage, and Adapter is the pattern for "wrapping things".',
                        quality: 'bad',
                        feedback:
                          'Per p293, "we always convert the interface of what we wrap" is the adapter\'s whole identity — LoggingBeverage\'s interface is IDENTICAL to Beverage\'s. No conversion, no Adapter.',
                      },
                    ],
                  },
                ],
                debrief:
                  'p310 names all three jobs a wrapper can do: "an adapter wraps an object to change its interface, a decorator wraps an object to add new behaviors and responsibilities, and a facade \'wraps\' a set of objects to simplify." Three questions, three patterns: does the interface need to CHANGE SHAPE to match what a client expects (Adapter)? Does the SAME interface need EXTRA behavior, possibly stacked (Decorator)? Or does a COMPLEX interface — one class or many — need a SIMPLER one, with the original still available underneath (Facade)? Same mechanism every time, composition plus delegation — three different reasons to reach for it.',
              },
            },
          ],
        },
      ],
    },
    {
  id: 'dp-m8',
  title: 'Command: Decoupling Invoker from Receiver',
  description: 'The home automation remote can\'t know every vendor\'s API, so the chapter wraps each request as an object — execute(), undo(), and eventually whole macros of them — so the invoker never has to know who\'s actually doing the work.',
  lessons: [
    {
      id: 'dp-command',
      title: 'Command: requests as objects, undo, and macros',
      minutes: 28,
      xp: 130,
      steps: [
        { kind: 'read', title: 'The Diner, the Remote Control, undo, and Macro Commands', markdown: commandMd },
        {
          kind: 'code',
          title: 'Build the RemoteControl invoker with undo and macros',
          challenge: {
            prompt: `## Command Pattern: the RemoteControl

Build the remote control invoker from the chapter, plus the undo-stack upgrade the Q&A describes (p266: "you keep a stack of previous commands... pop the first item off the stack and call its undo() method").

**1. \`Command\` shape.** Every command is a plain object with an \`execute()\` method and an \`undo()\` method. You'll be given a couple of ready-made commands (\`LightOnCommand\`, \`LightOffCommand\`) to test against — build the invoker and \`MacroCommand\` around them.

**2. \`RemoteControl\` class:**
   - \`constructor(slotCount)\` — creates \`slotCount\` slots, each pre-loaded with a \`NoCommand\` (a Null Object whose \`execute()\` and \`undo()\` both do nothing — p214's "implement a command that does nothing").
   - \`setCommand(slot, command)\` — stores a command in a slot.
   - \`pressButton(slot)\` — calls \`execute()\` on the command in that slot, then PUSHES that command onto an internal undo history (an array used as a stack).
   - \`pressUndoButton()\` — POPS the most recently pushed command off the undo history and calls its \`undo()\`. If the history is empty, it's a no-op (don't throw).

**3. \`MacroCommand\` class:**
   - \`constructor(commands)\` — takes an array of Command objects.
   - \`execute()\` — calls \`execute()\` on each command, IN ORDER.
   - \`undo()\` — calls \`undo()\` on each command, in REVERSE order (p274's exercise solution: unwind a stack, don't replay it forwards).

A \`MacroCommand\` must itself satisfy the Command shape (it has \`execute()\`/\`undo()\`), so it can be loaded into a \`RemoteControl\` slot exactly like any other command — that's the Meta Command Pattern.

**The point the tests check:** pressing a button runs the right receiver action; multiple undo presses unwind history in LIFO order; an empty slot's button press is a safe no-op; a macro command's undo reverses its own list in reverse order, even when that macro is sitting in a remote slot.`,
            starterCode: `class NoCommand {
  execute() {}
  undo() {}
}

class RemoteControl {
  constructor(slotCount) {
    this.slots = new Array(slotCount).fill(null).map(() => new NoCommand());
    // TODO: set up the undo history (a stack)
  }

  setCommand(slot, command) {
    this.slots[slot] = command;
  }

  pressButton(slot) {
    // TODO: execute the command in this slot, then push it onto undo history
    this.slots[slot].execute();
  }

  pressUndoButton() {
    // TODO: pop the most recent command off undo history and call undo() on it
    // TODO: must be a safe no-op when history is empty
  }
}

class MacroCommand {
  constructor(commands) {
    this.commands = commands;
  }

  execute() {
    for (const command of this.commands) {
      command.execute();
    }
  }

  undo() {
    // TODO: undo each command in REVERSE order
    for (const command of this.commands) {
      command.undo();
    }
  }
}`,
            solution: `class NoCommand {
  execute() {}
  undo() {}
}

class RemoteControl {
  constructor(slotCount) {
    this.slots = new Array(slotCount).fill(null).map(() => new NoCommand());
    this.undoHistory = [];
  }

  setCommand(slot, command) {
    this.slots[slot] = command;
  }

  pressButton(slot) {
    const command = this.slots[slot];
    command.execute();
    this.undoHistory.push(command);
  }

  pressUndoButton() {
    if (this.undoHistory.length === 0) return;
    const command = this.undoHistory.pop();
    command.undo();
  }
}

class MacroCommand {
  constructor(commands) {
    this.commands = commands;
  }

  execute() {
    for (const command of this.commands) {
      command.execute();
    }
  }

  undo() {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}`,
            tests: `class Light {
  constructor() { this.on_ = false; }
  on() { this.on_ = true; }
  off() { this.on_ = false; }
}
class LightOnCommand {
  constructor(light) { this.light = light; }
  execute() { this.light.on(); }
  undo() { this.light.off(); }
}
class LightOffCommand {
  constructor(light) { this.light = light; }
  execute() { this.light.off(); }
  undo() { this.light.on(); }
}

test('pressButton calls execute() on the receiver', () => {
  const light = new Light();
  const remote = new RemoteControl(7);
  remote.setCommand(0, new LightOnCommand(light));
  remote.pressButton(0);
  assertEqual(light.on_, true);
});

test('an unassigned slot is a safe no-op (NoCommand)', () => {
  const remote = new RemoteControl(7);
  let threw = false;
  try { remote.pressButton(3); } catch { threw = true; }
  assertEqual(threw, false);
});

test('pressUndoButton reverses the last pressed command', () => {
  const light = new Light();
  const remote = new RemoteControl(7);
  remote.setCommand(0, new LightOnCommand(light));
  remote.pressButton(0);
  remote.pressUndoButton();
  assertEqual(light.on_, false);
});

test('undo history is LIFO across multiple slots', () => {
  const light = new Light();
  const remote = new RemoteControl(7);
  remote.setCommand(0, new LightOnCommand(light));
  remote.setCommand(1, new LightOffCommand(light));
  remote.pressButton(0); // light on
  remote.pressButton(1); // light off
  remote.pressUndoButton(); // undoes slot 1's off -> light back on
  assertEqual(light.on_, true);
  remote.pressUndoButton(); // undoes slot 0's on -> light off
  assertEqual(light.on_, false);
});

test('pressUndoButton on empty history is a no-op, does not throw', () => {
  const remote = new RemoteControl(7);
  let threw = false;
  try { remote.pressUndoButton(); } catch { threw = true; }
  assertEqual(threw, false);
});

test('MacroCommand.execute() runs all commands in order', () => {
  const light1 = new Light();
  const light2 = new Light();
  const macro = new MacroCommand([new LightOnCommand(light1), new LightOnCommand(light2)]);
  macro.execute();
  assertEqual(light1.on_, true);
  assertEqual(light2.on_, true);
});

test('MacroCommand.undo() reverses all commands in REVERSE order', () => {
  const light = new Light();
  // First command turns on, second turns off -- final state after execute() is off.
  const macro = new MacroCommand([new LightOnCommand(light), new LightOffCommand(light)]);
  macro.execute();
  assertEqual(light.on_, false);
  macro.undo();
  // undo order: LightOffCommand.undo() first (-> on), then LightOnCommand.undo() (-> off)
  assertEqual(light.on_, false);
});

test('a MacroCommand can be loaded into a remote slot like any other command', () => {
  const light1 = new Light();
  const light2 = new Light();
  const remote = new RemoteControl(7);
  const macro = new MacroCommand([new LightOnCommand(light1), new LightOnCommand(light2)]);
  remote.setCommand(0, macro);
  remote.pressButton(0);
  assertEqual(light1.on_, true);
  assertEqual(light2.on_, true);
  remote.pressUndoButton();
  assertEqual(light1.on_, false);
  assertEqual(light2.on_, false);
});`,
          },
        },
        {
          kind: 'quiz',
          title: 'Order Slips, Null Objects, undo state, and Command vs Strategy',
          questions: [
            {
              prompt:
                'In the diner analogy that introduces the pattern, what specifically does the Order Slip do to keep the Waitress and the Short-Order Cook decoupled?',
              options: [
                'It has all the recipes hard-coded into the Waitress class, and the Order Slip just carries a customer name',
                'It exposes only one method (orderUp()) and holds a reference to the receiver, so the Waitress just calls that one method without knowing what food it makes or who actually makes it',
                'It forces the Customer to talk directly to the Short-Order Cook, bypassing the Waitress entirely',
                'It stores the recipe as a string the Cook has to parse and interpret at order time',
              ],
              answer: 1,
              explanation:
                'p237: "[the Order Slip] has an interface that consists of only one method, orderUp(), that encapsulates the actions needed to prepare the meal. It also has a reference to the object that needs to prepare it... the Waitress and the Cook are totally decoupled."',
            },
            {
              prompt:
                'Why does RemoteControl pre-fill every unassigned slot with a NoCommand object instead of leaving it null and checking for null on every button press?',
              options: [
                'NoCommand runs faster than a null check because the JVM optimizes virtual calls better than branches',
                'It removes the responsibility for handling null from the client code — every slot always holds something with an execute() method, even if that something does nothing; this is the Null Object pattern',
                'Null is not allowed as an array element value in this design',
                'NoCommand actually logs an error message so engineers notice unconfigured slots',
              ],
              answer: 1,
              explanation:
                'p214: "We did sneak a little something in there... So, how do we get around that? Implement a command that does nothing! ...A null object is useful when you don\'t have a meaningful object to return, and yet you want to remove the responsibility for handling null from the client."',
            },
            {
              prompt:
                'Why does CeilingFanHighCommand need to store prevSpeed as instance state, when LightOnCommand\'s undo() just calls light.off() with no stored state at all?',
              options: [
                'CeilingFanHighCommand is buggy and should be refactored to not need state, exactly like LightOnCommand',
                'Light only has two states (on/off), so "undo" is always the single opposite action; CeilingFan has multiple speeds, so undoing "set to HIGH" might mean going back to MEDIUM, LOW, or OFF depending on what it was before — that has to be captured at execute()-time to be restored later',
                'Because CeilingFan is a multi-threaded class and Light is not',
                'Java requires instance fields for any class implementing more than one interface method',
              ],
              answer: 1,
              explanation:
                'p259: "Hmm, so to properly implement undo, I\'d have to take the previous speed of the ceiling fan into account..." Undo is only "free" when there are exactly two states; otherwise the command must snapshot prior state in execute() so undo() has something to restore.',
            },
            {
              prompt:
                'The chapter\'s own Q&A asks how to support pressing undo multiple times in a row, not just once. What\'s the fix it describes?',
              options: [
                'Add a second undoCommand field so you can undo the last two button presses only',
                'Keep a stack of previously executed commands instead of a single "last command" field; each undo press pops the most recent command off the stack and calls undo() on it',
                'Re-run the entire RemoteLoader test script in reverse from the start',
                'Store the undo history in the Receiver class instead of the Invoker',
              ],
              answer: 1,
              explanation:
                'p266 Q&A: "instead of keeping just a reference to the last Command executed, you keep a stack of previous commands. Then, whenever undo is pressed, your invoker pops the first item off the stack and calls its undo() method." This is exactly the LIFO undo history built in the code challenge.',
            },
            {
              prompt:
                'When the chapter\'s exercise asks you to implement MacroCommand.undo() for a macro that ran lightOn, stereoOn, tvOn, hottubOn in that order, what order should undo() call each command\'s undo() in, and why?',
              options: [
                'The same forward order (lightOn, stereoOn, tvOn, hottubOn) — order never matters for undo',
                'Reverse order (hottubOn, tvOn, stereoOn, lightOn) — undo unwinds what execute() built up, like popping a stack, so the last thing turned on is the first thing reversed',
                'Alphabetical order by command class name, for consistency',
                'Random order — MacroCommand.undo() is non-deterministic by design',
              ],
              answer: 1,
              explanation:
                'p274 exercise solution: "public void undo() { for (int i = commands.length - 1; i >= 0; i--) { commands[i].undo(); } }" — undo walks the list backwards, the same unwind-a-stack logic as the remote\'s own undo history.',
            },
            {
              prompt:
                'Both Strategy and Command wrap behavior inside an object behind a single abstract method, and both let a client swap that object at runtime. What actually distinguishes them?',
              options: [
                'Strategy objects must be stateless; Command objects must hold state — that is the only real difference',
                'Strategy swaps which algorithm runs at one fixed call site, chosen by the client up front (e.g. which compression algorithm); Command decouples who makes a request from who carries it out, specifically so the request itself can be stored, queued, logged, or undone later — the remote stores an Order Slip it can replay or reverse, not just "one of several ways to do a job"',
                'Strategy is only usable with inheritance; Command only works with composition',
                'There is no real difference — Command is just Strategy applied to UI button presses',
              ],
              answer: 1,
              explanation:
                'Strategy answers "which algorithm should run here, right now" — the call site never changes. Command answers "who is asking, versus who will eventually act" — and exists because the request itself needs to be a first-class object you can hand off, queue, log, or undo, as the remote\'s Order Slip / undo stack / job-queue uses in this chapter all demonstrate.',
            },
            {
              prompt:
                'According to the chapter\'s Q&A, what do you give up if you write a "smart" Command that implements all its own logic instead of delegating to a separate Receiver object?',
              options: [
                'Nothing — smart commands are strictly better and the chapter recommends always using them',
                'The same level of decoupling between invoker and receiver, and the ability to parameterize the same command class with different receivers',
                'The ability to call execute() at all, since smart commands cannot implement the Command interface',
                'Thread safety — only smart commands have race conditions',
              ],
              answer: 1,
              explanation:
                'p266 Q&A: "...there are many examples of \'smart\' command objects that implement most, if not all, of the logic needed to carry out a request. Certainly you can do this; just keep in mind you\'ll no longer have the same level of decoupling between the invoker and receiver, nor will you be able to parameterize your commands with receivers."',
            },
          ],
        },
        {
          kind: 'scenario',
          title: 'Where does Command actually fit?',
          scenario: {
            intro:
              'Your team has the remote control API working — on/off, undo, party-mode macros. Now three unrelated feature requests land, each pitched as "let\'s just use Command for this." Decide whether Command is the right tool for each, using the decoupling-plus-undo/queue/log argument the chapter actually makes.',
            stages: [
              {
                situation:
                  'A teammate wants a "redo" feature: after pressing undo, a redo button should re-apply whatever was just undone. They propose: "Let\'s just call execute() again on the same command object."',
                question: 'Is this the right way to extend the pattern as built?',
                options: [
                  {
                    label:
                      'Mostly yes — since each command already supports execute() (do) and undo() (reverse), redo is just "execute() again" on the command most recently undone. The remote needs a second small stack (a redo stack) that receives commands popped off the undo stack, and pressing redo pops from THAT stack and calls execute() again, pushing it back onto the undo stack.',
                    quality: 'best',
                    feedback:
                      'This follows directly from the chapter\'s own undo-stack answer (p266): if undo is "pop and call undo()", redo is the symmetric "pop from a second stack and call execute() again" — no new pattern needed, just a second stack.',
                  },
                  {
                    label:
                      'Yes — just call execute() again on the same command object referenced by undoCommand, with no extra stack needed.',
                    quality: 'ok',
                    feedback:
                      'Works for the single-undo version of the remote, but breaks the moment you support multiple consecutive undos (the chapter\'s own Q&A upgrade): without a second stack, you lose track of which commands were undone and in what order, so redo can\'t replay them correctly.',
                  },
                  {
                    label:
                      'No — redo needs an entirely new pattern; Command can\'t support it because execute() should only ever be called once per command object.',
                    quality: 'bad',
                    feedback:
                      'Nothing in the Command interface forbids calling execute() more than once — the chapter\'s own commands are stateless about "how many times called." Rejecting Command here misreads what the pattern actually constrains.',
                  },
                ],
              },
              {
                situation:
                  'Separately, someone wants to add audit logging: every time any button on the remote is pressed, write a line to a log file recording what happened, for compliance review.',
                question:
                  "Does the chapter's own discussion of logging (p268) support reusing Command objects for this, and how?",
                options: [
                  {
                    label:
                      'Yes — because a Command already packages "a receiver plus a set of actions" as one ordinary object, it can be serialized/stored to disk as each command executes (store()/load() per the chapter), giving you both the audit trail AND, as a side effect, the ability to replay the log to recover state after a crash.',
                    quality: 'best',
                    feedback:
                      'p268: "As we execute commands, we store a history of them on disk... store() and load()." The exact mechanism the chapter describes for crash recovery doubles as an audit log, because the command object already is the complete record of "what happened."',
                  },
                  {
                    label:
                      'Yes, but only if every command is rewritten to print its own log line inside execute() — there\'s no other way to get this with Command.',
                    quality: 'ok',
                    feedback:
                      'This would work but throws away the actual mechanism the chapter proposes (store()/load() on the Command interface itself) in favor of reinventing ad hoc logging inside every concrete command — more code, less reuse.',
                  },
                  {
                    label:
                      'No — Command has nothing to do with logging; that would require switching to the Observer pattern instead.',
                    quality: 'bad',
                    feedback:
                      'The chapter explicitly extends Command for this exact use case (p268: "More uses of the Command Pattern: logging requests") — logging is presented as a natural extension, not a different pattern.',
                  },
                ],
              },
              {
                situation:
                  'Finally, a junior engineer suggests replacing the remote\'s seven Command slots with seven Strategy objects instead, arguing "they\'re basically the same thing, and Strategy sounds simpler."',
                question: 'Should the team make this swap?',
                options: [
                  {
                    label:
                      'No — the remote needs to store, swap, undo, and macro-compose requests over time (slots get reloaded, undo reverses past presses, MacroCommand runs several at once); Strategy has no undo/queue/log story because it answers a different question ("which algorithm runs at this one call site right now"), not "what happened, and can it be reversed or replayed later."',
                    quality: 'best',
                    feedback:
                      'Exactly the Command-vs-Strategy distinction: Strategy swaps the algorithm at a fixed call site; Command exists because the request itself needs to be a storable, undoable, composable object — which is the entire reason the remote needs undo history and MacroCommand in the first place.',
                  },
                  {
                    label:
                      'Yes — both patterns wrap behavior behind one method, so the swap is purely cosmetic and changes nothing about how the remote behaves.',
                    quality: 'bad',
                    feedback:
                      'The shapes look similar but the swap would silently lose undo and macro support, since Strategy was never designed to be stored, stacked, or reversed — it answers a different question entirely.',
                  },
                  {
                    label:
                      'Only partially — keep Command for the on/off slots but use Strategy for the undo button\'s behavior.',
                    quality: 'ok',
                    feedback:
                      'This half-measure doesn\'t address the actual problem: undo doesn\'t need "a different algorithm for undoing," it needs the already-executed Command object\'s own undo() method — introducing Strategy here adds a pattern without solving anything Command doesn\'t already solve.',
                  },
                ],
              },
            ],
            debrief:
              'Command earns its place whenever a request needs to outlive the moment it was made — stored in a slot, reversed by an undo stack, replayed from a redo stack, serialized to a log for crash recovery, or bundled into a macro that runs several requests as one. Strategy solves a narrower problem: which interchangeable algorithm runs at one fixed call site, decided by the client up front, with no expectation that the choice will be queued, logged, or undone. When you catch yourself asking "what happened, and can I take it back or replay it?" — that question only makes sense for Command.',
          },
        },
      ],
    },
  ],
},
    {
  id: 'dp-m9',
  title: "Template Method: The Algorithm's Skeleton",
  description: 'Coffee and tea recipes are the same algorithm wearing different clothes — Template Method pulls the shared skeleton into a superclass and lets subclasses fill in only the steps that differ, governed by the Hollywood Principle.',
  lessons: [
    {
      id: 'dp-template-method',
      title: 'Template Method: fixed skeleton, swappable steps',
      minutes: 28,
      xp: 130,
      steps: [
        { kind: 'read', title: 'CaffeineBeverage, the Hollywood Principle, and three kinds of method', markdown: templateMethodMd },
        {
          kind: 'code',
          title: 'Build CaffeineBeverageWithHook',
          challenge: {
            prompt: `## Template Method: CaffeineBeverageWithHook

Build the chapter's \`CaffeineBeverageWithHook\` abstract base class (translated to JS) and a \`CoffeeWithHook\` subclass, matching p332-333.

**1. \`CaffeineBeverageWithHook\` base class**, with:
- \`prepareRecipe()\` — the **template method**. Calls, in this exact order, and returns an array of the strings each step "outputs" (instead of printing): \`boilWater()\`, \`brew()\`, \`pourInCup()\`, and — only if \`customerWantsCondiments()\` returns true — \`addCondiments()\`.
- \`boilWater()\` — concrete method, shared by all beverages. Returns \`'Boiling water'\`.
- \`pourInCup()\` — concrete method, shared by all beverages. Returns \`'Pouring into cup'\`.
- \`brew()\` — **abstract**: throw an Error if called directly on the base class (subclasses must override it).
- \`addCondiments()\` — **abstract**: same as \`brew()\`, throw if not overridden.
- \`customerWantsCondiments()\` — the **hook**. Default implementation returns \`true\` and does nothing else. Subclasses MAY override it; if they don't, condiments are always added.

**2. \`CoffeeWithHook extends CaffeineBeverageWithHook\`**:
- \`brew()\` returns \`'Dripping Coffee through filter'\`.
- \`addCondiments()\` returns \`'Adding Sugar and Milk'\`.
- Overrides \`customerWantsCondiments()\` to return whatever boolean was passed into its constructor (so tests can simulate "customer said no").

**The point the tests check:** the algorithm's step ORDER never changes; \`addCondiments()\` is skipped entirely when the hook returns false; and calling \`brew()\`/\`addCondiments()\` on the base class directly (without subclassing) throws, because those are abstract.`,
            starterCode: `class CaffeineBeverageWithHook {
  prepareRecipe() {
    const steps = [];
    steps.push(this.boilWater());
    steps.push(this.brew());
    steps.push(this.pourInCup());
    // TODO: only push addCondiments() if customerWantsCondiments() is true
    steps.push(this.addCondiments());
    return steps;
  }

  boilWater() {
    return 'Boiling water';
  }

  pourInCup() {
    return 'Pouring into cup';
  }

  brew() {
    // TODO: this is abstract — base class must throw if not overridden
  }

  addCondiments() {
    // TODO: this is abstract — base class must throw if not overridden
  }

  customerWantsCondiments() {
    // TODO: this is a hook — default to true
    return false;
  }
}

class CoffeeWithHook extends CaffeineBeverageWithHook {
  constructor(wantsCondiments = true) {
    super();
    this.wantsCondiments = wantsCondiments;
  }

  brew() {
    return 'Dripping Coffee through filter';
  }

  addCondiments() {
    return 'Adding Sugar and Milk';
  }

  // TODO: override customerWantsCondiments() to return this.wantsCondiments
}`,
            solution: `class CaffeineBeverageWithHook {
  prepareRecipe() {
    const steps = [];
    steps.push(this.boilWater());
    steps.push(this.brew());
    steps.push(this.pourInCup());
    if (this.customerWantsCondiments()) {
      steps.push(this.addCondiments());
    }
    return steps;
  }

  boilWater() {
    return 'Boiling water';
  }

  pourInCup() {
    return 'Pouring into cup';
  }

  brew() {
    throw new Error('brew() is abstract — subclasses must implement it');
  }

  addCondiments() {
    throw new Error('addCondiments() is abstract — subclasses must implement it');
  }

  customerWantsCondiments() {
    return true;
  }
}

class CoffeeWithHook extends CaffeineBeverageWithHook {
  constructor(wantsCondiments = true) {
    super();
    this.wantsCondiments = wantsCondiments;
  }

  brew() {
    return 'Dripping Coffee through filter';
  }

  addCondiments() {
    return 'Adding Sugar and Milk';
  }

  customerWantsCondiments() {
    return this.wantsCondiments;
  }
}`,
            tests: `test('prepareRecipe() runs steps in the fixed order: boil, brew, pour, condiments', () => {
  const coffee = new CoffeeWithHook(true);
  const steps = coffee.prepareRecipe();
  assertEqual(steps, [
    'Boiling water',
    'Dripping Coffee through filter',
    'Pouring into cup',
    'Adding Sugar and Milk',
  ]);
});
test('hook returning false skips addCondiments() entirely', () => {
  const coffee = new CoffeeWithHook(false);
  const steps = coffee.prepareRecipe();
  assertEqual(steps, ['Boiling water', 'Dripping Coffee through filter', 'Pouring into cup']);
});
test('default hook on the base class returns true', () => {
  const base = new CaffeineBeverageWithHook();
  assertEqual(base.customerWantsCondiments(), true);
});
test('calling brew() directly on the base class throws (abstract method)', () => {
  const base = new CaffeineBeverageWithHook();
  let threw = false;
  try { base.brew(); } catch { threw = true; }
  assertEqual(threw, true);
});
test('calling addCondiments() directly on the base class throws (abstract method)', () => {
  const base = new CaffeineBeverageWithHook();
  let threw = false;
  try { base.addCondiments(); } catch { threw = true; }
  assertEqual(threw, true);
});
test('boilWater() and pourInCup() are shared concrete methods, identical for every subclass', () => {
  const coffee = new CoffeeWithHook();
  assertEqual(coffee.boilWater(), 'Boiling water');
  assertEqual(coffee.pourInCup(), 'Pouring into cup');
});
test('a second CoffeeWithHook instance with a different hook answer is independent', () => {
  const yes = new CoffeeWithHook(true);
  const no = new CoffeeWithHook(false);
  assertEqual(yes.prepareRecipe().length, 4);
  assertEqual(no.prepareRecipe().length, 3);
});`,
          },
        },
        {
          kind: 'quiz',
          title: 'Abstract methods, hooks, and Template Method vs Strategy',
          questions: [
            {
              prompt:
                "The chapter's own Q&A (p335) draws the line between an abstract method and a hook on one specific axis. What is it?",
              options: [
                'Abstract methods run faster than hooks at runtime',
                'Use abstract methods when the subclass MUST provide an implementation of that step; use hooks when that part of the algorithm is OPTIONAL — a subclass may override a hook, but doesn\'t have to',
                'Hooks can only be used in the constructor, abstract methods can be used anywhere',
                'Abstract methods are for primitive return types, hooks are for objects',
              ],
              answer: 1,
              explanation:
                'p335: "Use abstract methods when your subclass MUST provide an implementation of the method or step in the algorithm. Use hooks when that part of the algorithm is optional." Necessity vs optionality is the entire distinction.',
            },
            {
              prompt:
                'In CaffeineBeverageWithHook (p332), why is prepareRecipe() still declared final even though it now contains a conditional (if customerWantsCondiments())?',
              options: [
                'final is required on any method containing an if-statement',
                'The conditional is itself part of the fixed algorithm — the SEQUENCE of steps (boil, brew, pour, maybe-condiments) never changes, only whether one already-defined step runs. Subclasses still can\'t rewrite the recipe\'s structure, so prepareRecipe() stays locked.',
                'final was a typo carried over from the non-hook version and has no real purpose here',
                'Because customerWantsCondiments() is abstract, so the method calling it must also be final',
              ],
              answer: 1,
              explanation:
                'The hook adds a branch, not a new degree of freedom over the algorithm\'s shape — prepareRecipe() still "controls the algorithm. No one can change this" (p327). Hooks let subclasses influence outcomes without ever touching the template method itself.',
            },
            {
              prompt:
                'The Q&A on Arrays.sort() (p345) asks: "This implementation of sorting actually seems more like the Strategy Pattern... Why do we consider it Template Method?" What is the book\'s answer?',
              options: [
                'Because sort() uses inheritance internally, just hidden from the caller',
                'Because the algorithm Arrays implements for sort() is INCOMPLETE — it needs a class to fill in the missing compareTo() step. Strategy\'s composed object implements the WHOLE algorithm itself; Template Method\'s subclass (or, here, Comparable) only fills in one missing piece of a larger fixed algorithm.',
                'Because sort() is a static method, and Strategy can never be implemented with static methods',
                'There is no real difference; the book says either label is equally correct',
              ],
              answer: 1,
              explanation:
                'p345: "The algorithm that Arrays implements for sort() is incomplete; it needs a class to fill in the missing compareTo() method. So, in that way, it\'s more like Template Method." Strategy delegates the ENTIRE algorithm; Template Method only delegates individual steps.',
            },
            {
              prompt:
                'Strategy and Template Method both let you vary part of an algorithm. What actually differs between them?',
              options: [
                'Strategy is for algorithms with loops, Template Method is for algorithms without loops',
                'Template Method uses INHERITANCE so a subclass fills in one or more steps of a FIXED algorithm skeleton (the superclass keeps control and calls the shots); Strategy uses COMPOSITION so a client can swap out the ENTIRE algorithm at runtime by handing in a different strategy object',
                'Template Method can only be used with two steps; Strategy supports any number of steps',
                'They are interchangeable — any Template Method can be mechanically rewritten as a Strategy with zero design tradeoffs',
              ],
              answer: 1,
              explanation:
                'Per the fireside chat (p348): Template Method "define[s] the outline of an algorithm, but let[s] my subclasses do some of the work" via inheritance, fixed at compile time. Strategy "offer[s] clients a choice of algorithm implementation through object composition," swappable at runtime — and swaps the whole algorithm, not a step of it.',
            },
            {
              prompt:
                'A teammate writes a JFrame subclass and overrides paint() to draw a custom border. Per the chapter\'s Java-API safari (p346), what role does paint() play, and what would happen if they left it un-overridden?',
              options: [
                'paint() is abstract, so the code would fail to compile if left un-overridden',
                'paint() is a hook — "by default, paint() does nothing because it\'s a hook!" If left un-overridden, JFrame would simply draw nothing extra; the frame still renders normally, since the hook has a working default (no-op) behavior.',
                'paint() is a concrete, final method — overriding it is undefined behavior',
                'paint() is the template method itself, so overriding it would break JFrame\'s entire rendering algorithm',
              ],
              answer: 1,
              explanation:
                'p346: "By default, paint() does nothing because it\'s a hook! By overriding paint(), you can insert yourself into JFrame\'s algorithm." A hook always has a safe default — that\'s precisely what makes it optional rather than required.',
            },
          ],
        },
        {
          kind: 'scenario',
          title: 'Designing a report-generation framework',
          scenario: {
            intro:
              'Your team is building a shared "report generator" used across five teams: fetch data, transform it, render output, and optionally email it. Each team\'s reports differ in the details, but the overall sequence never changes. Using the chapter\'s abstract-method/hook/Strategy distinctions, decide how to structure each piece.',
            stages: [
              {
                situation:
                  'Every report MUST define how to fetch its source data — there is no sane default (one team queries Postgres, another reads a CSV, another calls an API). A teammate suggests giving fetchData() a default implementation that returns an empty array, "just so subclasses aren\'t forced to implement it."',
                question: 'Is that the right call for fetchData()?',
                options: [
                  {
                    label:
                      'No — this is exactly the abstract-method case from p335: "Use abstract methods when your subclass MUST provide an implementation." Defaulting to empty data hides a missing implementation as silent wrong behavior (a report that quietly has no data) instead of failing loudly. Declare it abstract so every subclass is forced to supply it.',
                    quality: 'best',
                    feedback:
                      'Right — fetchData() has no safe default; a no-op default would make a broken report look like it succeeded with zero rows, the worst kind of silent failure. Make it abstract.',
                  },
                  {
                    label:
                      'Yes — an empty-array default is harmless and means new report types can be added without immediately implementing every method.',
                    quality: 'bad',
                    feedback:
                      'This is precisely the failure mode the abstract/hook distinction prevents: a report that forgets to implement fetchData() now silently "succeeds" with no data instead of failing to compile/instantiate.',
                  },
                  {
                    label:
                      'Make it a hook that defaults to throwing an Error reminding the subclass to override it.',
                    quality: 'ok',
                    feedback:
                      'Functionally similar to an abstract method (it forces an override or it breaks), but it\'s simulating "MUST implement" with a hook mechanism instead of just using an abstract method, which is what the book\'s vocabulary already has a name for. Use abstract for "must," hooks for "optional."',
                  },
                ],
              },
              {
                situation:
                  'The optional "email the report when done" step: most teams never want it, but two teams do. A teammate proposes making sendEmail() abstract too, "for consistency with fetchData()."',
                question: 'Abstract or hook for sendEmail()?',
                options: [
                  {
                    label:
                      'Hook — default to a no-op (or returning false to skip). This matches customerWantsCondiments() exactly (p332): most beverages skip the optional step, and the ones that want it override the hook. Forcing every team to implement an unwanted email step (even as an empty stub) is needless busywork.',
                    quality: 'best',
                    feedback:
                      'Exactly the hook\'s job: optional steps that most callers skip and a few opt into, without forcing the majority to write empty stub implementations.',
                  },
                  {
                    label:
                      'Abstract, "for consistency" — every report subclass should look the same shape.',
                    quality: 'bad',
                    feedback:
                      'This punishes the three teams that never want email with mandatory empty-method busywork, exactly the cost the hook avoids. Consistency for its own sake isn\'t a reason to make an optional step mandatory.',
                  },
                  {
                    label:
                      'Skip the report framework for email entirely — have each team email reports manually outside the template method.',
                    quality: 'ok',
                    feedback:
                      'Works, but throws away the chance to let the email step participate in the same fixed, auditable sequence (fetch→transform→render→maybe-email) the rest of the algorithm gets — manual side calls are easy to forget or order incorrectly.',
                  },
                ],
              },
              {
                situation:
                  'A sixth team shows up with a genuinely different need: they don\'t want to fetch-transform-render-email in that order at all — they want to render FIRST (a live preview), then conditionally fetch fresh data and re-render based on user interaction. The fixed sequence doesn\'t fit their use case.',
                question:
                  "Per the chapter's own fireside chat (p348-349), is Template Method still the right tool here?",
                options: [
                  {
                    label:
                      'No — when the thing that needs to vary is the ALGORITHM\'S STRUCTURE itself (not just individual steps within a fixed order), that\'s outside what Template Method offers. Template Method "lets subclasses redefine certain steps... without changing the algorithm\'s structure" (p329). This team needs a different algorithm shape entirely — give them their own composed pipeline (closer to Strategy, swapping a whole report-building object) rather than forcing them into the report framework\'s fixed step order.',
                    quality: 'best',
                    feedback:
                      'Matches the definition precisely: Template Method protects the algorithm\'s STRUCTURE. A team that needs a different order needs a different algorithm, not a stretched Template Method.',
                  },
                  {
                    label:
                      'Yes — just add more hooks before and after every step so any order becomes possible.',
                    quality: 'bad',
                    feedback:
                      'Once enough hooks surround every step to permit arbitrary reordering, prepareRecipe()/generateReport() has stopped being a template for ONE algorithm and become a maze of conditionals — the "fixed skeleton" benefit (p329) is gone, replaced by accidental complexity.',
                  },
                  {
                    label:
                      'Yes — make the entire step order itself an abstract method that subclasses override completely.',
                    quality: 'bad',
                    feedback:
                      'If the override replaces the template method\'s own step order, that final, structure-protecting method no longer exists — at that point you\'ve reinvented Strategy without naming it, and lost the "the algorithm lives in one place" guarantee the pattern exists to provide.',
                  },
                ],
              },
            ],
            debrief:
              'The fetchData()-vs-sendEmail() split mirrors the chapter exactly: abstract methods are for steps with no safe default (a missing implementation should fail loudly), hooks are for steps most callers skip and a few opt into. But Template Method only protects an algorithm\'s STEPS, not its STRUCTURE — once a use case needs a genuinely different step order, that\'s a signal to reach for Strategy (a swappable whole-algorithm object) instead of stretching Template Method with hooks until the fixed skeleton disappears.',
          },
        },
      ],
    },
  ],
}
  ],
}
