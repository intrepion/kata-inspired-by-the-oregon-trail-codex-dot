# The Long Lantern — acceptance specification

An original fictional wagon journey to Lantern Harbor. No claims of historical authenticity, borrowed commercial art, paid services, or public deployment. Five candidate directions considered: historical simulation, pastoral caravan, nocturnal lantern pilgrimage, procedural trading expedition, and real-time trail runner. Selected pastoral caravan + lantern pilgrimage with deliberate daily decisions. A mobile player should reach an ending without a pointer precision challenge.

## Delegated design tree

The user authorized autonomous recommended decisions and no design questions. Grill with Docs' interactive rounds and final confirmation, and TDD's seam confirmation, are adapted to that authorization, not claimed as an interview that occurred.

1. Identity → fictional route, original SVG art and prose, title The Long Lantern.
2. Campaign → 720 miles, 55-day deadline, 3 trading stops, 2 river gates, 4 party members. Estimated 10–15 minutes reading and choosing; measure browser fast-path separately.
3. Daily loop → pace affects miles/wear/health; rations affect food and health; weather uses seeded randomness. Rest, forage, repair consume a day and food. Medicine consumes one dose, no day. Dead travelers cannot revive.
4. Economy → recommended starting loadout 180 food, 3 parts, 2 medicines, $75, wagon 100. Purchases atomic and capped. Market only at departure or immediately at a settlement. River decisions state exact costs and probabilities.
5. Interruption → one pending event or river blocks other actions; resolution once; all outcomes appear in journal; terminal states reject input.
6. Replay → editable numeric seed; deterministic transitions; version 1 validated local save after each command, resume after reload; explicit restart confirmation.
7. Presentation → illustrated changing wagon scene, route map, party condition, resources, preview of daily food/miles, instructions, journal, native keyboard controls, touch targets, reduced motion, responsive 390px layout.

## Agreed public test seams

`newJourney`, `act`, `decodeSave`, and `encodeSave`: deterministic commands and state serialization. Test behavior through these interfaces with literal worked expectations. Browser tests exercise rendered visible controls; no injected game state or automation-only controls.

## Required acceptance coverage

Atomic economy, affordability, resource bounds, pace/ration effects and daily costs, deterministic events, single resolution/reward, crossing success/failure/cost, rest/repair, health/death, arrival/failure/post-ending, restart, malformed/versioned saves. Complete a normal recommended-loadout journey. Inspect desktop/mobile screenshots. Verify full suite, typecheck, production build, audit and remote CI.
