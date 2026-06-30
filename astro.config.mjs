// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://al-jibran.github.io",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light-high-contrast",
        sepia: "gruvbox-light-soft",
        dark: "github-dark-high-contrast",
        amoled: "github-dark-high-contrast",
      },
      defaultColor: "dark",
    },
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noopener", "noreferrer"],
          },
        ],
      ],
    }),
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/PlayfairDisplay-Regular.ttf"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/PlayfairDisplay-Bold.ttf"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Source Serif",
      cssVariable: "--font-source-serif",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/SourceSerif4-Light.ttf"],
            weight: 300,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/SourceSerif4-Regular.ttf"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/SourceSerif4-Bold.ttf"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Jetbrains Mono",
      cssVariable: "--font-jetbrains",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/JetBrainsMono-Regular.ttf"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/JetBrainsMono-Medium.ttf"],
            weight: 500,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
