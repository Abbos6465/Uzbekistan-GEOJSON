import { createRouter, createWebHistory } from "vue-router";
import Main from "./pages/Main/MainIndex.vue"
import Cabinet from "./pages/Cabinet/CabinetIndex.vue";
import MyJob from "./pages/MyJob/routes";
import MyApplications from "./pages/MyApplications/routes";
import CabinetRoutes from '@/pages/Cabinet/routes';
import CVRoutes from '@/pages/CV/routes';
import ServicesRoutes from '@/pages/Services/routes';
import QualificationRoutes from "@/pages/Qualification/router";
import type { BreadCrumbLinksType } from "@/components/UI/BreadCrumbs/useBreadCrumbs";
import FAQ from "@/pages/Support/FAQ/FAQIndex.vue";
import FAQSingle from "@/pages/Support/FAQ/FAQSingle.vue";
import DiplomaCertificates from "@/pages/DiplomaCertificates/DiplomaCertificates.vue";
import ChatBot from "@/pages/Support/ChatBot.vue";

type RoutesType = {
    path: string
    name?: string
    meta?: {
        title: string
        breadCrumbs?: BreadCrumbLinksType[]
    }
    children?: RoutesType[]
    component?: any
}

export {}

declare module 'vue-router' {
    interface RouteMeta {
        title: string
        breadCrumbs?: BreadCrumbLinksType[]
    }
}

const routes = [
    {
        path: '/',
        name: "Main",
        meta: {
            title: 'menu.main'
        },
        component: Main
    },
    ...MyJob,
    ...MyApplications,
    ...CabinetRoutes,
    ...CVRoutes,
    {
        path: '/diploma-certificates',
        name: 'Diploma Certificates',
        meta: {
            title: 'Диплом/Сертификаты',
            breadCrumbs: [
                {
                    title: 'Главная',
                    route: {
                        name: 'Main'
                    }
                },
                {
                    title: 'main.diplomaCertificates'
                }
            ]
        },
        component: DiplomaCertificates
    },
    {
        path: '/support',
        meta: {
            title: 'menu.cabinet'
        },
        children: [
            {
                path: 'faq',
                name: 'FAQ',
                component: FAQ
            },
            {
                path: 'faq/:id',
                name: 'FAQSingle',
                component: FAQSingle
            },
            {
                path: 'chat',
                name: 'ChatBot',
                component: ChatBot
            }
        ]
    },
    ...ServicesRoutes,
    ...QualificationRoutes
]

export default createRouter({
    history: createWebHistory(),
    routes
})