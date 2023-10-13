import CabinetIndex from "@/pages/Cabinet/CabinetIndex.vue";
import CabinetInfoEdit from "@/pages/Cabinet/CabinetInfoEdit.vue";

export default [
    {
        path: '/cabinet',
        children: [
            {
                name: "Cabinet",
                path: '',
                meta: {
                    title: 'menu.cabinet'
                },
                component: CabinetIndex,
            },
            {
                path: 'personal-info/edit',
                name: "CabinetPersonalInfoEdit",
                meta: {
                    title: 'cabinet.personal-info',
                    breadCrumbs: [
                        {
                            title: 'cabinet.profile',
                            route: {
                                name: 'Cabinet'
                            }
                        },
                        {
                            title: 'cabinet.edit'
                        }
                    ]
                },
                component: CabinetInfoEdit
            },
        ]
    },
]