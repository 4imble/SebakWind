// Validates data/state.json and data/log.json against their JSON Schemas,
// plus a few cross-field rules a schema can't express.
// Usage: npm install && npm run validate
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true });
let failed = false;

function check(dataPath, schemaPath) {
  const validate = ajv.compile(read(schemaPath));
  const data = read(dataPath);
  if (!validate(data)) {
    failed = true;
    for (const err of validate.errors) console.error(`${dataPath}${err.instancePath || '/'}: ${err.message}`);
  }
  return data;
}

const state = check('data/state.json', 'data/state.schema.json');
const log = check('data/log.json', 'data/log.schema.json');

const rule = (ok, msg) => { if (!ok) { failed = true; console.error(`data/state.json: ${msg}`); } };
rule(state.vitals.hp_current <= state.vitals.hp_max, 'vitals.hp_current is above hp_max');
rule(state.chakra.current <= state.chakra.max, 'chakra.current is above chakra.max');
if (Array.isArray(log) && log.length > 1) {
  for (let i = 1; i < log.length; i++) rule(log[i - 1].at <= log[i].at, `data/log.json entry ${i} is older than the one before it (append new entries at the end)`);
}

if (failed) process.exit(1);
console.log('data/state.json and data/log.json are valid.');
