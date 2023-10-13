import { createApp, markRaw } from 'vue'
import router from "./router";
import App from "./App.vue";
import i18n from "./i18n";
import { createPinia } from "pinia";
import { createMetaManager } from "vue-meta";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components'
import {mdi, aliases} from "vuetify/iconsets/mdi";
import '@mdi/font/css/materialdesignicons.min.css';

import './scss/main.scss';

const vuetify = createVuetify({
    components,
    ...directives,
    ...labsComponents,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})

const pinia = createPinia();
pinia.use(({ store }) => { store.router = markRaw(router) });

const app = createApp(App)
    .use(vuetify)
    .use(router)
    .use(i18n)
    .use(pinia)
    .use(createMetaManager());

await router.isReady();
app.mount('#app')
