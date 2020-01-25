<template>
    <v-app>
        <app-navigation />

        <!-- Sizes your content based upon application components -->
        <v-content>
            <router-view></router-view>
        </v-content>

        <!-- <v-footer app> </v-footer> -->
    </v-app>
</template>

<script>
var store = {
    debug: true,
    state: {
        message: 'Привет!',
        application: {
            menu: [
                // { heading: 'menu' },
                {
                    title: 'Управление',
                    path: '/control',
                    icon: 'control',
                    disabled: false
                },
                {
                    title: 'Контроль',
                    path: '/status',
                    icon: 'clipboard-check-multiple',
                    disabled: false
                },
                {
                    title: 'Настройки',
                    path: '/settings',
                    icon: 'settings',
                    disabled: false
                },
                {
                    title: 'Устройство',
                    path: '/initialization',
                    icon: 'memory',
                    disabled: false
                },
                { divider: true },
                {
                    title: 'Журнал событий',
                    path: '/journal',
                    icon: 'journal',
                    disabled: true
                },
                { divider: true },
                {
                    title: 'О программе',
                    path: '/about',
                    icon: 'INFO',
                    disabled: true
                }
            ]
        },

        credentials: {
            user: {
                name: 'sergio',
                mail: 'sergio.rudenko@gmail.com',
                phone: '+79185387721'
            }
        }
    },
    setMessageAction(newValue) {
        if (this.debug)
            window.console.log('setMessageAction вызвано с ', newValue);
        this.state.message = newValue;
    },
    clearMessageAction() {
        if (this.debug) window.console.log('clearMessageAction вызвано');
        this.state.message = '';
    }
};

import AppNavigation from './components/Navigation';

export default {
    name: 'App',

    components: {
        AppNavigation
    },

    mounted() {
        window.console.log('app::state: ', this.state);
    },

    data: () => ({
        shared: store
    })
};
</script>
