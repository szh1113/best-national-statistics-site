// Japan in Figures — the hand-in program for the national statistics site.
// Node 22, standard library only. It copies this repository's app/ folder
// (the site itself) and screenshots/ into /output, then writes
// /output/dossier.json with the make.fun library, which is the summary the
// judge reads. The program runs twice in the grader and must write the
// same bytes both times, so it does nothing time- or order-dependent:
// the copy is a plain recursive copy and the dossier is derived from the
// files on disk alone.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps the scorer itself enforces (reference/gate.json): the text cap
// shapes the dossier's bytes; the others refuse an entry the scorer
// would refuse — more than 4 screenshots or one over 256 KiB, more than
// 993 files and directories in app/ or 16 MiB of app files in all.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
