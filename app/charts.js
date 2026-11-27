// Japan in Figures — small SVG chart builders. No libraries, no network:
// every chart is drawn from the numbers in data.js as inline SVG.

const INK = '#1b2a4a';
const RED = '#c0392b';
const TEAL = '#2a7f6f';
const GOLD = '#c98a1b';
const SLATE = '#7a8699';
const GRID = '#e3e0d8';

// Palette cycled across donut slices.
export const SLICE_COLORS = ['#c0392b', '#1b2a4a', '#2a7f6f', '#c98a1b', '#5b7ba6', '#8a6d9e', '#4a9e8f', '#b0583a'];

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceMax(max) {
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

// Line chart for a year series. points: [{year, value}], width/height in px.
export function lineChart(points, opts = {}) {
  const w = opts.width || 560;
  const h = opts.height || 220;
  const padL = 52;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const values = points.map((p) => p.value);
  const min = Math.min(0, ...values);
  const max = niceMax(Math.max(...values) * 1.05);
  const x = (i) => padL + (i / (points.length - 1)) * iw;
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const color = opts.color || RED;
  const gridLines = [0, 0.5, 1].map((f) => {
    const v = min + (max - min) * f;
    const yy = y(v);
    return `<line x1="${padL}" y1="${yy}" x2="${w - padR}" y2="${yy}" stroke="${GRID}" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="11" fill="${SLATE}">${fmtTick(v)}</text>`;
  }).join('');
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const dots = points.map((p, i) =>
    `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2"/>`).join('');
  const labels = points.map((p, i) =>
    `<text x="${x(i)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="${SLATE}">${p.year}</text>`).join('');
  const last = points[points.length - 1];
  const valueLabel = `<text x="${x(points.length - 1)}" y="${y(last.value) - 10}" text-anchor="end" font-size="12" font-weight="700" fill="${color}">${fmtTick(last.value)}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Line chart, ${esc(opts.label || '')}" class="chart-svg">${gridLines}<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>${dots}${labels}${valueLabel}</svg>`;
}

// Vertical bar chart for a year series.
export function barChart(points, opts = {}) {
  const w = opts.width || 560;
  const h = opts.height || 220;
  const padL = 52;
  const padR = 14;
  const padT = 22;
  const padB = 30;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const values = points.map((p) => p.value);
  const min = Math.min(0, ...values);
  const max = niceMax(Math.max(...values) * 1.08);
  const slot = iw / points.length;
  const bw = Math.min(46, slot * 0.62);
  const color = opts.color || INK;
  const negColor = opts.negColor || RED;
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const zeroY = y(0);
  const gridLines = [0, 0.5, 1].map((f) => {
    const v = min + (max - min) * f;
    const yy = y(v);
    return `<line x1="${padL}" y1="${yy}" x2="${w - padR}" y2="${yy}" stroke="${GRID}" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="11" fill="${SLATE}">${fmtTick(v)}</text>`;
  }).join('');
  const bars = points.map((p, i) => {
    const bx = padL + i * slot + (slot - bw) / 2;
    const by = p.value >= 0 ? y(p.value) : zeroY;
    const bh = Math.abs(y(p.value) - zeroY);
    const fill = p.value < 0 ? negColor : color;
    return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(bh, 1).toFixed(1)}" rx="2" fill="${fill}"/>` +
      `<text x="${(bx + bw / 2).toFixed(1)}" y="${(p.value >= 0 ? by - 5 : by + bh + 13).toFixed(1)}" text-anchor="middle" font-size="11" fill="${INK}">${fmtTick(p.value)}</text>` +
      `<text x="${(bx + bw / 2).toFixed(1)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="${SLATE}">${p.year}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Bar chart, ${esc(opts.label || '')}" class="chart-svg">${gridLines}${bars}</svg>`;
}

// Donut chart for shares. slices: [{name, share}]. Returns svg + legend html.
export function donutChart(slices, opts = {}) {
  const size = opts.size || 220;
  const r = size / 2 - 12;
  const hole = r * 0.58;
  const cx = size / 2;
  const cy = size / 2;
  const total = slices.reduce((s, d) => s + d.share, 0);
  let angle = -90;
  const paths = slices.map((d, i) => {
    const frac = d.share / total;
    const a0 = (angle * Math.PI) / 180;
    const a1 = ((angle + frac * 360) * Math.PI) / 180;
    angle += frac * 360;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const ix1 = cx + hole * Math.cos(a1);
    const iy1 = cy + hole * Math.sin(a1);
    const ix0 = cx + hole * Math.cos(a0);
    const iy0 = cy + hole * Math.sin(a0);
    const color = SLICE_COLORS[i % SLICE_COLORS.length];
    return `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${ix1.toFixed(1)},${iy1.toFixed(1)} A${hole},${hole} 0 ${large} 0 ${ix0.toFixed(1)},${iy0.toFixed(1)} Z" fill="${color}"/>`;
  }).join('');
  const legend = slices.map((d, i) =>
    `<li><span class="swatch" style="background:${SLICE_COLORS[i % SLICE_COLORS.length]}"></span>${esc(d.name)} — <strong>${d.share}%</strong></li>`).join('');
  const center = opts.center
    ? `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}">${esc(opts.center)}</text>` +
      `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="${SLATE}">${esc(opts.centerSub || '')}</text>`
    : '';
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Donut chart, ${esc(opts.label || '')}" class="chart-svg donut">${paths}${center}</svg><ul class="legend">${legend}</ul></div>`;
}

function fmtTick(v) {
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString('en-US');
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 10) / 10);
}
