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
import AppNavigation from './components/Navigation';

export default {
    name: 'App',

    components: {
        AppNavigation
    },

    created() {
        this.$store.watch(
            (state, getters) => getters.isConnected,
            value => {
                if (value === false && this.$route)
                    if (this.$route.path !== '/') {
                        window.console.log('App::route: "/"');
                        this.$router.push({ path: '/' });
                    }
            }
        );

        this.$store.watch(
            (state, getters) => getters.event,
            () => {
                if (this.isConnected && this.$route) {
                    var path = '';
                    const localDevice = this.$store.state.device.local;

                    if (
                        localDevice.wifi.configured == false ||
                        localDevice.wifi_config_unsaved == true
                    ) {
                        /* SETUP 1st step: connect to WiFi AP */
                        path = '/setup/wifi';
                    } else if (localDevice.auth.configured == false) {
                        /* SETUP 2st step: login to cloud */
                        path = '/setup/user';
                    } else {
                        /* Setup finished: */
                        path = '/control';
                    }

                    if (path !== '' && path !== this.$route.path) {
                        window.console.log('App::route: ', path);
                        this.$router.push({ path: path });
                    }
                }
            }
        );
    },

    beforeMount() {
        this.$vuetify.theme.dark = localStorage.getItem('darkMode') == 'true';

        /* start websocket TODO: conditions... */
        if (!this.isConnected) this.$connect();
    },

    methods: {},

    computed: {
        isConnected() {
            return this.$store.state.socket.isConnected;
        }
    },

    data() {
        return {};
    }
};
</script>
