# Selecta Escritura

Web de [selectaescritura.com](https://selectaescritura.com/) en React + Vite. Sin base de datos: el contenido vive en archivos Markdown/YAML dentro del repo y se edita desde un panel (Decap CMS).

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # producción en dist/
```

## Dónde está cada cosa

```
content/
  pages/*.md          # una página por archivo; la URL es el nombre del archivo (o `path:`)
  teachers/*.md       # fichas de profesorado, reutilizadas en cursos y en /profesorado
  settings/site.yml   # contacto, frases, enlaces del pie
  settings/home.yml   # portada
  settings/menu.yml   # menú principal
src/
  layouts/            # plantillas de página (ver abajo)
  components/         # layout/ (cabecera, pie), home/ (portada), page/ (piezas de páginas), ui/
  lib/content.js      # carga y consulta el contenido
public/
  admin/              # panel de edición (Decap CMS)
  uploads/            # imágenes subidas desde el panel
```

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

Qué categoría genera cada listado se configura en `ARCHIVES`, al principio del script. Ojo: `--force` sobrescribe lo editado desde el panel.

## Tipos de página

Cada `.md` elige su plantilla con el campo `layout` del frontmatter:

| layout    | Para qué                                   | Campos propios                   |
|-----------|--------------------------------------------|----------------------------------|
| `page`    | Texto genérico                             | `gallery`                        |
| `course`  | Curso o taller, con ficha lateral          | `facts`, `teachers`, `status`, `finished` |
| `listing` | Tarjetas que enlazan a otras páginas       | `items` (nombres de archivo)     |
| `team`    | Profesorado                                | `groups` (`claustro`, `invitadas`) |
| `contact` | Contacto con los datos de `site.yml`       |                                  |
| `sitemap` | Mapa del sitio generado desde el menú      |                                  |

Todos admiten `title`, `kicker` (antetítulo), `summary` (texto de la tarjeta), `image` y el cuerpo en Markdown.

Ejemplo de curso:

```md
---
title: Narrativa
layout: course
image: /uploads/narrativa.jpg
facts:
  - { label: Horario, value: "Martes, de 19 a 21 h." }   # comillas si el valor lleva comas
teachers: [kike-parra, barbara-blasco]
---
## Descripción
Texto del curso…
```

## Panel de edición (Decap CMS)

- **En producción:** `https://<tu-dominio>/admin`. Inicias sesión con GitHub; cada cambio guardado es un commit y Netlify vuelve a publicar la web en uno o dos minutos.
- **En local:** `npx decap-server` en una terminal, `npm run dev` en otra, y abre `http://localhost:5173/admin/index.html`. Los cambios se escriben directamente en los archivos.

## Despliegue en Netlify (gratis)

1. En [app.netlify.com](https://app.netlify.com): **Add new site → Import an existing project → GitHub** y elige este repo. La configuración se lee de `netlify.toml`, no hay que tocar nada.
2. Para el panel: crea una OAuth App en GitHub (**Settings → Developer settings → OAuth Apps**) con callback `https://api.netlify.com/auth/done`, y añade su Client ID y Secret en Netlify: **Site configuration → Access & security → OAuth → Install provider → GitHub**.
3. Formulario de contacto: tras el primer despliegue, Netlify detecta el formulario `contacto` solo. Para recibir los mensajes por email ve a **Forms → Form notifications → Add notification → Email notification**, elige el formulario `contacto` y pon el email de destino. Los mensajes también quedan guardados en **Forms**. El plan gratuito incluye 100 envíos al mes.
4. Opcional: conecta tu dominio en **Domain management**.

## Tipografías

La marca usa Bazar, Canter y JMH Typewriter (con licencia, no incluidas). Si tienes los archivos,
cópialos a `public/fonts/` con los nombres de `src/index.css`. Mientras tanto se usan
Fraunces, Bebas Neue y Special Elite (Google Fonts).
