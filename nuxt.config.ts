import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({


    server: {
        port: 8000, // default: 3000
        host: 'localhost',
        timing: false
    },
    ssr: false,
    css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify']
    },
    vite: {
        define: {
            'process.env.DEBUG': 'false',
        }
    },
    modules: [
        '@pinia/nuxt',
    ],
})
