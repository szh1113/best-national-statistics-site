// Japan in Figures — the numbers behind the site.
// Every figure is a rounded public statistic with its source and year.
// Values are approximate (marked with ≈ on the site) because official
// series are revised; the point is the shape of the country, not the
// third decimal. Sources: World Bank, IMF World Economic Outlook,
// OECD, UN World Population Prospects, Statistics Bureau of Japan,
// Ministry of Finance (trade), Agency for Natural Resources and Energy,
// Ministry of Health, Labour and Welfare, Ministry of the Environment.

export const META = {
  country: 'Japan',
  countryJa: '日本',
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  defaultYear: 2024,
  updated: 'November 2026',
};

// Year series. Each entry: { value, unit, source } per year.
export const SERIES = {
  population: {
    label: 'Population',
    unit: 'million people',
    source: 'Statistics Bureau of Japan, population estimates',
    values: { 2019: 126.3, 2020: 126.1, 2021: 125.5, 2022: 124.9, 2023: 124.4, 2024: 123.8 },
  },
  gdpNominal: {
    label: 'GDP, nominal',
    unit: 'US$ trillion',
    source: 'IMF World Economic Outlook',
    values: { 2019: 5.12, 2020: 5.06, 2021: 5.04, 2022: 4.26, 2023: 4.21, 2024: 4.03 },
  },
  gdpPerCapita: {
    label: 'GDP per capita',
    unit: 'US$',
    source: 'IMF World Economic Outlook',
    values: { 2019: 40550, 2020: 40130, 2021: 40180, 2022: 34120, 2023: 33790, 2024: 32560 },
  },
  gdpGrowth: {
    label: 'Real GDP growth',
    unit: '% per year',
    source: 'IMF World Economic Outlook',
    values: { 2019: -0.4, 2020: -4.2, 2021: 2.6, 2022: 0.9, 2023: 1.7, 2024: -0.1 },
  },
  unemployment: {
    label: 'Unemployment rate',
    unit: '% of labour force',
    source: 'Statistics Bureau of Japan, Labour Force Survey',
    values: { 2019: 2.4, 2020: 2.8, 2021: 2.8, 2022: 2.6, 2023: 2.6, 2024: 2.5 },
  },
  inflation: {
    label: 'Consumer price inflation',
    unit: '% per year',
    source: 'Statistics Bureau of Japan, CPI',
    values: { 2019: 0.5, 2020: 0.0, 2021: -0.2, 2022: 2.5, 2023: 3.3, 2024: 2.7 },
  },
  govDebt: {
    label: 'General government gross debt',
    unit: '% of GDP',
    source: 'IMF World Economic Outlook',
    values: { 2019: 236, 2020: 259, 2021: 255, 2022: 255, 2023: 252, 2024: 237 },
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    source: 'World Bank / Ministry of Health, Labour and Welfare',
    values: { 2019: 84.6, 2020: 84.6, 2021: 84.0, 2022: 84.0, 2023: 84.0, 2024: 84.0 },
  },
  fertility: {
    label: 'Total fertility rate',
    unit: 'children per woman',
    source: 'Ministry of Health, Labour and Welfare, vital statistics',
    values: { 2019: 1.36, 2020: 1.33, 2021: 1.3, 2022: 1.26, 2023: 1.2, 2024: 1.15 },
  },
  share65plus: {
    label: 'Population aged 65 and over',
    unit: '% of population',
    source: 'Statistics Bureau of Japan',
    values: { 2019: 28.4, 2020: 28.7, 2021: 29.0, 2022: 29.1, 2023: 29.2, 2024: 29.3 },
  },
  medianAge: {
    label: 'Median age',
    unit: 'years',
    source: 'UN World Population Prospects',
    values: { 2019: 48.4, 2020: 48.6, 2021: 48.9, 2022: 49.1, 2023: 49.5, 2024: 49.9 },
  },
  exports: {
    label: 'Exports of goods',
    unit: 'US$ billion',
    source: 'Ministry of Finance, trade statistics',
    values: { 2019: 706, 2020: 641, 2021: 756, 2022: 746, 2023: 718, 2024: 698 },
  },
  imports: {
    label: 'Imports of goods',
    unit: 'US$ billion',
    source: 'Ministry of Finance, trade statistics',
    values: { 2019: 721, 2020: 635, 2021: 769, 2022: 898, 2023: 756, 2024: 727 },
  },
  co2: {
    label: 'Energy-related CO2 emissions',
    unit: 'million tonnes',
    source: 'Ministry of the Environment',
    values: { 2019: 1114, 2020: 1046, 2021: 1080, 2022: 1057, 2023: 1010, 2024: 990 },
  },
  labourParticipation: {
    label: 'Labour force participation, ages 15–64',
    unit: '% of age group',
    source: 'OECD',
    values: { 2019: 79.1, 2020: 78.6, 2021: 79.0, 2022: 79.5, 2023: 80.0, 2024: 80.2 },
  },
};

