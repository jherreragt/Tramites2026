import fs from 'fs';
import path from 'path';
import institutionsData from '../src/data/institutions';
import proceduresData from '../src/data/procedures';

function escapeSql(str: any) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? 'true' : 'false';
  if (typeof str === 'number') return str;
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = '';

sql += '-- Insertar Instituciones\n';
for (const inst of institutionsData) {
  const cols = Object.keys(inst);
  const vals = Object.values(inst).map(escapeSql);
  sql += `INSERT INTO institutions (${cols.join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT (id) DO NOTHING;\n`;
}

sql += '\n-- Insertar Trámites\n';
for (const proc of proceduresData) {
  const cols = Object.keys(proc);
  const vals = Object.values(proc).map(escapeSql);
  sql += `INSERT INTO procedures (${cols.join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT (id) DO NOTHING;\n`;
}

const outPath = path.resolve(process.cwd(), 'supabase/migrations/99_seed_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('✅ Archivo SQL generado en: ' + outPath);
