import {createRouter, createWebHistory} from 'vue-router';

import VacancyList from '@/components/VacancyViews/VacancyList.vue'
import CreateVacancy from "@/components/VacancyViews/CreateVacancy.vue";
import EditVacancy from "@/components/VacancyViews/EditVacancy.vue";
import CandidatPage from '@/components/CandidatPage/CandidatPage.vue';


const routes = [
    {
        path: '/',
        name: 'Home',
        component: CandidatPage,
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
    {
        path: '/edit-vacancy/:id',
        name: 'EditVacancy',
        component: EditVacancy,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

