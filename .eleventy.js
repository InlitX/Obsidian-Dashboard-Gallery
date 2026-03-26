module.exports = function(eleventyConfig) {

  // ── Passthrough copies ──────────────────────────────────────────────────
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("CNAME");
  // Copy blog post images (png, jpg, jpeg, gif, webp, svg)
  eleventyConfig.addPassthroughCopy("blog/**/*.png");
  eleventyConfig.addPassthroughCopy("blog/**/*.jpg");
  eleventyConfig.addPassthroughCopy("blog/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("blog/**/*.gif");
  eleventyConfig.addPassthroughCopy("blog/**/*.webp");
  eleventyConfig.addPassthroughCopy("blog/**/*.svg");

  // ── Ignore pages/ (old static prototypes) ──────────────────────────────
  eleventyConfig.ignores.add("pages");

  // ── Filters ────────────────────────────────────────────────────────────
  eleventyConfig.addFilter("blogDate", function(dateObj) {
    if (!dateObj) return "";
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  });

  eleventyConfig.addFilter("limit", function(arr, n) {
    return (arr || []).slice(0, n);
  });

  // ── Markdown ────────────────────────────────────────────────────────────
  // Use the markdown-it bundled inside Eleventy (v13, CJS compatible)
  const markdownIt = require("./node_modules/@11ty/eleventy/node_modules/markdown-it");
  const md = new markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  // ── Collections ─────────────────────────────────────────────────────────
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("posts").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
