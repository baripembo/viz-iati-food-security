const routerBase = process.env.DEPLOY_ENV === 'WITH_SUBFOLDER'
  ? {
      router: {
        base: '/viz-iati-food-security'
      }
    }
  : {}
export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'IATI Food Security Funding Dashboard',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'This site allows you to explore all of the published International Aid Transparency Initiative (IATI) data that is related to food security funding data.' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@humdata' },
      { name: 'twitter:title', content: 'IATI Food Security Funding Dashboard' },
      { name: 'twitter:description', content: 'This site allows you to explore all of the published International Aid Transparency Initiative (IATI) data that is related to food security funding data.' },
      { name: 'twitter:image', content: 'https://baripembo.github.io/viz-iati-food-security/preview.png' },
      { name: 'twitter:image:alt', content: 'Contributions to food security funding data.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://data.humdata.org/images/icons/hdx.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap' }
    ],
    script: [
      {
        src: 'https://apiv2.popupsmart.com/api/Bundle/368361',
        body: true,
        async: true
      }
      // {
      //   src: 'http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js',
      //   body: true
      // }
    ],
    htmlAttrs: {
      lang: 'en'
    }
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffffff', height: '5px' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/_custom.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/mixpanel.js' },
    { src: '~/plugins/hotjar.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'nuxt-vue-select',
    '@nuxtjs/markdownit'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  buildModules: [
    [
      '@nuxtjs/gtm'
    ],
    // LINTING
    // Doc: https://github.com/nuxt-community/eslint-module
    // Comment out the below 3 lines to disable linting
    ['@nuxtjs/eslint-module', {
      fix: true
    }]
  ],
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      config.externals = {
        moment: 'moment'
      }
    }
  },
  dev: process.env.NODE_ENV !== 'production',
  ...routerBase
}
