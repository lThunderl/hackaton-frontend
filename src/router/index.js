import {createRouter, createWebHistory} from 'vue-router';

import DemoVue from "@/components/DemoVue.vue";

import VacancyList from '@/components/VacancyViews/VacancyList.vue'
import CreateVacancy from "@/components/VacancyViews/CreateVacancy.vue";

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
    {
        path: '/create-vacancy',
        name: 'CreateVacancy',
        component: CreateVacancy,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

