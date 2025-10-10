import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "assemblyscript unittest framework",
  description: "documents of assemblyscript unittest framework",
  base: "/assemblyscript-unittest-framework/",
  head: [["meta", { name: "google-site-verification", content: "762vxla4bLoGKFlH_iYkk7TVUhrwwpMFS2r7idty0_Y" }]],
  sitemap: {
    hostname: "https://wasm-ecosystem.github.io/assemblyscript-unittest-framework/",
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Release", link: "/release-note" },
      { text: "npm", link: "https://www.npmjs.com/package/assemblyscript-unittest-framework" },
      { text: "Issue", link: "https://github.com/wasm-ecosystem/assemblyscript-unittest-framework/issues" },
    ],
    sidebar: [
      {
        text: "Document",
        items: [
          { text: "Quick Start", link: "/quick-start.md" },
          {
            text: "API documents",
            link: "/api-documents",
            items: [
              { text: "Configuration", link: "/api-documents/configuration" },
              { text: "Options", link: "/api-documents/options" },
              { text: "Matchers", link: "/api-documents/matchers" },
              { text: "Setup Teardown", link: "/api-documents/setup-teardown" },
              { text: "Mock Function", link: "/api-documents/mock-function" },
              { text: "Report", link: "/api-documents/coverage-report" },
              { text: "Return Code", link: "/api-documents/return-code.md" },
            ],
          },
          {
            text: "Examples",
            link: "/examples",
            items: [{ text: "Mock Method", link: "/examples/mock-method" }],
          },
          {
            text: "Technical Details",
            items: [
              {
                text: "code debug info between C++ and TS",
                link: "/technical-details/code-debug-info",
              },
            ],
          },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/wasm-ecosystem/assemblyscript-unittest-framework" }],
  },
});
