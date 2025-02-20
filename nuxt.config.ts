// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools         : {enabled: true},
    modules          : ["@nuxt/ui", "@vueuse/nuxt"],
    compatibilityDate: "2025-02-18",

    runtimeConfig: {
        public: {
            apiUrl    : process.env.NUXT_API_URL,
            storageUrl: process.env.NUXT_STORAGE_URL
        }
    },

    devServer: {
        host : '0.0.0.0',
        https: {
            key : process.env.NUXT_DEV_SSL_KEY,
            cert: process.env.NUXT_DEV_SSL_CERT
        }
    },
})