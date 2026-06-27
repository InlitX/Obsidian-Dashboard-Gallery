# Obsidian Dashboard Gallery — Web

Sitio estático (Eleventy) que muestra la galería de dashboards para Obsidian. Multiidioma (8 lenguas) con i18next.

## Arrancar

```bash
npm install
npm run serve
```

Abre http://localhost:8080

## Build producción

```bash
npm run build
```

Genera el sitio en `_site/` (ignorado por git).

## Estructura

```
index.html              Home: hero + galería de dashboards + modal
404.njk                 Página de error
_includes/layouts/      Plantillas del blog (list / post)
assets/
  css/                  style.css (web) · blog.css (blog)
  js/
    main.js             Datos de cada dashboard + lógica del modal/galería
    i18n-config.js      Traducciones (8 idiomas) + cambio de idioma
    blog-lang.js        Idioma en el blog
blog/                   Blog (índice y posts)
images/
  dashboards/<Nombre>/  Capturas y vídeo de cada dashboard
  elements/             Imágenes decorativas del hero
  logo.png
.eleventy.js            Config de Eleventy
```

## Añadir un dashboard

Son 3 pasos, todos enlazados por el `id` (ej. `atlas`):

1. **Imágenes** → `images/dashboards/<Nombre>/` (`.png` y opcional `.mp4`).
2. **`index.html`** → una `<article class="dashboard-card" data-dashboard="id">` en `.dashboards-grid`.
3. **`assets/js/main.js`** → entrada en `dashboardData` con `images`, `videos`, `specs`, `plugins`, `url`.
4. **`assets/js/i18n-config.js`** → en los **8 idiomas**: `dashboards.<id>`, `dashboards.<id>.preview` y cada `modal.specs.*` que uses en `specs`.

> Toda cadena de texto pasa por i18next: añádela en los 8 idiomas o caerá al inglés por defecto.

---

Made with ❤️ for the Obsidian community
