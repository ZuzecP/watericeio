# Watericeio

[![tests](https://github.com/ZuzecP/watericeio/actions/workflows/test.yml/badge.svg)](https://github.com/ZuzecP/watericeio/actions/workflows/test.yml)

A one-page calculator for cooking rice by weight. Enter the grams of dry rice, pick the rice, the preference and the method, and it shows how much the pot should weigh once the rinsed rice and water are in.

Live page: https://zuzecp.github.io/watericeio/

## Use

1. Weigh the dry rice and enter the grams.
2. Pick the rice, the preference and the method.
3. Rinse the rice, put it in the tared pot, and add water until the scale shows the target weight.

Water left on the rice after rinsing counts toward the target, so the rinse does not need measuring.

## Ratios

Grams of total water per gram of dry rice, for rinsed rice.

| Rice | Preference | Rice cooker | Hob and oven |
|---|---|---|---|
| Jasmine | Fluffy | 1.40 | 1.65 |
| Jasmine | Grainy | 1.25 | 1.45 |
| Basmati, long grain | Fluffy | 1.90 | 2.00 |
| Basmati, long grain | Grainy | 1.65 | 1.80 |
| Sushi | Rolling | 1.25 | 1.40 |
| Sushi | Onigiri | 1.35 | 1.50 |
| Sushi | Poke | 1.30 | 1.45 |
| Short grain | Soft | 1.40 | 1.55 |
| Short grain | Firm | 1.30 | 1.45 |

Hob and oven assume a fully covered pot that lets only a little steam escape; for the oven, the water goes in boiling.

These are starting values. Where each one comes from, and how sure it is, is in `docs/sources.md`.

## Files

| File | What it is |
|---|---|
| `index.html`, `style.css`, `app.js` | The page. `app.js` only wires the form to `rice.js`. |
| `rice.js` | The ratio table and the calculation. No page code. |
| `test/rice.test.js` | Tests for `rice.js`. |
| `docs/sources.md` | Where every ratio comes from. |

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

## Run the tests

Needs Node.js 20 or newer. Nothing to install.

```bash
node --test
```

## Preview locally

The page uses JavaScript modules, which browsers do not load from a `file://` address, so serve the folder:

```bash
python3 -m http.server 8421
```

Then open http://localhost:8421.

## Change a ratio

1. Edit the value in `RATIOS` in `rice.js`.
2. Update the expected numbers for that combination in `test/rice.test.js` and run the tests.
3. Record the new value and the reason in `docs/sources.md`, and update the table above.

To add a rice, add it to every method in `RATIOS` and to a group in `TYPE_GROUPS`. To add a method, add a key to `RATIOS` that lists every rice. The page builds its options from the table.

When `style.css` or `app.js` changes, bump the `?v=` number on the two lines in `index.html`.

## Limitations

- The ratios are starting values from published sources, not tested recipes. Rice brand, age and cooker model all shift the result.
- Water scales in a straight line with rice. Very small batches may come out slightly dry.
- Hob and oven results depend on the pot, the lid and the heat far more than a rice cooker does.
- The page remembers the last rice, preference and method in the browser's own storage on that device. Nothing is sent anywhere.

## License / usage terms

Licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/): free to share and adapt with attribution to Zuzana Pešková, not for commercial use. See `LICENSE`.

## Contributing

See `CONTRIBUTING.md`. Before opening a pull request, run `node --test` and `sh scripts/check-public.sh`. CI runs both.
