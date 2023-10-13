import CVIndex from "./CVIndex.vue";
import CVCreate from "./CVCreate.vue";
import CVSingle from "@/pages/CV/CVSingle.vue";

export default [
    {
        path: '/cv',
        children: [
            {
                path: '',
                name: "CV",
                meta: {
                    title: 'menu.cv'
                },
                component: CVIndex,
            },
            {
                path: 'create',
                name: "CV Create",
                meta: {
                    title: 'menu.cv',
                    breadCrumbs: [
                        {
                            title: 'menu.cv',
                            route: {
                                name: 'CV'
                            }
                        },
                        {
                            title: 'cv.addCv'
                        }
                    ]
                },
                component: CVCreate,
            },
            {
                path: ':id',
                name: "CV Single",
                meta: {
                    title: 'menu.cv',
                    breadCrumbs: [
                        {
                            title: 'menu.cv',
                            route: {
                                name: 'CV'
                            }
                        }
                    ]
                },
                component: CVSingle,
            }
        ]
    }
]