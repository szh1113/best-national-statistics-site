// Japan in Figures — one render function per section. Each view is plain
// HTML built from the numbers in data.js for the selected year; every
// control on the page is wired up in main.js.

import { META, SERIES, SNAPSHOTS, AGE_STRUCTURE, SECTORS, EXPORT_MIX, ENERGY_MIX, ENERGY_SOURCE, PREFECTURES, SECTIONS, COMPARISON, COMPARISON_SOURCE, AT_A_GLANCE } from './data.js';
import { State, seriesPoints, valueAt, tradeBalance, fmt, gdpDisplay, allIndicators } from './store.js';
import { lineChart, barChart, donutChart } from './charts.js';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function yearNote() {
  return `<p class="year-note">Showing figures for <strong>${State.year}</strong>. Change the year above — everything on this page updates.</p>`;
}

function atAGlance() {
  return `<dl class="glance">${AT_A_GLANCE.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>`;
}

function sourceLine(source, year) {
  return `<p class="source">Source: ${esc(source)}${year ? `, ${year}` : ''}. Figures are rounded and marked ≈ where the source publishes them that way.</p>`;
}

function statCard(label, value, unit, source) {
  return `<article class="stat-card"><div class="stat-value">${value}</div><div class="stat-label">${esc(label)}</div><div class="stat-unit">${esc(unit)} · ${esc(source)}</div></article>`;
}

function sectionCards() {
  return SECTIONS.filter((s) => s.id !== 'overview' && s.id !== 'indicators').map((s) =>
    `<a class="topic-card" href="#/${s.id}"><span class="topic-name">${esc(s.name)}</span><span class="topic-blurb">${esc(s.blurb)}</span><span class="topic-go">Explore →</span></a>`).join('');
}

