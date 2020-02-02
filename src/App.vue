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
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';

import AppNavigation from './components/Navigation';

export default {
    name: 'App',
    components: {
        AppNavigation
    },

    beforeMount() {
        this.$vuetify.theme.dark = localStorage.getItem('darkMode') == 'true';

        /* start websocket TODO: conditions... */
        // if (!this.isWsConnected)
        this.$connect();
    },

    methods: {
        switchRoute() {
            var path = '';

            if (this.$route.path === '/' && this.isWsConnected === true) {
                switch (this.localDevice.mode) {
                    case 1 /* REGULAR */:
                    case 2 /* LOCAL */:
                        path = '/control';
                        break;

                    case 3 /* SETUP WiFi */:
                        path = '/setup/wifi';
                        break;

                    case 4 /* SETUP Auth */:
                        path = '/setup/auth';
                        break;

                    default:
                        path = '/';
                }
            }
            if (this.$route.path !== '/' && this.isWsConnected !== true) {
                path = '/';
            }
            if (path !== '' && path !== this.$route.path) {
                window.console.log('App route: ', path);
                this.$router.push({ path: path });
            }
        }
    },

    watch: {
        isWsConnected: function() {
            this.switchRoute();
        },

        event: function() {
            this.switchRoute();
        }
    },

    computed: {
        ...mapGetters(['isWsConnected', 'event']),
        ...mapState({
            localDevice: state => state.device.local
        })
    },

    data() {
        return {};
    }
};
</script>
