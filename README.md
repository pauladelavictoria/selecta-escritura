# Selecta Escritura

Web de [selectaescritura.com](https://selectaescritura.com/) en React + Vite. El contenido vive en [Sanity](https://www.sanity.io) y se edita desde su panel; la web lo descarga al abrirse, así que los cambios publicados se ven sin volver a desplegar.

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # producción en dist/
```

## Dónde está cada cosa

```
studio/               # panel de Sanity (https://selecta-escritura.sanity.studio)
  schemaTypes/        # campos de cada tipo de documento
content/              # contenido en Markdown/YAML de antes de Sanity; solo lo usa scripts/migrar-a-sanity.mjs
src/
  layouts/            # plantillas de página (ver abajo)
  components/         # layout/ (cabecera, pie), home/ (portada), page/ (piezas de páginas), ui/
  styles/             # tokens.css (colores, tipografías) y base.css (estilos globales y .prose)
                      # cada componente lleva su propio Nombre.module.css al lado
  lib/content.js      # descarga el contenido de Sanity y lo consulta
```

`.env` guarda el Project ID de Sanity (no es secreto). Los tokens van en `.env.local`, que no se sube.

## Importar el contenido del WordPress original

```bash
npm run import:wp            # primera importación (se niega si ya hay contenido)
npm run import:wp -- --force # borra content/pages y content/teachers y reimporta
```

[scripts/import-wordpress.mjs](scripts/import-wordpress.mjs) lee la API de WordPress de selectaescritura.com y genera:

- `content/teachers/` con las entradas de la categoría *profesorado* (el grupo claustro/invitadas sale de sus categorías).
- `content/pages/` con el resto de entradas y páginas. Las de categorías de talleres usan el layout `course` y sus líneas «Duración: …», «Precio: …» pasan a la ficha lateral.
- Los listados (Talleres, Eventos, Claustro…) a partir de las categorías, con su nombre y descripción.
- Las imágenes en `public/uploads/`, y los enlaces a `selectaescritura.com` reescritos como rutas locales.

Qué categoría genera cada listado se configura en `ARCHIVES`, al principio del script. Desde el paso a Sanity solo sirve para regenerar `content/` antes de migrar.

## Tipos de página

Cada página elige su plantilla con el campo «Tipo de página» (`layout`) y el panel solo muestra los campos de ese tipo:

| layout    | Para qué                                   | Campos propios                   |
|-----------|--------------------------------------------|----------------------------------|
| `page`    | Texto genérico                             |                                  |
| `course`  | Curso o taller, con ficha lateral          | `facts`, `teachers`, `status`, `finished` |
| `listing` | Tarjetas que enlazan a otras páginas       | `items` (referencias a páginas)  |
| `team`    | Profesorado                                | `groups` (`claustro`, `invitadas`) |
| `contact` | Contacto con los «Datos de contacto»       |                                  |
| `sitemap` | Mapa del sitio generado desde el menú      |                                  |

Todos admiten `title`, `slug` (la URL), `kicker` (antetítulo), `path` (URL personalizada), `summary` (texto de la tarjeta), `image`, `body` (texto con formato) y `gallery`.

## Panel de edición (Sanity)

Permite editar el contenido sin tocar código ni Markdown, con un editor visual.

- Panel: [selecta-escritura.sanity.studio](https://selecta-escritura.sanity.studio). Cada cambio se guarda como borrador y llega a la web al pulsar **Publicar**.
- Invitar a alguien: [sanity.io/manage](https://www.sanity.io/manage) → el proyecto → **Members → Invite**, con el rol **Editor**.
- Desarrollo del panel: `cd studio && npm install && npm run dev` (en http://localhost:3333).
- Si cambias los campos en `studio/schemaTypes/`, publica el panel con `cd studio && npm run deploy` y ajusta la consulta de `src/lib/content.js`.

### Migración desde los Markdown

[scripts/migrar-a-sanity.mjs](scripts/migrar-a-sanity.mjs) pasa `content/` y sus imágenes a Sanity sin tocar los textos. Necesita en `.env.local` un token de [sanity.io/manage](https://www.sanity.io/manage) → **API → Tokens** con permiso Editor: `SANITY_WRITE_TOKEN=…`.

```bash
npm run migrar:sanity -- --dry    # solo convierte y muestra un resumen
npm run migrar:sanity             # se niega si Sanity ya tiene páginas
npm run migrar:sanity -- --force  # sobrescribe, también lo editado en el panel
```

## Despliegue en Netlify (gratis)

1. En [app.netlify.com](https://app.netlify.com): **Add new site → Import an existing project → GitHub** y elige este repo. La configuración se lee de `netlify.toml`. En **Project configuration → Build & deploy → Branches and deploy contexts** deja **Branch deploys: None** y desactiva **Deploy previews**: solo se despliega `main`.
2. Formularios: tras el primer despliegue, Netlify detecta solos `contacto` (página de Contacto) e `inscripcion` (botón «Quiero apuntarme» de los talleres, con el curso en el campo `curso`). Para recibir los mensajes por email ve a **Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**, elige *Any form* y pon `info@selectaescritura.com`. Los mensajes también quedan guardados en **Forms**. El plan gratuito incluye 100 envíos al mes.
3. Opcional: conecta tu dominio en **Domain management**.

## Tipografías

Newsreader (títulos) y Geist (texto), instaladas con `@fontsource-variable` e importadas en `src/main.jsx`.
