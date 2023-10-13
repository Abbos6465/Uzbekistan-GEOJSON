import MyApplications from "@/pages/MyApplications/MyApplications.vue";

export default [
    {
        path: '/my-applications',
        children: [
            {
                path: '',
                redirect: {
                    name: 'My Applications'
                }
            },
            {
                path: 'received',
                name: "My Applications",
                meta: {
                    title: 'menu.cabinet'
                },
                component: MyApplications
            },
            {
                path: 'canceled',
                name: "My Applications Canceled",
                meta: {
                    title: 'menu.cabinet'
                },
                component: MyApplications
            },
            {
                path: 'considerated',
                name: "My Applications Considerated",
                meta: {
                    title: 'menu.cabinet'
                },
                component: MyApplications
            }
        ]
    },
]