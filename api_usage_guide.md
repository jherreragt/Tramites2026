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
| Búsqueda por nombre (ilike) | `GET /procedures?name=ilike.*DPI*&select=*` |
| Búsqueda full‑text (español) | `GET /procedures?search_vector=websearch('consulta')&select=*` |
| Trámites de una institución | `GET /procedures?institution_id=eq.[UUID]&select=*` |

### 2. Experiencias (`/experiences`)
| Acción | Endpoint |
| :--- | :--- |
| Listar todas | `GET /experiences?select=*` |
| Búsqueda por categoría | `GET /experiences?categoria=eq.MiCategoria&select=*` |

> [!NOTE]
> La tabla `experiences` no tiene una relación de clave foránea tradicional (Foreign Key) hacia `procedures`. En su lugar, utiliza una columna llamada `ids_procedures` que contiene un arreglo de IDs. Para obtener los trámites de una experiencia, primero debes consultar la experiencia y luego hacer una segunda petición a `/procedures?id=in.(id1,id2,id3)` usando los IDs devueltos.

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
