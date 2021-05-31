import Vue from 'vue';
import VueRouter from 'vue-router';

import Solda from './pages/Solda.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Solda
        }
    ]
});

export default router;
