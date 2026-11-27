[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/szh1113/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/szh1113/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# Japan in Figures

A national statistics site for Japan — population, economy, trade, energy,
health, education and work, in one place. Every figure names its source and
its year, and the year picker at the top updates every figure, chart and
table on the page.

## What it does

- **Overview** — the country at a glance: population, GDP, unemployment,
  life expectancy and the share of people over 65, plus population and GDP
  charts and three things to know first.
- **Population** — population trend (line or bar chart), age-structure donut,
  a year-by-year table, and all 47 prefectures in a table you can search
  and sort.
- **Economy** — GDP and growth charts, a US$/¥ toggle, GDP by sector and
  exports by product, and a 2019–2024 trade table.
- **Energy & Environment** — the electricity generation mix, CO2 emissions
  trend, and the context behind them (imports, net-zero pledge, solar).
- **Health, Education & Work** — life expectancy, doctors and hospital beds,
  PISA scores and tertiary attainment, participation and hours worked.
- **Indicator Index** — every figure on the site in one searchable list;
  click a name to jump to its section.

Everything runs from static files (`app/`) with no network request and no
framework. The site keeps its state in memory only — nothing is stored in
the browser — so every visit starts from the same figures.

## Run it

```sh
node serve.mjs        # http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.
