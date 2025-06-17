import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "assemblyscript unittest framework",
  description: "documents of assemblyscript unittest framework",
  base: "/assemblyscript-unittest-framework/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local",
    },
    nav: [{ text: "Home", link: "/" }],
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
              { text: "Matchers", link: "/api-documents/matchers" },
              { text: "Mock Function", link: "/api-documents/mock-function" },
              { text: "Report", link: "/api-documents/coverage-report" },
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
