import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

import Control from '../views/Control.vue';
import Status from '../views/Status.vue';

import Initialization from '../views/Initialization.vue';
import Signup from '../views/SignUp.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },

    {
        path: '/initialization',
        name: 'initialization',
        component: Initialization
    },

    {
        path: '/login',
        name: 'signup',
        component: Signup
    },

    {
        path: '/control',
        name: 'control',
        component: Control
    },

    {
        path: '/status',
        name: 'status',
        component: Status
    },

    {
        path: '/settings',
        name: 'settings',
        component: () => import(
            '../views/Settings.vue'
        )
    },

    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
