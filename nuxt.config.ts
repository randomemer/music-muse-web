// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  css: ["@mdi/font/css/materialdesignicons.min.css"],
  build: { transpile: ["vuetify"] },
  imports: {
    dirs: ["./store"],
  },
  devServer: {
    port: 4009,
  },
  app: {
    head: {
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
      ],
    },
    // layoutTransition: { name: "layout", mode: "out-in" },
    // pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    serviceAccKey: process.env.SERVICE_ACC_KEY,
    storageBucket: process.env.STORAGE_BUCKET,
    dbUrl: process.env.DB_URL,
    redisUrl: process.env.REDIS_URL,
    public: {
      origin: process.env.ORIGIN,
    },
  },
  nitro: {
    hooks: {
      "dev:reload": () => require("sharp"),
    },
  },
  features: {
    inlineStyles: false,
  },
  vite: {},
});
