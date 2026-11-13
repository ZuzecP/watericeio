# Contributing

Suggestions and improvements are welcome via pull request. A few notes before you open one:

- This repo reflects Zuzana Pešková's own way of cooking rice. Final say on what gets merged rests with the maintainer.
- Contributions become part of the work under the repo's existing license ([CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)). They don't carry separate ownership or licensing terms.
- Small fixes (typos, clarity, broken links) are easy to review and merge quickly. Larger changes are more likely to need discussion first, so feel free to open an issue before investing time in a big PR.
- A changed ratio needs a source: update `rice.js`, the expected values in `test/rice.test.js` and `docs/sources.md` together.
- Before opening a pull request, run `node --test` and `sh scripts/check-public.sh`. CI runs both.
