// Japan in Figures — router and wiring. Hash routes pick the section;
// the year picker re-renders every figure; the search boxes and sort
// buttons update their own tables without stealing focus.

import { META, SECTIONS } from './data.js';
import { State, setYear } from './store.js';
import { viewOverview, viewPopulation, viewEconomy, viewEnergy, viewSociety, viewIndicators, sortedPrefectures } from './views.js';
import { allIndicators } from './store.js';

const VIEWS = {
  overview: viewOverview,
  population: viewPopulation,
  economy: viewEconomy,
  energy: viewEnergy,
  society: viewSociety,
  indicators: viewIndicators,
};

const viewEl = document.getElementById('view');
const yearSelect = document.getElementById('year-select');
const nav = document.getElementById('main-nav');

for (const y of META.years) {
  const opt = document.createElement('option');
  opt.value = String(y);
  opt.textContent = String(y);
  if (y === State.year) opt.selected = true;
  yearSelect.appendChild(opt);
}

// ?view=overview (etc.) picks the opening section, e.g. for screenshots.
const params = new URLSearchParams(window.location.search);
const startView = params.get('view');
if (startView && VIEWS[startView] && !window.location.hash) {
  window.location.hash = '#/' + startView;
}

function routeFromHash() {
  const m = window.location.hash.match(/^#\/([a-z]+)/);
  return m && VIEWS[m[1]] ? m[1] : 'overview';
}

export function render() {
  State.route = routeFromHash();
  viewEl.innerHTML = VIEWS[State.route]();
  yearSelect.value = String(State.year);
  for (const a of nav.querySelectorAll('a')) {
    a.classList.toggle('active', a.dataset.route === State.route);
  }
  window.scrollTo(0, 0);
}

function refreshPrefTable() {
  const body = document.getElementById('pref-body');
  const count = document.getElementById('pref-count');
  if (!body) return;
  const rows = sortedPrefectures();
  body.innerHTML = rows.map((p) =>
    `<tr><td>${esc(p.name)}</td><td>${esc(p.region)}</td><td>${p.pop.toFixed(1)}</td></tr>`).join('') ||
    '<tr><td colspan="3">No prefecture matches that filter.</td></tr>';
  if (count) count.textContent = `${rows.length} of 47 prefectures shown`;
}

function refreshIndicatorTable() {
  const body = document.getElementById('ind-body');
  const count = document.getElementById('ind-count');
  if (!body) return;
  const q = State.query.trim().toLowerCase();
  const rows = allIndicators().filter((r) => !q || r.label.toLowerCase().includes(q) || r.unit.toLowerCase().includes(q) || r.source.toLowerCase().includes(q));
  body.innerHTML = rows.map((r) =>
    `<tr><td><a href="#/${r.section}">${esc(r.label)}</a></td><td>${fmtNum(r.value)}</td><td>${esc(r.unit)}</td><td>${r.year}</td><td>${esc(r.source)}</td></tr>`).join('') ||
    '<tr><td colspan="5">Nothing matches that search — try a shorter word.</td></tr>';
  if (count) count.textContent = `${rows.length} of ${allIndicators().length} indicators shown · year ${State.year}`;
}

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtNum(n) {
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
}

yearSelect.addEventListener('change', () => {
  setYear(yearSelect.value);
  render();
});

window.addEventListener('hashchange', render);

viewEl.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'chart-kind') {
    State.chartKind = btn.dataset.kind;
    render();
  } else if (action === 'unit') {
    State.unit = btn.dataset.unit;
    render();
  } else if (action === 'sort-pref') {
    const key = btn.dataset.key;
    if (State.sortKey === key) {
      State.sortDir = -State.sortDir;
    } else {
      State.sortKey = key;
      State.sortDir = key === 'pop' ? -1 : 1;
    }
    render();
  }
});

viewEl.addEventListener('input', (ev) => {
  if (ev.target.id === 'pref-q') {
    State.prefectureQuery = ev.target.value;
    refreshPrefTable();
  } else if (ev.target.id === 'ind-q') {
    State.query = ev.target.value;
    refreshIndicatorTable();
  }
});

render();

// Test hook: the play-test driver reads the live state through this.
window.__japan = {
  state() {
    return {
      year: State.year,
      route: State.route,
      unit: State.unit,
      chartKind: State.chartKind,
      prefCount: sortedPrefectures().length,
      indCount: allIndicators().filter((r) => {
        const q = State.query.trim().toLowerCase();
        return !q || r.label.toLowerCase().includes(q) || r.unit.toLowerCase().includes(q) || r.source.toLowerCase().includes(q);
      }).length,
    };
  },
};