// Single-year snapshots (latest year) with a short note each.
export const SNAPSHOTS = {
  healthSpending: { label: 'Health spending', value: 11.1, unit: '% of GDP', year: 2022, source: 'OECD Health Statistics' },
  doctors: { label: 'Practising doctors', value: 2.6, unit: 'per 1,000 people', year: 2022, source: 'OECD Health Statistics' },
  hospitalBeds: { label: 'Hospital beds', value: 12.6, unit: 'per 1,000 people', year: 2022, source: 'OECD Health Statistics' },
  infantMortality: { label: 'Infant mortality', value: 1.7, unit: 'per 1,000 live births', year: 2023, source: 'Ministry of Health, Labour and Welfare' },
  tertiary: { label: 'Tertiary attainment, ages 25–34', value: 65, unit: '% of age group', year: 2023, source: 'OECD Education at a Glance' },
  pisaMaths: { label: 'PISA mathematics score', value: 536, unit: 'points', year: 2022, source: 'OECD PISA' },
  pisaReading: { label: 'PISA reading score', value: 516, unit: 'points', year: 2022, source: 'OECD PISA' },
  pisaScience: { label: 'PISA science score', value: 547, unit: 'points', year: 2022, source: 'OECD PISA' },
  hoursWorked: { label: 'Average hours worked', value: 1611, unit: 'hours per worker per year', year: 2023, source: 'OECD' },
  femaleParticipation: { label: 'Female labour participation, 15–64', value: 77.0, unit: '% of age group', year: 2023, source: 'OECD' },
};

// Age structure, 2024 (share of population, %).
export const AGE_STRUCTURE = [
  { group: 'Ages 0–14', share: 11.2, note: 'Children' },
  { group: 'Ages 15–64', share: 59.5, note: 'Working age' },
  { group: 'Ages 65+', share: 29.3, note: 'Older people' },
];

// GDP by sector, 2023 (share of gross value added, %).
export const SECTORS = [
  { name: 'Services', share: 69.8 },
  { name: 'Industry', share: 29.0 },
  { name: 'Agriculture, forestry & fishing', share: 1.2 },
];

// Exports by product group, 2024 (share of goods exports, %).
export const EXPORT_MIX = [
  { name: 'Machinery & equipment', share: 19 },
  { name: 'Electrical machinery', share: 17 },
  { name: 'Motor vehicles', share: 15 },
  { name: 'Chemicals', share: 11 },
  { name: 'Iron & steel', share: 5 },
  { name: 'All other goods', share: 33 },
];

// Electricity generation mix, 2023 (share, %).
export const ENERGY_MIX = [
  { name: 'LNG (gas)', share: 34, kind: 'fossil' },
  { name: 'Coal', share: 29, kind: 'fossil' },
  { name: 'Solar', share: 11, kind: 'renewable' },
  { name: 'Nuclear', share: 8, kind: 'low-carbon' },
  { name: 'Hydro', share: 8, kind: 'renewable' },
  { name: 'Biomass', share: 5, kind: 'renewable' },
  { name: 'Oil', share: 4, kind: 'fossil' },
  { name: 'Wind & geothermal', share: 1, kind: 'renewable' },
];
export const ENERGY_SOURCE = 'Agency for Natural Resources and Energy, 2023';

