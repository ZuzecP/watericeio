# Changelog

## v1.2 (2026-11-13)

### Added
- The claim under the title: "Just right water rice ratio".

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
