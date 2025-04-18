import {createRouter, createWebHistory} from 'vue-router';
import VacancyList from '@/components/Lists/VacancyList.vue'
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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

