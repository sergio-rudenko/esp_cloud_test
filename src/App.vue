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
// import { isUndefined } from 'util';

// import { mapState } from 'vuex';
import { mapGetters } from 'vuex';
import AppNavigation from './components/Navigation';
// import { setTimeout } from 'timers';

export default {
    name: 'App',
    components: {
        AppNavigation
    },

    beforeMount() {
        /* color scheme */
        this.$vuetify.theme.dark = localStorage.getItem('darkMode') == 'true';

        /* version */
        const version = localStorage.getItem('version');
        if (version != this.$store.state.version) {
            window.console.log('Update version: ', this.$store.state.version);
            localStorage.setItem('version', this.$store.state.version);
        }

        /* cloud token  */
        //FIXME! const token = localStorage.getItem('CT');

        if (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
        ) {
            this.$store.commit('setStartAs', 'dev');
            this.$store.commit(
                'setCloudToken',
                '1aa08d54fd3f6e25bbba6e9019664088'
            );

            if (this.isMqttConnected !== true) {
                this.$store.dispatch('mqttConnect');
                setInterval(() => {
                    this.mqttState();
                }, 5000);
            }
        } else if (window.location.hostname === '192.168.127.1') {
            this.$store.commit('setStartAs', 'local');
            this.$connect(); /* start websocket */
        } else {
            /* FIXME! FIXME! FIXME! */
            this.$store.commit('setStartAs', 'app');
            this.$store.commit(
                'setCloudToken',
                '71ea68c5d042ab636ba9a053a1dda7e2'
            );

            if (this.isMqttConnected !== true) {
                this.$store.dispatch('mqttConnect');
                setInterval(() => {
                    this.mqttState();
                }, 5000);
            }
        }

        /* start websocket TODO: conditions... */
        if (this.$store.state.startAs === 'local' && !this.isWsConnected)
            if (this.$store.state.startAs === 'local' && !this.isWsConnected)
                this.$connect();

        this.$store.dispatch('onEverySec');

        // this.$router.push({ path: '/control' });
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
        },

        // MQTT --------------------------------------------------------------
        mqttState() {
            if (this.isMqttConnected) {
                this.$store.dispatch('mqttSendMessage', {
                    topic: 'status/' + this.credentials.token,
                    payload: JSON.stringify({
                        startAs: this.$store.state.startAs,
                        time_t: Math.trunc(new Date().getTime() / 1000)
                    }),
                    retain: true,
                    qos: 1
                });
            } else {
                this.$store.dispatch('mqttConnect');
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
        ...mapGetters(['credentials', 'isWsConnected', 'isMqttConnected'])

        // ...mapState({
        //     localDevice: state => state.device.local
        // })
    },

    data() {
        return {};
    }
};
</script>
