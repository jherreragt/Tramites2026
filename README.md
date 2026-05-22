# Trámites GT - Plataforma de Gestión y Búsqueda de Trámites

Plataforma web para la gestión, consulta y seguimiento de trámites, desarrollada con **React, Vite, TypeScript, Tailwind CSS** en el frontend, y **Supabase (PostgreSQL)** como backend y base de datos. El proyecto está configurado para ser desplegado en **Netlify**.

## 🚀 Requisitos Previos

Antes de comenzar con la instalación en un entorno local o de producción, asegúrate de tener instalado lo siguiente:

- **Node.js** (v18.0.0 o superior)
- **npm** (v9.0.0 o superior)
- Una cuenta en **Supabase** (para la base de datos de producción)
- Una cuenta en **Netlify** (opcional, para el despliegue del frontend)
- **Supabase CLI** (Opcional, pero recomendado para migraciones y gestión de la DB local/remota)

---

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Tramites-main
```

### 2. Instalar dependencias
Instala todas las librerías necesarias del frontend ejecutando:
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo llamado `.env.local` en la raíz del proyecto (al mismo nivel que `package.json`). Debes agregar las credenciales de tu proyecto de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-llave-anonima-publica
```
*(Puedes encontrar estos valores en tu dashboard de Supabase: Project Settings -> API).*

### 4. Ejecutar el servidor de desarrollo
Para iniciar la aplicación en modo desarrollo con recarga en caliente (Hot Module Replacement):
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 📦 Construcción y Despliegue a Producción

Para preparar la aplicación para un entorno de producción (ej. Netlify, Vercel, o un servidor propio), sigue estos pasos:

### 1. Construir la versión de producción
Este comando optimizará y minificará todo el código de React/TypeScript y Tailwind, dejándolo listo para producción en la carpeta `dist/`.
```bash
npm run build
```

### 2. Probar la versión de producción localmente
Antes de subir el código, puedes probar que el build generado funciona correctamente:
```bash
npm run preview
```

### 3. Despliegue en Netlify (Recomendado)
El proyecto ya cuenta con el archivo de configuración `netlify.toml` preparado. Para desplegar en Netlify:
1. Conecta tu repositorio de GitHub a Netlify.
2. Asegúrate de configurar las variables de entorno (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`) dentro de los **Site Settings > Environment Variables** en Netlify.
3. El comando de build que Netlify ejecutará será automáticamente `npm run build` y publicará el directorio `dist/`.

---

## 🗃️ Restauración de Base de Datos (Producción)

El proyecto incluye un respaldo completo de la estructura y datos iniciales de la base de datos (PostgreSQL), ubicado en: `supabase/dump-postgres-202605191631.sql`.

Para migrar esta información a un nuevo entorno de Supabase (Producción):

1. Ve al panel web de tu nuevo proyecto en Supabase.
2. En el menú izquierdo, selecciona **"SQL Editor"** y haz clic en "New Query".
3. Abre el archivo `supabase/dump-postgres-202605191631.sql` desde tu editor de código, copia todo su contenido y pégalo en el editor de Supabase.
4. Presiona el botón **"Run"** (Ejecutar). 

*Nota: Este archivo generará de forma automática todas las tablas, vistas, funciones de búsqueda, políticas RLS y registros (datos) iniciales de Trámites e Instituciones.*

---

## 🗄️ Migraciones de Base de Datos

El proyecto incluye migraciones SQL en la carpeta `supabase/migrations/`. A continuación se documentan las migraciones más relevantes:

### `20260521000000_add_deleted_at_to_observatory.sql`

**Descripción:** Agrega la columna `deleted_at` (tipo `timestamptz`, default `NULL`) a la tabla `observatory` para soportar eliminación lógica (soft-delete) de registros, consistente con el patrón ya utilizado en la tabla `procedures`.

**Cambios realizados:**
- Se agrega la columna `deleted_at` a la tabla `observatory`.
- Se crea un índice `idx_observatory_deleted_at` para optimizar las consultas filtradas.

**Cómo ejecutar manualmente** (si no se usa Supabase CLI):
1. Ve al **SQL Editor** de tu proyecto en Supabase.
2. Copia y ejecuta el contenido del archivo `supabase/migrations/20260521000000_add_deleted_at_to_observatory.sql`.

---

## 🗄️ Estructura del Proyecto

- `/src`: Código fuente de la aplicación React.
- `/public`: Archivos estáticos como imágenes y el `index.html`.
- `/supabase`: (Opcional) Configuraciones, migraciones y funciones Edge de Supabase.
- `/netlify`: Funciones serverless para Netlify.
- `api_usage_guide.md`: Documentación de la API de Trámites.

## 💻 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo Vite.
- `npm run build`: Construye la aplicación para producción.
- `npm run preview`: Sirve localmente la carpeta `dist` para probar la versión de producción.
- `npm run lint`: Ejecuta ESLint para analizar el código en busca de errores.
