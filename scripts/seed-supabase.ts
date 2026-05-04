import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

import institutionsData from '../src/data/institutions';
import proceduresData from '../src/data/procedures';

async function seedData() {
  console.log('⏳ Iniciando migración de datos a Supabase...');

  try {
    console.log(`📦 Se encontraron ${institutionsData.length} instituciones y ${proceduresData.length} trámites.`);

    // 2. Insertar Instituciones
    console.log('⬆️  Subiendo Instituciones...');
    const { error: instError } = await supabase
      .from('institutions')
      .upsert(institutionsData);

    if (instError) {
      throw new Error(`Error al insertar instituciones: ${instError.message}`);
    }
    console.log('✅ Instituciones subidas correctamente.');

    // 3. Insertar Trámites
    console.log('⬆️  Subiendo Trámites...');
    const { error: procError } = await supabase
      .from('procedures')
      .upsert(proceduresData);

    if (procError) {
      throw new Error(`Error al insertar trámites: ${procError.message}`);
    }
    console.log('✅ Trámites subidos correctamente.');

    console.log('🎉 Migración completada con éxito.');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

seedData();
