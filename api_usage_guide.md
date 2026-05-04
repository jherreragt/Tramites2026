# Guía de Uso de la API - Trámites GT

Esta guía contiene la información necesaria para consumir la API de Trámites GT utilizando **PostgREST** a través de nuestro Gateway en Netlify.

## Configuración Base
- **Staging URL**: `https://tramitesgt.netlify.app/rest/v1`
- **Production URL**: `https://tramites.redciudadana.org/rest/v1`
- **Formato**: JSON (UTF-8)

---

## Endpoints Principales

### 1. Trámites (`/procedures`)
| Acción | Endpoint |
| :--- | :--- |
| Listar todos | `GET /procedures?select=*` |
| Búsqueda por nombre | `GET /procedures?name=ilike.*DPI*&select=*` |
| Trámites de una institución | `GET /procedures?institution_id=eq.[UUID]&select=*` |

### 2. Experiencias (`/experiences`)
| Acción | Endpoint |
| :--- | :--- |
| Listar todas | `GET /experiences?select=*` |
| Experiencia con trámites | `GET /experiences?select=*,procedures(*)` |

### 3. Instituciones (`/institutions`)
| Acción | Endpoint |
| :--- | :--- |
| Listar todas | `GET /institutions?select=*` |
| Ordenar alfabéticamente | `GET /institutions?order=name.asc&select=*` |

---

## Operadores de Filtrado (PostgREST)
Puedes combinar filtros en la URL usando estos operadores:

| Operador | Significado | Ejemplo |
| :--- | :--- | :--- |
| `eq` | Igual a | `id=eq.123` |
| `neq` | Diferente de | `type=neq.presencial` |
| `gt` | Mayor que | `duration_days=gt.5` |
| `lt` | Menor que | `cost=lt.100` |
| `ilike` | Búsqueda parcial (case insensitive) | `name=ilike.*pasaporte*` |
| `in` | Está contenido en una lista | `category=in.(salud,identidad)` |

---

## Configuración en Postman
1. Crea un nuevo **Request** de tipo `GET`.
2. Pega la URL (ej. `https://tramitesgt.netlify.app/rest/v1/procedures?select=*`).
3. **Headers**: No se requieren headers de autenticación (el proxy los inyecta).
4. Presiona **Send**.

---

## Notas de Seguridad
- El acceso es **solo de lectura** para usuarios públicos.
- La seguridad está gestionada por **Row Level Security (RLS)** en Supabase.
- El Gateway de Netlify oculta las claves maestras de Supabase para mayor seguridad.
