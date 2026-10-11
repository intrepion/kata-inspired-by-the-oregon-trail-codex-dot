# Independent review

Baseline: a1a2e89 (empty new-repository baseline). Initial reviewed commit: e87fc27. Command: git diff a1a2e89...HEAD. Originating specification: docs/SPEC.md. Standards: CODING_STANDARDS.md and Matt Pocock code-review's Fowler smell baseline. Separate agents independently reviewed the two axes.

## Standards

1. Documented violation: event IDs in saved data used a property check that coerced arrays to strings. A malformed ["stranger"] event could render valid options but skip the actual resource consequences. Fixed by explicitly requiring a string ID; regression was observed failing before the fix and passing afterward.
2. Judgment smell: duplicated pace/ration and route data in rendering. Fixed by exporting PACE/RATIONS descriptors and deriving map landmarks from ROUTE.

Initial total: 1 hard violation, 1 judgment smell. Worst issue: malformed saved encounter bypassed displayed consequences. Follow-up review checks the fixes separately.

## Spec

No missing features or scope creep found. One low-priority finding: medicine journal claimed 20 recovered health at the cap, and positive encounter rewards had similar wording. Fixed medicine journal and clamped positive choices to say “up to,” documented caps in instructions, and added a worked 95→100 medicine regression. The medicine regression was observed failing before the wording fix and passing afterward.

Initial total: 1 accuracy finding. Worst issue: recovery text overstated gains near caps. Follow-up review checks the fixes separately.

## Browser findings fixed

Numeric seed changes did not reliably apply through the tested input workflow. Added an explicit Repack button and verified a distinct seed in the rendered footer and resulting campaign. Mobile map labels were tiny; a scrollable wider map improved readability, then a document-width check caught and fixed a min-content grid overflow. Both corrected layouts were visually rechecked.

## Follow-up results

Standards reviewer: both findings resolved; seed validation and mobile grid changes introduced no substantive new defects. Static review only.

Spec reviewer: capped recovery finding resolved; 49 tests passed; seed repacking and scrollable mobile map match the specification. No remaining actionable findings on either axis.
