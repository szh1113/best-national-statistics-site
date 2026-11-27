// Japan in Figures — state and small helpers. The site keeps its state in
// memory only (nothing is written to storage), so every visit starts from
// the same figures and the screenshots are reproducible.

import { META, SERIES } from './data.js';

export const State = {
  year: META.defaultYear,
  route: 'overview',
  unit: 'usd', // 'usd' (US$ billion) or 'jpy' (¥ trillion) on the economy view
  chartKind: 'line', // 'line' or 'bar' on the population series
  query: '',
  prefectureQuery: '',
  sortKey: 'pop',
  sortDir: -1,
};

export function setYear(year) {
  const y = Number(year);
  if (META.years.includes(y)) State.year = y;
  return State.year;
}

export function seriesPoints(key) {
  const s = SERIES[key];
  return META.years.map((y) => ({ year: y, value: s.values[y] }));
}

export function valueAt(key, year = State.year) {
  return SERIES[key].values[year];
}

export function tradeBalance(year = State.year) {
  return SERIES.exports.values[year] - SERIES.imports.values[year];
}

// Format a number with thousands separators, up to 2 decimals when needed.
export function fmt(n, decimals) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const d = decimals === undefined ? (Number.isInteger(n) ? 0 : 2) : decimals;
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

// GDP in the unit the economy view is showing.
export function gdpDisplay(year = State.year) {
  const usd = SERIES.gdpNominal.values[year];
  if (State.unit === 'jpy') {
    // ¥ per US$ ≈ 151 in 2024 (Bank of Japan average); shown as an
    // approximation, labelled on the page.
    return { text: '¥' + fmt(usd * 151 / 1000, 1) + ' trillion', note: 'at ≈¥151 per US$' };
  }
  return { text: 'US$' + fmt(usd, 2) + ' trillion', note: 'nominal, IMF' };
}

// All searchable indicators: every year series plus every snapshot.
export function allIndicators() {
  const rows = [];
  for (const [key, s] of Object.entries(SERIES)) {
    rows.push({ key, label: s.label, unit: s.unit, source: s.source, value: s.values[State.year], year: State.year, section: sectionOf(key) });
  }
  return rows;
}

function sectionOf(key) {
  if (['population', 'medianAge', 'share65plus', 'fertility', 'lifeExpectancy'].includes(key)) return 'population';
  if (['gdpNominal', 'gdpPerCapita', 'gdpGrowth', 'unemployment', 'inflation', 'govDebt', 'exports', 'imports', 'labourParticipation'].includes(key)) return 'economy';
  if (key === 'co2') return 'energy';
  return 'overview';
}
