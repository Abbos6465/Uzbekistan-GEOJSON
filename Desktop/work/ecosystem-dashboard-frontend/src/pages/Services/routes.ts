import Education from "@/pages/Services/Education.vue";

export default [
    {
        path: '/services',
        name: 'Services',
        redirect: {
            name: 'Services Education'
        },
        children: [
            {
                path: 'education',
                name: "Services Education",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: Education,
            }
        ]
    }
]