// Population by prefecture, 2024 estimates (millions). Source: Statistics Bureau of Japan.
export const PREFECTURES = [
  { name: 'Tokyo', pop: 14.1, region: 'Kanto' },
  { name: 'Kanagawa', pop: 9.2, region: 'Kanto' },
  { name: 'Osaka', pop: 8.8, region: 'Kansai' },
  { name: 'Aichi', pop: 7.5, region: 'Chubu' },
  { name: 'Saitama', pop: 7.3, region: 'Kanto' },
  { name: 'Chiba', pop: 6.3, region: 'Kanto' },
  { name: 'Hyogo', pop: 5.4, region: 'Kansai' },
  { name: 'Hokkaido', pop: 5.1, region: 'Hokkaido' },
  { name: 'Fukuoka', pop: 5.1, region: 'Kyushu' },
  { name: 'Shizuoka', pop: 3.5, region: 'Chubu' },
  { name: 'Ibaraki', pop: 2.8, region: 'Kanto' },
  { name: 'Hiroshima', pop: 2.7, region: 'Chugoku' },
  { name: 'Kyoto', pop: 2.5, region: 'Kansai' },
  { name: 'Miyagi', pop: 2.2, region: 'Tohoku' },
  { name: 'Niigata', pop: 2.1, region: 'Chubu' },
  { name: 'Nagano', pop: 2.0, region: 'Chubu' },
  { name: 'Gifu', pop: 1.9, region: 'Chubu' },
  { name: 'Gunma', pop: 1.9, region: 'Kanto' },
  { name: 'Tochigi', pop: 1.9, region: 'Kanto' },
  { name: 'Okayama', pop: 1.8, region: 'Chugoku' },
  { name: 'Fukushima', pop: 1.8, region: 'Tohoku' },
  { name: 'Mie', pop: 1.7, region: 'Chubu' },
  { name: 'Kumamoto', pop: 1.7, region: 'Kyushu' },
  { name: 'Kagoshima', pop: 1.5, region: 'Kyushu' },
  { name: 'Okinawa', pop: 1.5, region: 'Kyushu' },
  { name: 'Shiga', pop: 1.4, region: 'Kansai' },
  { name: 'Ehime', pop: 1.3, region: 'Shikoku' },
  { name: 'Nara', pop: 1.3, region: 'Kansai' },
  { name: 'Yamaguchi', pop: 1.3, region: 'Chugoku' },
  { name: 'Aomori', pop: 1.2, region: 'Tohoku' },
  { name: 'Iwate', pop: 1.2, region: 'Tohoku' },
  { name: 'Nagasaki', pop: 1.2, region: 'Kyushu' },
  { name: 'Oita', pop: 1.1, region: 'Kyushu' },
  { name: 'Ishikawa', pop: 1.1, region: 'Chubu' },
  { name: 'Miyazaki', pop: 1.0, region: 'Kyushu' },
  { name: 'Yamagata', pop: 1.0, region: 'Tohoku' },
  { name: 'Toyama', pop: 1.0, region: 'Chubu' },
  { name: 'Akita', pop: 0.9, region: 'Tohoku' },
  { name: 'Wakayama', pop: 0.9, region: 'Kansai' },
  { name: 'Kagawa', pop: 0.9, region: 'Shikoku' },
  { name: 'Yamanashi', pop: 0.8, region: 'Chubu' },
  { name: 'Saga', pop: 0.8, region: 'Kyushu' },
  { name: 'Tokushima', pop: 0.7, region: 'Shikoku' },
  { name: 'Fukui', pop: 0.7, region: 'Chubu' },
  { name: 'Kochi', pop: 0.7, region: 'Shikoku' },
  { name: 'Shimane', pop: 0.6, region: 'Chugoku' },
  { name: 'Tottori', pop: 0.5, region: 'Chugoku' },
];

// Sections of the site, in nav order.
export const SECTIONS = [
  { id: 'overview', name: 'Overview', blurb: 'The country at a glance' },
  { id: 'population', name: 'Population', blurb: 'People, age and where they live' },
  { id: 'economy', name: 'Economy', blurb: 'GDP, growth, trade and debt' },
  { id: 'energy', name: 'Energy & Environment', blurb: 'Power mix and emissions' },
  { id: 'society', name: 'Health, Education & Work', blurb: 'How people live and work' },
  { id: 'indicators', name: 'Indicator Index', blurb: 'Every figure, searchable' },
];
