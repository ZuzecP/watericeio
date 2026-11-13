import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RATIOS, MAX_RICE, parseRice, calculate, formatRatio } from '../rice.js';

const METHOD = 'rice-cooker';

// [type, preference, ratio, water at 300 g, water at 157 g]
const COMBINATIONS = [
  ['jasmine', 'fluffy', 1.4, 420, 220],
  ['jasmine', 'grainy', 1.25, 375, 196],
  ['basmati', 'fluffy', 1.9, 570, 298],
  ['basmati', 'grainy', 1.65, 495, 259],
  ['sushi', 'rolling', 1.25, 375, 196],
  ['sushi', 'onigiri', 1.35, 405, 212],
  ['sushi', 'poke', 1.3, 390, 204],
];

for (const [type, preference, ratio, water300, water157] of COMBINATIONS) {
  test(`${type} ${preference}: 300 g rice`, () => {
    assert.deepEqual(calculate({ rice: 300, method: METHOD, type, preference }), {
      ratio,
      water: water300,
      target: 300 + water300,
    });
  });

  test(`${type} ${preference}: 157 g rice`, () => {
    assert.deepEqual(calculate({ rice: 157, method: METHOD, type, preference }), {
      ratio,
      water: water157,
      target: 157 + water157,
    });
  });
}

test('the table has exactly the 7 rice cooker combinations', () => {
  assert.deepEqual(Object.keys(RATIOS), [METHOD]);
  const found = [];
  for (const [type, preferences] of Object.entries(RATIOS[METHOD])) {
    for (const preference of Object.keys(preferences)) found.push(`${type} ${preference}`);
  }
  assert.deepEqual(found.sort(), COMBINATIONS.map(([t, p]) => `${t} ${p}`).sort());
});

test('preferences are listed in display order', () => {
  assert.deepEqual(Object.keys(RATIOS[METHOD]), ['jasmine', 'basmati', 'sushi']);
  assert.deepEqual(Object.keys(RATIOS[METHOD].jasmine), ['fluffy', 'grainy']);
  assert.deepEqual(Object.keys(RATIOS[METHOD].basmati), ['fluffy', 'grainy']);
  assert.deepEqual(Object.keys(RATIOS[METHOD].sushi), ['rolling', 'onigiri', 'poke']);
});

test('half a gram of water rounds up', () => {
  // 10 x 1.65 = 16.5
  const result = calculate({ rice: 10, method: METHOD, type: 'basmati', preference: 'grainy' });
  assert.equal(result.water, 17);
  assert.equal(result.target, 27);
});

test('water below half a gram rounds down', () => {
  // 1 x 1.25 = 1.25
  const result = calculate({ rice: 1, method: METHOD, type: 'jasmine', preference: 'grainy' });
  assert.equal(result.water, 1);
  assert.equal(result.target, 2);
});

test('target is always rice plus water, in whole grams', () => {
  for (const [type, preference] of COMBINATIONS) {
    for (const rice of [1, 10, 157, MAX_RICE]) {
      const { water, target } = calculate({ rice, method: METHOD, type, preference });
      assert.ok(Number.isInteger(water), `${type} ${preference} ${rice}: water`);
      assert.equal(target, rice + water, `${type} ${preference} ${rice}: target`);
    }
  }
});

test('the upper limit is 1999 g', () => {
  assert.equal(MAX_RICE, 1999);
});

for (const [input, expected] of [
  ['300', 300],
  [' 300 ', 300],
  ['0300', 300],
  ['1', 1],
  ['1999', 1999],
]) {
  test(`parseRice accepts ${JSON.stringify(input)}`, () => {
    assert.equal(parseRice(input), expected);
  });
}

for (const input of [
  '',
  '   ',
  '0',
  '-5',
  'abc',
  '12a',
  '300.5',
  '300,5',
  '1e3',
  '+300',
  '0x10',
  '2000',
  '99999',
]) {
  test(`parseRice rejects ${JSON.stringify(input)}`, () => {
    assert.equal(parseRice(input), null);
  });
}

for (const rice of [0, -1, 2000, 300.5, NaN, '300', null, undefined]) {
  test(`calculate rejects rice ${JSON.stringify(rice) ?? String(rice)}`, () => {
    assert.equal(calculate({ rice, method: METHOD, type: 'jasmine', preference: 'fluffy' }), null);
  });
}

test('calculate rejects an unknown method', () => {
  assert.equal(calculate({ rice: 300, method: 'stovetop', type: 'jasmine', preference: 'fluffy' }), null);
});

test('calculate rejects an unknown type', () => {
  assert.equal(calculate({ rice: 300, method: METHOD, type: 'brown', preference: 'fluffy' }), null);
});

test('calculate rejects a preference that belongs to another type', () => {
  assert.equal(calculate({ rice: 300, method: METHOD, type: 'jasmine', preference: 'poke' }), null);
});

test('calculate rejects names inherited from Object', () => {
  assert.equal(calculate({ rice: 300, method: 'toString', type: 'jasmine', preference: 'fluffy' }), null);
  assert.equal(calculate({ rice: 300, method: METHOD, type: 'jasmine', preference: 'constructor' }), null);
});

test('formatRatio shows two decimals', () => {
  assert.equal(formatRatio(1.25), '1 : 1.25');
  assert.equal(formatRatio(1.9), '1 : 1.90');
  assert.equal(formatRatio(2), '1 : 2.00');
});

test('formatRatio shows a third decimal only when the value has one', () => {
  assert.equal(formatRatio(1.375), '1 : 1.375');
});
