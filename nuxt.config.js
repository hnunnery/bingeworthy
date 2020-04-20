import colors from "vuetify/es5/util/colors";

export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    // titleTemplate: "%s - " + process.env.npm_package_name,
    title: "BingeWorthy - Rate Your Shows",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "BingeWorthy"
      },
      {
        hid: "og:description",
        property: "og:description",
        content: "Find out what's worth watching."
      },
      {
        hid: "og:image",
        property: "og:image",
        content:
          "https://res.cloudinary.com/missionwebdev/image/upload/f_auto/v1586609784/BingeWorthy/bingeworthy.png"
      },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://bingeworthy.app"
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#782f40" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/firebase.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/pwa"],
  pwa: {
    manifest: {
      name: "BingeWorthy",
      short_name: "BingeWorthy",
      orientation: "portrait"
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "#4f1f2a",
          accent: "#757575",
          secondary: "#ceb888",
          gold: "#ceb888",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.darken4,
          success: colors.green.darken1,
          white: "#fafafa",
          black: "#121212",
          grey: "#424242"
        },
        light: {
          primary: "#4f1f2a",
          accent: "#757575",
          secondary: "#4f1f2a",
          gold: "#ceb888",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.darken4,
          success: colors.green.darken1,
          white: "#fafafa",
          black: "#121212",
          grey: "#424242"
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    vendor: ["aos"]
  }
};
