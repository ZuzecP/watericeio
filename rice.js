// Ratio table and calculation. No DOM access; the page (app.js) and the tests both import this.
//
// A ratio is grams of total water per gram of dry rice, including the water that
// clings to the rice after rinsing. Every value is explained in docs/sources.md:
// change both together, and update the expected values in test/rice.test.js.
//
// Key order is the order the options appear on the page.
export const RATIOS = {
  'rice-cooker': {
    jasmine: { fluffy: 1.4, grainy: 1.25 },
    basmati: { fluffy: 1.9, grainy: 1.65 },
    sushi: { rolling: 1.25, onigiri: 1.35, poke: 1.3 },
  },
};

export const MAX_RICE = 1999;

function isValidRice(rice) {
  return Number.isInteger(rice) && rice >= 1 && rice <= MAX_RICE;
}

// Text from the input field -> whole grams, or null if it is not a whole number from 1 to MAX_RICE.
export function parseRice(input) {
  const text = String(input).trim();
  if (!/^\d+$/.test(text)) return null;
  const rice = Number(text);
  return isValidRice(rice) ? rice : null;
}

function lookupRatio(method, type, preference) {
  let node = RATIOS;
  for (const key of [method, type, preference]) {
    if (typeof node !== 'object' || !Object.hasOwn(node, key)) return null;
    node = node[key];
  }
  return typeof node === 'number' ? node : null;
}

// Returns { ratio, water, target } in whole grams, or null for invalid rice or an unknown combination.
export function calculate({ rice, method, type, preference }) {
  if (!isValidRice(rice)) return null;
  const ratio = lookupRatio(method, type, preference);
  if (ratio === null) return null;
  // Work in whole thousandths so that exact half grams round up despite floating point.
  const water = Math.round((rice * Math.round(ratio * 1000)) / 1000);
  return { ratio, water, target: rice + water };
}

// 1.25 -> "1 : 1.25". Two decimals, or three if the value has a third.
export function formatRatio(ratio) {
  const thousandths = Math.round(ratio * 1000);
  return `1 : ${(thousandths / 1000).toFixed(thousandths % 10 === 0 ? 2 : 3)}`;
}
