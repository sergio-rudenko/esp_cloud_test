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
        // this.$connect();

        this.$router.push({ path: '/setup/user' });
    },

    methods: {
        switchRoute() {
            var path = '';

            if (this.$route.path === '/' && this.isWsConnected === true) {
                switch (this.localDevice.mode) {
                    case 0 /* Factory */:
                    case 2 /* SetupWiFi */:
                        path = '/setup/wifi';
                        break;

                    case 1 /* Flashing */:
                        path = '/flashing';
                        break;

                    case 3 /* SetupAuth */:
                        path = '/setup/user';
                        break;

                    case 4 /* SetupOther */:
                        path = '/setup/other';
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
            //this.switchRoute();
        },

        event: function() {
            //this.switchRoute();
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
