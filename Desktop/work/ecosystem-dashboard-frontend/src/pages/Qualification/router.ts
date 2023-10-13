import MyCourses from "@/pages/Qualification/QualificationIndex.vue";

export default [
    {
        path: "/qualification",
        name: "Qualification",
        redirect: {
            name: "Qualification MyCourses"
        },
        children:[
            {
                path: "my-courses",
                name: "Qualification MyCourses",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: MyCourses
            }
        ]
    }
]