import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const url = new URL('./src', import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${url}/scss/variables.scss", "${url}/scss/mixins.scss";`
      },
      javascriptEnabled: true,
    }
  },
  server: {
    port: 2010,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(url)
    }
  }
})
