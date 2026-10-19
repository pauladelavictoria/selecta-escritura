# Selecta Escritura

Web de [selectaescritura.com](https://selectaescritura.com/) en React + Vite. Sin base de datos: el contenido vive en archivos Markdown/YAML dentro del repo y se edita desde un panel (Pages CMS).

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
  styles/             # tokens.css (colores, tipografías) y base.css (estilos globales y .prose)
                      # cada componente lleva su propio Nombre.module.css al lado
  lib/content.js      # carga y consulta el contenido
public/
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

## Panel de edición (Pages CMS)

Permite editar el contenido sin tocar código, también a personas sin cuenta de GitHub. La configuración está en `.pages.yml`, en la raíz del repo.

1. Entra en [app.pagescms.org](https://app.pagescms.org) con tu cuenta de GitHub y da acceso a este repo cuando lo pida.
2. Abre el repo en la rama **`contenido`** (no `main`).
3. Ve a **Collaborators** para invitar a la persona por email. Recibirá un enlace para entrar; no necesita GitHub.

Los cambios no se publican al guardar: se acumulan en `contenido` y cada noche a las 00:00 (hora de Madrid)
[.github/workflows/publicar-contenido.yml](.github/workflows/publicar-contenido.yml) los pasa a `main`,
así Netlify despliega una sola vez con todo junto. Si no hay cambios, no despliega. Para publicar antes:
GitHub → **Actions → Publicar contenido → Run workflow**.

Si añades campos nuevos a las páginas, actualiza también `.pages.yml`.

## Despliegue en Netlify (gratis)

1. En [app.netlify.com](https://app.netlify.com): **Add new site → Import an existing project → GitHub** y elige este repo. La configuración se lee de `netlify.toml`. En **Project configuration → Build & deploy → Branches and deploy contexts** deja **Branch deploys: None** y desactiva **Deploy previews**: solo se despliega `main`.
2. Formularios: tras el primer despliegue, Netlify detecta solos `contacto` (página de Contacto) e `inscripcion` (botón «Quiero apuntarme» de los talleres, con el curso en el campo `curso`). Para recibir los mensajes por email ve a **Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**, elige *Any form* y pon `info@selectaescritura.com`. Los mensajes también quedan guardados en **Forms**. El plan gratuito incluye 100 envíos al mes.
3. Opcional: conecta tu dominio en **Domain management**.

## Tipografías

Newsreader (títulos) y Geist (texto), instaladas con `@fontsource-variable` e importadas en `src/main.jsx`.
