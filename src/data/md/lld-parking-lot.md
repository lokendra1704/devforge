# Design a parking lot: the OOD walkthrough

The most-asked object-oriented design question on earth. It looks trivial — that's the trap. The interviewer doesn't care about parking; they care about **how you carve a fuzzy domain into objects with clean seams**. Here's a model answer, with the reasoning narrated.

## Step 1: Requirements before classes (always)

Pin these down out loud:

- Multiple floors; slot sizes (motorcycle / compact / large); vehicle types that map to allowed sizes
- A vehicle gets a **ticket** on entry; pays on exit; fee depends on duration and vehicle type
- Display free count per floor
- *Asked-about-later extensions (they always come):* EV slots, reserved slots, multiple gates

Skipping this step is the #1 fail mode — you cannot design entities for requirements you never stated.

## Step 2: Find the entities

Nouns with behavior or identity become classes:

```
ParkingLot ─ has → Floor[] ─ has → Slot[]
Vehicle (type, plate)
Ticket (id, vehicle, slot, entryTime)
FeeCalculator (strategy — varies independently!)
SlotAssigner  (policy — varies independently!)
```

The two non-obvious calls — and the ones that score:

- **`FeeCalculator` is its own class**, not a method on `ParkingLot`. Pricing changes constantly (weekend rates, EV surcharge, lost ticket penalty); allocation doesn't. Things that change at different speeds belong in different classes.
- **`SlotAssigner` is a policy object**: "nearest to entrance" today, "spread across floors" tomorrow — swap the object, don't edit the lot. (That's the Strategy pattern; the Design Patterns track makes this rigorous.)

## Step 3: The flows

**Entry:** `lot.parkVehicle(vehicle)` → assigner finds a free slot of a compatible size → slot marked occupied → `Ticket` created with the entry timestamp → returned. No slot? Throw `LotFullError` — never return null and pray.

**Exit:** `lot.unpark(ticket, now)` → `feeCalculator.calculate(ticket, now)` → slot freed → fee returned. Note `now` is *passed in* — the injected clock again, making "parked 3 days" testable in microseconds.

## Step 4: Surviving the extensions

- "Add EV slots with chargers" → new slot size + maybe an `EVSlot` subclass holding charger state. `FeeCalculator` adds an energy line item. **Allocation code: untouched.**
- "Reserved slots" → `SlotAssigner` filters by an `isReserved` flag. **Pricing: untouched.**
- "Multiple entry gates assigning concurrently" → two gates may race for the same slot; slot assignment needs to be atomic (lock or compare-and-set on the slot). Naming the race unprompted is a senior-level flex — and a perfect segue to the Parallelism track.

If an extension forces edits across three classes, the original seams were wrong. If it lands in exactly one place, you designed well. **That's the whole game.**

## The transferable checklist

1. State requirements → entities → flows, in that order
2. Things that change at different rates live in different classes
3. Policies (pricing, assignment) are swappable objects, not if-else chains
4. Inject the clock; throw real errors; never half-update state

Same skeleton designs an elevator system, a movie booking system, Splitwise, a chess game — the four other questions in the OOD top five.
