// Wires the form to rice.js. All numbers come from there.
import { RATIOS, parseRice, calculate, formatRatio } from './rice.js';

const EMPTY = '–';

const riceInput = document.getElementById('rice');
const groups = {
  method: document.getElementById('method'),
  type: document.getElementById('type'),
  preference: document.getElementById('preference'),
};
const outputs = {
  target: document.getElementById('target'),
  water: document.getElementById('water'),
  ratio: document.getElementById('ratio'),
};

// "rice-cooker" -> "Rice cooker"
function label(key) {
  const text = key.replaceAll('-', ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function selected(name) {
  return groups[name].querySelector('input:checked')?.value;
}

// Fills a group with one radio button per key and selects the first.
function renderOptions(name, keys) {
  groups[name].replaceChildren(
    ...keys.map((key, index) => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      input.value = key;
      input.id = `${name}-${key}`;
      input.checked = index === 0;
      const optionLabel = document.createElement('label');
      optionLabel.htmlFor = input.id;
      optionLabel.textContent = label(key);
      const option = document.createElement('div');
      option.className = 'option';
      option.append(input, optionLabel);
      return option;
    }),
  );
}

function renderTypes() {
  renderOptions('type', Object.keys(RATIOS[selected('method')]));
  renderPreferences();
}

function renderPreferences() {
  renderOptions('preference', Object.keys(RATIOS[selected('method')][selected('type')]));
}

function update() {
  const rice = parseRice(riceInput.value);
  const result =
    rice === null
      ? null
      : calculate({
          rice,
          method: selected('method'),
          type: selected('type'),
          preference: selected('preference'),
        });

  const isInvalid = rice === null && riceInput.value.trim() !== '';
  riceInput.setAttribute('aria-invalid', String(isInvalid));

  outputs.target.textContent = result ? `${result.target} g` : EMPTY;
  outputs.water.textContent = result ? `${result.water} g` : EMPTY;
  outputs.ratio.textContent = result ? formatRatio(result.ratio) : EMPTY;
}

renderOptions('method', Object.keys(RATIOS));
renderTypes();

groups.method.addEventListener('change', () => {
  renderTypes();
  update();
});
groups.type.addEventListener('change', () => {
  renderPreferences();
  update();
});
groups.preference.addEventListener('change', update);
riceInput.addEventListener('input', update);
document.getElementById('form').addEventListener('submit', (event) => event.preventDefault());

update();
