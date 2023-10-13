import MyJobExperience from "@/pages/MyJob/MyJobExperience.vue";
import MyJobStatement from "@/pages/MyJob/MyJobStatement.vue";
import MyJobContracts from "@/pages/MyJob/MyJobContracts.vue";
import MyJobOrders from "@/pages/MyJob/MyJobOrders.vue";
import MyJobSocialContracts from "@/pages/MyJob/MyJobSocialContracts.vue";
import MyJobAttorney from "@/pages/MyJob/MyJobAttorney.vue";
import MyJobElectronicCard from "@/pages/MyJob/MyJobElectronicCard.vue";
import DiplomaCertificates from "@/pages/DiplomaCertificates/DiplomaCertificates.vue";

export default [
    {
        path: '/my-job',
        name: 'MyJob',
        redirect: {
            name: 'MyJob Experience'
        },
        children: [
            {
                path: 'experience',
                name: "MyJob Experience",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: MyJobExperience,
            },
            {
                path: 'statement',
                name: "MyJob Statement",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: MyJobStatement,
            },
            {
                path: 'contracts',
                name: "MyJob Contracts",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: MyJobContracts,
            },
            {
                path: 'orders',
                name: "MyJob Orders",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: MyJobOrders,
            },
            {
                path: 'social-contracts',
                name: "MyJob Social Contracts",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: MyJobSocialContracts,
            },
            {
                path: 'attorney',
                name: "MyJob Attorney",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: MyJobAttorney,
            },
            {
                path: 'certificate',
                name: "MyJob Certificate",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: DiplomaCertificates,
            },
            {
                path: 'electronic-card',
                name: "MyJob Electronic Card",
                meta: {
                    title: 'menu.laborActivity'
                },
                component: MyJobElectronicCard,
            }
        ]
    }
]