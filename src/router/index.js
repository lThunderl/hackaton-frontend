import {createRouter, createWebHistory} from 'vue-router';
import VacancyList from '@/components/Lists/VacancyList.vue'
import DemoVue from "@/components/DemoVue.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: DemoVue,
    },
    {
        path: '/hr-page',
        name: 'HRPage',
        component: VacancyList,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

