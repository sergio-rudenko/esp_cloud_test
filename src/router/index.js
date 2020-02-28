import Vue from 'vue';
import VueRouter from 'vue-router';
import Connect from '../views/Connect.vue';
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
        path: '/connect',
        name: 'connect',
        component: Connect
    },
    /* setup */
    {
        path: '/setup/wifi',
        name: 'setup_wifi',
        component: () => import('../views/SetupWifi.vue')

    },
    {
        path: '/setup/user',
        name: 'setup_user',
        component: () => import('../views/SetupUser.vue')

    },
    {
        path: '/setup/code',
        name: 'setup_code',
        component: () => import('../views/CodeConfirm.vue')

    },
    {
        path: '/setup/tokens',
        name: 'setup_tokens',
        component: () => import('../views/SetTokens.vue')

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
        component: () => import('../views/Settings.vue')
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
