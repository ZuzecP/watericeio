# Changelog

## v2.0 (2026-11-13)

Two more methods, two more rice types and a new page layout.

### Added
- Methods: hob and oven, next to the rice cooker. They share one set of ratios.
- Rice: long grain (cooks like basmati) and short grain (soft, firm).
- The page remembers the last rice, preference and method on the device.

### Changed
- The amount and the rice read as one sentence: "270 grams of Jasmine rice". The rice is chosen from a pick-list grouped into long grain and short grain.
- Preference and method are toggles. The field titles are gone from the screen; screen readers still announce them.
- The results stay hidden until the first valid amount, then stay visible.

## v1.2 (2026-11-13)

### Added
- The claim under the title: "Just right water rice ratio".
- "rice" in the title is green.

### Changed
- Order is now rice field, results, then the options. A phone centres the focused field above the keyboard; with the field first, the page stays put and the results stay visible.
- The stylesheet and script links carry a version, so a fresh page never loads with a cached older one.

## v1.1 (2026-11-13)

### Changed
- The results sit above the inputs, so a phone keyboard no longer covers the target weight.

## v1.0 (2026-11-13)

First public version.

### Added
- The page: dry rice in grams, type, preference and method in; target pot weight, total water and ratio out. Results update as you type.
- Seven rice cooker ratios: jasmine (fluffy, grainy), basmati (fluffy, grainy), sushi (rolling, onigiri, poke). Sources and reasoning in `docs/sources.md`.
- Input rules: whole grams from 1 to 1999.
- Tests for every combination, rounding and input rejection; `scripts/check-public.sh`; CI.
