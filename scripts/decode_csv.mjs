import { readFileSync, writeFileSync } from 'fs';

const csv = Buffer.from(readFileSync('./scripts/russian_names.b64', 'utf8'), 'base64').toString('utf8');
writeFileSync('./scripts/russian_names.csv', csv, 'utf8');
const lines = csv.trim().split('\n').length - 1;
console.log(`Wrote scripts/russian_names.csv (${lines} data rows)`);