function seriesTable(key) {
  const s = SERIES[key];
  const rows = META.years.map((y) =>
    `<tr${y === State.year ? ' class="current-year"' : ''}><td>${y}</td><td>${fmt(s.values[y])}</td></tr>`).join('');
  return `<table class="data-table"><thead><tr><th>Year</th><th>${esc(s.label)} (${esc(s.unit)})</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function viewOverview() {
  const y = State.year;
  const pop = valueAt('population', y);
  const gdp = gdpDisplay(y);
  const prevPop = y > META.years[0] ? valueAt('population', y - 1) : null;
  const popChange = prevPop === null ? '' : ` (${pop < prevPop ? '▼' : '▲'} ${fmt(Math.abs(pop - prevPop), 1)}m on ${y - 1})`;
  return `
  <section class="hero">
    <p class="eyebrow">Japan · 日本 · A country in numbers</p>
    <h1>Japan in Figures</h1>
    <p class="lede">How many people live there, how the economy is doing, what powers the country, and how long people live — every figure sourced.</p>
    ${yearNote()}
    ${atAGlance()}
  </section>
  <section class="stat-grid" aria-label="Key figures">
    ${statCard('Population', '≈ ' + fmt(pop, 1) + 'm', 'million people' + popChange, 'Statistics Bureau of Japan')}
    ${statCard('GDP', gdp.text, gdp.note, State.unit === 'jpy' ? 'Cabinet Office, national accounts' : 'IMF World Economic Outlook, October 2026')}
    ${statCard('GDP per capita', 'US$' + fmt(valueAt('gdpPerCapita', y)), 'nominal', 'IMF World Economic Outlook, October 2026')}
    ${statCard('Unemployment', fmt(valueAt('unemployment', y), 1) + '%', 'of the labour force', 'Labour Force Survey')}
    ${statCard('Life expectancy', fmt(valueAt('lifeExpectancy', y), 1) + ' years', 'at birth', 'World Bank / MHLW')}
    ${statCard('Aged 65 and over', fmt(valueAt('share65plus', y), 1) + '%', 'of the population', 'Statistics Bureau of Japan')}
  </section>
  <div class="chart-row">
    <section class="panel"><h2>Population is shrinking</h2>
      ${lineChart(seriesPoints('population'), { label: 'Population 2019–2024', color: '#c0392b' })}
      ${sourceLine(SERIES.population.source, '2019–2024')}
    </section>
    <section class="panel"><h2>GDP in US dollars</h2>
      ${barChart(seriesPoints('gdpNominal'), { label: 'Nominal GDP 2019–2024', color: '#1b2a4a' })}
      ${sourceLine(SERIES.gdpNominal.source, '2019–2024')}
      <p class="note">The 2022 drop is mostly the yen: in yen, GDP kept growing. Switch to ¥ on the Economy page.</p>
    </section>
  </div>
  <section class="panel"><h2>Explore by topic</h2><div class="topic-grid">${sectionCards()}</div></section>
  <section class="panel"><h2>Three things to know first</h2>
    <ol class="facts">
      <li><strong>The oldest big country.</strong> Nearly 3 in 10 people are 65 or older (${fmt(valueAt('share65plus', y), 1)}% in ${y}) and the median age is ${fmt(valueAt('medianAge', y), 1)} — the highest of any large economy.</li>
      <li><strong>A big economy, a bigger debt.</strong> GDP is about US$${fmt(valueAt('gdpNominal', y), 2)} trillion, while government debt runs to ${fmt(valueAt('govDebt', y))}% of GDP — the highest in the developed world.</li>
      <li><strong>Long lives, few births.</strong> Life expectancy is ${fmt(valueAt('lifeExpectancy', y), 1)} years, but only ${fmt(valueAt('fertility', y), 2)} children per woman are born — far below the 2.1 needed to hold the population steady.</li>
    </ol>
  </section>`;
}

export function viewPopulation() {
  const y = State.year;
  const chart = State.chartKind === 'bar'
    ? barChart(seriesPoints('population'), { label: 'Population 2019–2024', color: '#1b2a4a' })
    : lineChart(seriesPoints('population'), { label: 'Population 2019–2024', color: '#c0392b' });
  const rows = sortedPrefectures().map((p) =>
    `<tr><td>${esc(p.name)}</td><td>${esc(p.region)}</td><td>${fmt(p.pop, 1)}</td></tr>`).join('');
  return `
  <section class="page-head"><h1>Population</h1><p class="lede">How many people Japan has, how old they are, and where they live.</p>${yearNote()}</section>
  <section class="stat-grid" aria-label="Population figures">
    ${statCard('Population', '≈ ' + fmt(valueAt('population', y), 1) + 'm', 'million people', 'Statistics Bureau of Japan')}
    ${statCard('Median age', fmt(valueAt('medianAge', y), 1) + ' years', 'half the population older', 'UN World Population Prospects')}
    ${statCard('Fertility rate', fmt(valueAt('fertility', y), 2), 'children per woman', 'MHLW vital statistics')}
    ${statCard('Life expectancy', fmt(valueAt('lifeExpectancy', y), 1) + ' years', 'at birth', 'World Bank / MHLW')}
  </section>
  <div class="chart-row">
    <section class="panel"><h2>Population, 2019–${y}</h2>
      <div class="control-row"><span>Chart:</span>
        <button type="button" data-action="chart-kind" data-kind="line" class="${State.chartKind === 'line' ? 'active' : ''}">Line</button>
        <button type="button" data-action="chart-kind" data-kind="bar" class="${State.chartKind === 'bar' ? 'active' : ''}">Bars</button>
      </div>
      ${chart}
      ${sourceLine(SERIES.population.source, '2019–2024')}
    </section>
    <section class="panel"><h2>Age structure, ${y}</h2>
      ${donutChart(AGE_STRUCTURE, { label: 'Age structure', center: fmt(valueAt('share65plus', y), 1) + '%', centerSub: 'aged 65+' })}
      <p class="note">Japan has the world's oldest population: more people over 65 than children under 15 by more than two to one.</p>
      ${sourceLine('Statistics Bureau of Japan', y)}
    </section>
  </div>
  <div class="chart-row">
    <section class="panel"><h2>Population by year</h2>${seriesTable('population')}${sourceLine(SERIES.population.source)}</section>
    <section class="panel"><h2>Where people live — prefectures, ${y}</h2>
      <div class="control-row"><label for="pref-q">Filter prefectures</label>
      <input id="pref-q" type="search" placeholder="Type a name, e.g. Osaka" value="${esc(State.prefectureQuery)}"></div>
      <p class="count-line" id="pref-count">${sortedPrefectures().length} of 47 prefectures shown</p>
      <table class="data-table sortable"><thead><tr>
        <th><button type="button" data-action="sort-pref" data-key="name">Prefecture ${sortArrow('name')}</button></th>
        <th><button type="button" data-action="sort-pref" data-key="region">Region ${sortArrow('region')}</button></th>
        <th><button type="button" data-action="sort-pref" data-key="pop">Population (m) ${sortArrow('pop')}</button></th>
      </tr></thead><tbody id="pref-body">${rows}</tbody></table>
      ${sourceLine('Statistics Bureau of Japan, population estimates', y)}
      <p class="note">Tokyo alone holds about 1 in 9 people in Japan; the three largest prefectures hold more than a quarter of the country.</p>
    </section>
  </div>`;
}

export function sortedPrefectures() {
  const q = State.prefectureQuery.trim().toLowerCase();
  const list = PREFECTURES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q));
  const key = State.sortKey;
  const dir = State.sortDir;
  return list.slice().sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

function sortArrow(key) {
  if (State.sortKey !== key) return '↕';
  return State.sortDir === 1 ? '↑' : '↓';
}

export function viewEconomy() {
  const y = State.year;
  const gdp = gdpDisplay(y);
  const bal = tradeBalance(y);
  const balText = (bal >= 0 ? 'surplus US$' : 'deficit US$') + fmt(Math.abs(bal)) + 'bn';
  return `
  <section class="page-head"><h1>Economy</h1><p class="lede">The world's fourth-largest economy — its size, its growth, what it sells, and what it owes.</p>${yearNote()}</section>
  <section class="stat-grid" aria-label="Economy figures">
    ${statCard('GDP', gdp.text, gdp.note, State.unit === 'jpy' ? 'Cabinet Office, national accounts' : 'IMF World Economic Outlook, October 2026')}
    ${statCard('Real growth', (valueAt('gdpGrowth', y) >= 0 ? '+' : '') + fmt(valueAt('gdpGrowth', y), 1) + '%', 'year on year', 'IMF World Economic Outlook, October 2026')}
    ${statCard('Inflation', fmt(valueAt('inflation', y), 1) + '%', 'consumer prices', 'Statistics Bureau of Japan, CPI')}
    ${statCard('Trade balance', balText, 'goods only', 'Ministry of Finance')}
    ${statCard('Unemployment', fmt(valueAt('unemployment', y), 1) + '%', 'of the labour force', 'Labour Force Survey')}
    ${statCard('Government debt', fmt(valueAt('govDebt', y)) + '% of GDP', 'gross, general government', 'IMF World Economic Outlook, October 2026')}
  </section>
  <div class="chart-row">
    <section class="panel"><h2>GDP, 2019–${y}</h2>
      <div class="control-row"><span>Show GDP in:</span>
        <button type="button" data-action="unit" data-unit="usd" class="${State.unit === 'usd' ? 'active' : ''}">US$</button>
        <button type="button" data-action="unit" data-unit="jpy" class="${State.unit === 'jpy' ? 'active' : ''}">¥</button>
      </div>
      ${barChart(seriesPoints(State.unit === 'jpy' ? 'gdpJpy' : 'gdpNominal'), { label: State.unit === 'jpy' ? 'Nominal GDP 2019–2024, yen' : 'Nominal GDP 2019–2024, US dollars', color: '#1b2a4a' })}
      ${sourceLine(State.unit === 'jpy' ? SERIES.gdpJpy.source : SERIES.gdpNominal.source, '2019–2024')}
      <p class="note">In yen the economy shrank in 2020, then grew every year after; the dollar figure falls in 2022 because the yen weakened sharply.</p>
    </section>
    <section class="panel"><h2>Growth, 2019–${y}</h2>
      ${barChart(seriesPoints('gdpGrowth'), { label: 'Real GDP growth 2019–2024', color: '#2a7f6f', negColor: '#c0392b' })}
      ${sourceLine(SERIES.gdpGrowth.source, '2019–2024')}
      <p class="note">The 2020 bars are the pandemic recession; 2021–2023 the recovery, then near-zero growth in 2024.</p>
    </section>
  </div>
  <div class="chart-row">
    <section class="panel"><h2>What the economy is made of, 2023</h2>
      ${donutChart(SECTORS, { label: 'GDP by sector', center: '70%', centerSub: 'services' })}
      ${sourceLine('World Bank, national accounts', '2023')}
    </section>
    <section class="panel"><h2>What Japan sells abroad, 2024</h2>
      ${donutChart(EXPORT_MIX, { label: 'Exports by product group', center: 'US$707bn', centerSub: 'goods exported' })}
      ${sourceLine('Ministry of Finance, trade statistics', '2024')}
    </section>
  </div>
  <section class="panel"><h2>How Japan compares, 2024</h2>
    <p class="note">The four largest economies, side by side. Japan is fourth by total GDP — and the gap to Germany is about half a trillion dollars.</p>
    <table class="data-table compare"><thead><tr><th>Country</th><th>GDP (US$ trillion)</th><th>Population (million)</th><th>GDP per capita (US$)</th></tr></thead><tbody>
    ${COMPARISON.map((c) => `<tr${c.country === 'Japan' ? ' class="current-year"' : ''}><td>${esc(c.country)}</td><td>${fmt(c.gdp, 2)}</td><td>${fmt(c.pop)}</td><td>${c.country === 'Japan' ? fmt(c.perCapita) : '≈ ' + fmt(c.perCapita)}</td></tr>`).join('')}
    </tbody></table>
    ${sourceLine(COMPARISON_SOURCE)}
  </section>
  <section class="panel"><h2>Trade, 2019–${y} (US$ billion)</h2>
    <table class="data-table"><thead><tr><th>Year</th><th>Exports</th><th>Imports</th><th>Balance</th></tr></thead><tbody>
    ${META.years.map((yr) => {
      const b = SERIES.exports.values[yr] - SERIES.imports.values[yr];
      return `<tr${yr === y ? ' class="current-year"' : ''}><td>${yr}</td><td>${fmt(SERIES.exports.values[yr])}</td><td>${fmt(SERIES.imports.values[yr])}</td><td>${b >= 0 ? '+' : ''}${fmt(b)}</td></tr>`;
    }).join('')}
    </tbody></table>
    ${sourceLine('Ministry of Finance, trade statistics')}
    <p class="note">The goods balance has been in deficit in five of the six years shown — only 2020 was a surplus — and the deficit was deepest in 2022, when energy prices jumped.</p>
  </section>`;
}

export function viewEnergy() {
  const y = State.year;
  return `
  <section class="page-head"><h1>Energy &amp; Environment</h1><p class="lede">What powers Japan and what it costs the climate.</p>${yearNote()}</section>
  <section class="stat-grid" aria-label="Energy figures">
    ${statCard('CO2 emissions', '≈ ' + fmt(valueAt('co2', y)) + ' Mt', 'energy-related · fiscal year', 'Ministry of the Environment')}
    ${statCard('Fossil share of power', '≈ 67%', 'LNG + coal + oil', ENERGY_SOURCE)}
    ${statCard('Renewables share', '≈ 25%', 'of power generation', ENERGY_SOURCE)}
    ${statCard('Nuclear share', '≈ 8%', 'of power generation', ENERGY_SOURCE)}
  </section>
  <div class="chart-row">
    <section class="panel"><h2>How electricity is made, 2023</h2>
      ${donutChart(ENERGY_MIX, { label: 'Electricity generation mix', center: '67%', centerSub: 'fossil fuels' })}
      ${sourceLine(ENERGY_SOURCE)}
      <p class="note">After the 2011 Fukushima accident nuclear power was shut down almost entirely; it has been restarting slowly since 2015, while solar has grown from almost nothing to about a tenth of generation.</p>
    </section>
    <section class="panel"><h2>CO2 emissions are falling</h2>
      ${lineChart(seriesPoints('co2'), { label: 'CO2 emissions, fiscal years 2019–2024', color: '#2a7f6f' })}
      ${sourceLine(SERIES.co2.source, 'fiscal years 2019–2024')}
      <p class="note">Emissions peaked in 2013 and have fallen by about a quarter since, mostly as coal use eases and renewables grow — but Japan still burns more coal per person than most rich countries.</p>
    </section>
  </div>
  <section class="panel"><h2>Energy in context</h2>
    <ul class="facts">
      <li><strong>Almost no fuel of its own.</strong> Japan imports about 87% of its primary energy — LNG from Australia and the Middle East, coal from Australia, oil from the Gulf.</li>
      <li><strong>A 2050 net-zero pledge.</strong> The government has committed to net-zero greenhouse gas emissions by 2050 and a 46% cut on 2013 levels by 2030.</li>
      <li><strong>Solar on every roof.</strong> Japan has more solar capacity per square kilometre than any other large country, much of it on homes and factory roofs.</li>
    </ul>
  </section>`;
}

export function viewSociety() {
  const y = State.year;
  const s = SNAPSHOTS;
  return `
  <section class="page-head"><h1>Health, Education &amp; Work</h1><p class="lede">How people in Japan live, learn and work.</p>${yearNote()}</section>
  <section class="panel"><h2>Health</h2>
    <div class="stat-grid">
      ${statCard('Life expectancy', fmt(valueAt('lifeExpectancy', y), 1) + ' years', 'at birth, ' + y, 'World Bank / MHLW')}
      ${statCard('Health spending', fmt(s.healthSpending.value, 1) + '% of GDP', 'in ' + s.healthSpending.year, s.healthSpending.source)}
      ${statCard('Doctors', fmt(s.doctors.value, 1) + ' per 1,000', 'practising, ' + s.doctors.year, s.doctors.source)}
      ${statCard('Hospital beds', fmt(s.hospitalBeds.value, 1) + ' per 1,000', s.hospitalBeds.year, s.hospitalBeds.source)}
      ${statCard('Infant mortality', fmt(s.infantMortality.value, 1) + ' per 1,000', 'live births, ' + s.infantMortality.year, s.infantMortality.source)}
    </div>
    <p class="note">Japan has the longest life expectancy of any large country and universal health insurance — everyone is covered, and a visit to the doctor costs the patient 30% of the bill.</p>
  </section>
  <section class="panel"><h2>Education</h2>
    <div class="stat-grid">
      ${statCard('Tertiary attainment', fmt(s.tertiary.value) + '%', 'of ages 25–34, ' + s.tertiary.year, s.tertiary.source)}
      ${statCard('PISA maths', fmt(s.pisaMaths.value), 'points, ' + s.pisaMaths.year, s.pisaMaths.source)}
      ${statCard('PISA reading', fmt(s.pisaReading.value), 'points, ' + s.pisaReading.year, s.pisaReading.source)}
      ${statCard('PISA science', fmt(s.pisaScience.value), 'points, ' + s.pisaScience.year, s.pisaScience.source)}
    </div>
    <p class="note">Japanese 15-year-olds score near the top of the OECD in all three PISA subjects, and two in three young adults hold a university or college degree.</p>
  </section>
  <section class="panel"><h2>Work</h2>
    <div class="stat-grid">
      ${statCard('Labour participation', fmt(valueAt('labourParticipation', y), 1) + '%', 'ages 15–64, ' + y, 'OECD')}
      ${statCard('Female participation', fmt(s.femaleParticipation.value, 1) + '%', 'ages 15–64, ' + s.femaleParticipation.year, s.femaleParticipation.source)}
      ${statCard('Unemployment', fmt(valueAt('unemployment', y), 1) + '%', 'of the labour force', 'Labour Force Survey')}
      ${statCard('Hours worked', fmt(s.hoursWorked.value), 'per worker per year, ' + s.hoursWorked.year, s.hoursWorked.source)}
    </div>
    <p class="note">Unemployment is among the lowest in the rich world, but so is the birth rate — and the long-hours culture the country is known for is slowly easing: average hours have fallen by about 10% since 2000.</p>
  </section>`;
}

export function viewIndicators() {
  const q = State.query.trim().toLowerCase();
  const rows = allIndicators().filter((r) => !q || r.label.toLowerCase().includes(q) || r.unit.toLowerCase().includes(q) || r.source.toLowerCase().includes(q));
  const body = rows.map((r) =>
    `<tr><td><a href="#/${r.section}">${esc(r.label)}</a></td><td>${fmt(r.value)}</td><td>${esc(r.unit)}</td><td>${r.year}</td><td>${esc(r.source)}</td></tr>`).join('');
  return `
  <section class="page-head"><h1>Indicator Index</h1><p class="lede">Every figure on this site, in one searchable list. Click a name to jump to its section.</p>${yearNote()}</section>
  <section class="panel">
    <div class="control-row"><label for="ind-q">Search indicators</label>
    <input id="ind-q" type="search" placeholder="Try “GDP”, “fertility” or “World Bank”" value="${esc(State.query)}"></div>
    <p class="count-line" id="ind-count">${rows.length} of ${allIndicators().length} indicators shown · year ${State.year}</p>
    <table class="data-table"><thead><tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Year</th><th>Source</th></tr></thead><tbody id="ind-body">${body || '<tr><td colspan="5">Nothing matches that search — try a shorter word.</td></tr>'}</tbody></table>
    <p class="note">Snapshot figures (health, education) are shown in their own years on the Health, Education &amp; Work page; this index lists the year-by-year series.</p>
  </section>`;
}
