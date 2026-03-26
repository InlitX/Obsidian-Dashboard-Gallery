# Obsidian Dashboard Gallery

## Arrancar

```bash
npm run serve
```

Abre http://localhost:8080

## Build producción

```bash
npm run build
```

Los archivos se generan en `_site/`.

## Añadir posts

Crea una carpeta en `blog/posts/tu-post/` con un `index.md`. El frontmatter mínimo:

```yaml
---
title: "Título"
date: 2026-03-25
tags: [posts]
---
```

Las imágenes del post van en la misma carpeta. El resto se genera solo.

---

## Roadmap: Ideas futuras

### 1. 🌐 Sistema de búsqueda en el blog
Añadir un buscador que permita filtrar posts por título o tags. Implementación simple con JS (Fuse.js o similar).

### 2. 📱 PWA (Progressive Web App)
Hacer que la web sea instalable como app en móvil. Solo requiere un manifest.json y service worker básico.

### 3. 📊 Sección de estadísticas
Mostrar en la home el número de dashboards, posts publicados, estrellas de GitHub, etc. Se puede obtener dinámicamente desde la API de GitHub.

---

## Otras ideas

- **Sitemap y RSS** - Generar sitemap.xml y feed RSS para SEO
- **SEO avanzado** - Meta tags, Open Graph, Twitter Cards
- **Tester de dashboards** - Demo en vivo de los dashboards en la web
