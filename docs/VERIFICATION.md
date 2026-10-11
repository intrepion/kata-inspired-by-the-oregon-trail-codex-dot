# Verification — 2026-10-11

## Local checks

- TypeScript strict type check: passed.
- Vitest: 49 tests passed; includes 30 seeded normal-loadout arrival simulations (seeds 0–29).
- Production build: passed. Approximately 27.3 kB JS / 10.8 kB gzip and 10.4 kB CSS / 3.1 kB gzip; no runtime dependencies.
- Dependency audit: updated vulnerable Vitest 3 to Vitest 5.0.3, then 0 vulnerabilities. Lockfile checked into source control.

## Real browser on this Mac

Chrome via supported Codex Computer Use, visible rendered controls only; no injected journey state or localStorage edits.

- Departure: recommended 180 food / $75 / 3 parts / 2 medicine / wagon 100. Extra starting purchase verified, then restart restored recommended supplies.
- Restart: cancel kept previous supplies, confirm reset; Enter departed, Space rested.
- Seed 1847 completed 720 miles with 4/4 travelers alive in 42 elapsed game days. All journey decisions used visible controls. Bought food at Juniper Post, repaired repeatedly, rested, foraged, treated a traveler, and used two ferries. Final resources included food 13 / $24 / wagon 55. Outcome screenshot: evidence/arrival.jpg.
- Interrupted encounter: reload at day 3 / mile 48 preserved the meal-sharing choice. Choosing it changed food 168→156 and money $75→$84. Resolution controls disappeared afterward. Further controls remained blocked while pending.
- Ferry: $84→$66, food 84→78, day 15→16, no wagon loss.
- Seed 2: explicitly applied with Repack control; first river ford produced the displayed accident: food 96→70 including 6 daily food, wagon 57→39, −12 party health. Screenshot: evidence/river-accident.jpg.
- Recovery: changed native pace/ration selects, verified preview, rested and checked party improvement and food cost. Medicine disabled for full health, then enabled after foraging and restored capped health without using a day.
- Loss: repeated generous-ration rest without resupply exhausted food, killed all four travelers, produced failure at mile 280 after 35 elapsed days, removed travel controls, and survived reload. Screenshot: evidence/failure.jpg.
- Shopping affordability: six consecutive food purchases reached food 420 / money $3; all shop buttons became disabled. Repeated legitimate purchases charged once per click; model tests cover repeated stale encounter/crossing commands.
- Floating: seed 2 used one part (3→2), six food (96→90), kept money and wagon, safely crossed; river resolution controls disappeared.
- Mobile: explicit 390×844 viewport. Inspected screenshot, made route labels readable in a horizontally scrollable map, fixed resulting grid overflow, then verified document width ≤ viewport in camp and at fresh start. Native touch-sized controls visible; no physical-device testing. Final evidence/mobile-start.jpg and evidence/mobile-camp.jpg.
- Browser console inspection: observed warnings originated in an installed Chrome extension, not game files; no game exceptions observed.
- Final state: seed 1847, fresh departure loadout, day 1, resumed successfully; desktop viewport override reset and tab marked as a deliverable.

The automated campaign measured approximately 131 seconds including checks. The 10–15-minute reading-paced estimate is not human playtest evidence. No automated accessibility audit or screen-reader session was performed; semantic controls, focus handling and reduced-motion CSS were inspected and keyboard activation tested. Malformed-save handling and terminal-input rejection beyond hidden UI are covered by public model tests.

## Repository and runtime

Private repository requested and created: intrepion/kata-inspired-by-the-oregon-trail-codex-dot. Checkout lives within task-5; preexisting task folders and ports 5173–5176 were not modified. Local server is bound to 127.0.0.1:5177. Remote commit and CI are verified after final push and reported in delivery.

No supported arbitrary-project sidebar registration control was exposed. No internal Codex store was modified. No public hosting or paid service was used.
