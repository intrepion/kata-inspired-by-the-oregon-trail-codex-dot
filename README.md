# The Long Lantern

An original wagon survival game about four travelers carrying a lantern toward a faraway harbor. Inspired by the travel and resource decisions of wagon-trail games, set on a fictional route with original illustrations and writing.

**Play locally:** http://127.0.0.1:5177/

```sh
cd /Users/intrepion/Documents/Codex/2026-10-10/task-5/kata-inspired-by-the-oregon-trail-codex-dot
npm ci
npm run dev
```

The server binds to loopback only and uses strict port 5177. It does not displace the existing games on 5173–5176. If 5177 is occupied, stop only this game's prior process or select another unused port explicitly.

## A journey in small decisions

Outfit at Briar Landing, choose pace and rations, travel 720 miles, and arrive before day 56 with a working wagon and at least one living traveler. Weather, encounters, two river crossings, and three trading stops interrupt the passage. Rest, forage, repair, and medicine offer recovery at clear costs. Supplies and health never fall below zero; death is permanent. The journal records consequences. Instructions live inside the game.

Seeds replay the same possibilities when you make the same choices. Enter a numeric seed and press **Repack with this seed** before buying extras; this resets the departure loadout. The journey saves on this device after every action, using validated version 1 local storage. Reload to resume a decision or ending. New journey asks before replacing the save. Storage failures are reported; keep the tab open if saving is unavailable.

A reading-paced journey is estimated at 10–15 minutes. The automated visible-control acceptance playthrough took approximately 2 minutes 11 seconds, including pauses for checks; the estimate has not been measured with human players.

## Checks and evidence

```sh
npm run typecheck
npm test
npm run build
npm audit --audit-level=moderate
```

49 behavioral tests cover economy atomicity, affordability, food and wagon bounds, daily costs, ration and pace effects, storm costs, encounters, crossing outcomes, rest/repair/medicine, permanent death, endings, terminal commands, seeds, and validated saves. Thirty seeds finish from the recommended loadout using sensible care and trading. GitHub Actions runs the same checks on pushes.

See [specification](docs/SPEC.md), [glossary](GLOSSARY.md), [architecture decisions](docs/adr/), [verification](docs/VERIFICATION.md), and [independent reviews](docs/REVIEW.md). Browser screenshots are in [evidence](evidence/).

## Implementation

Strict TypeScript + Vite, with no runtime dependencies, remote assets, paid services, telemetry, or public deployment. The pure journey model owns commands, resource changes, and seeded randomness. DOM rendering and local saving are adapters. Artwork is authored SVG; the game is intentionally silent. Native buttons and selects support keyboard and touch, and animation respects reduced motion. No commercial game assets or historical claims are included.

## Workflow disclosure

Local Matt Pocock skills used: Grill with Docs, grilling, domain-modeling, Implement, TDD, and code-review. The official upstream Grill with Docs and Implement pages were checked; their dependencies were read locally. The user's autonomous recommendations replaced the interview rounds and explicit seam confirmations. Decisions and seams were documented before implementation. TDD was applied to the initial economy slice and review fixes; the rest of the core model was built as an integrated slice, followed by behavioral regression coverage, rather than a strict one-test/one-change loop for every rule. Independent Standards and Spec reviews ran in separate agents and their findings were fixed.

No supported tool was available to register an arbitrary new checkout as a Codex sidebar project. The checkout and browser tab are delivered without editing internal app databases or unrelated projects.
