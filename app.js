// Wires the form to rice.js. All numbers come from there.
import { RATIOS, TYPE_GROUPS, parseRice, calculate, formatRatio } from './rice.js';

const EMPTY = '–';
const STORAGE_KEY = 'watericeio';

const riceInput = document.getElementById('rice');
const typeSelect = document.getElementById('type');
const results = document.getElementById('results');
const groups = {
  preference: document.getElementById('preference'),
  method: document.getElementById('method'),
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

// The last rice, preference and method, kept in this browser only.
// Storage can be unavailable (private browsing, blocked site data); the page then starts on the defaults.
function loadChoices() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveChoices() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        type: typeSelect.value,
        preference: selected('preference'),
        method: selected('method'),
      }),
    );
  } catch {
    // Nothing to do: the choice just isn't remembered.
  }
}

function selected(name) {
  return groups[name].querySelector('input:checked')?.value;
}

// Fills a toggle with one radio button per key. Selects `preferred` if it is one of the keys, else the first.
function renderToggle(name, keys, preferred) {
  const checkedKey = keys.includes(preferred) ? preferred : keys[0];
  groups[name].replaceChildren(
    ...keys.map((key) => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      input.value = key;
      input.id = `${name}-${key}`;
      input.checked = key === checkedKey;
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

function renderTypes(preferred) {
  typeSelect.replaceChildren(
    ...TYPE_GROUPS.map((group) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = group.label;
      optgroup.append(
        ...group.types.map((type) => {
          const option = document.createElement('option');
          option.value = type;
          option.textContent = `${label(type)} rice`;
          return option;
        }),
      );
      return optgroup;
    }),
  );
  const types = TYPE_GROUPS.flatMap((group) => group.types);
  typeSelect.value = types.includes(preferred) ? preferred : types[0];
}

function renderPreferences(preferred) {
  renderToggle('preference', Object.keys(RATIOS[selected('method')][typeSelect.value]), preferred);
}

// A select is as wide as its longest option. Shrink it to the chosen one so the sentence stays on one line.
const probe = document.createElement('span');
probe.className = 'select-probe';
probe.setAttribute('aria-hidden', 'true');
typeSelect.after(probe);

function fitTypeSelect() {
  probe.textContent = typeSelect.selectedOptions[0]?.textContent ?? '';
  typeSelect.style.width = `${Math.ceil(probe.getBoundingClientRect().width)}px`;
}

function update() {
  const rice = parseRice(riceInput.value);
  const result =
    rice === null
      ? null
      : calculate({
          rice,
          method: selected('method'),
          type: typeSelect.value,
          preference: selected('preference'),
        });

  const isInvalid = rice === null && riceInput.value.trim() !== '';
  riceInput.setAttribute('aria-invalid', String(isInvalid));

  // The results appear with the first valid amount and stay from then on.
  if (result) results.hidden = false;

  outputs.target.textContent = result ? `${result.target} g` : EMPTY;
  outputs.water.textContent = result ? `${result.water} g` : EMPTY;
  outputs.ratio.textContent = result ? formatRatio(result.ratio) : EMPTY;
}

const remembered = loadChoices();
renderToggle('method', Object.keys(RATIOS), remembered.method);
renderTypes(remembered.type);
renderPreferences(remembered.preference);
fitTypeSelect();

typeSelect.addEventListener('change', () => {
  renderPreferences();
  fitTypeSelect();
  saveChoices();
  update();
});
groups.method.addEventListener('change', () => {
  // Every method lists the same types and preferences, so the current choice carries over.
  renderPreferences(selected('preference'));
  saveChoices();
  update();
});
groups.preference.addEventListener('change', () => {
  saveChoices();
  update();
});
riceInput.addEventListener('input', update);
document.getElementById('form').addEventListener('submit', (event) => event.preventDefault());

update();
