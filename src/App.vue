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

        /* cloud token */
        //FIXME! const token = localStorage.getItem('CT');
        const token = '71ea68c5d042ab636ba9a053a1dda7e2';
        if (token) {
            this.$store.commit('setCloudToken', token);
        }

        if (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
        ) {
            this.$store.commit('setStartAs', 'dev');
            if (this.$store.state.mqtt.isConnected !== true) {
                this.$store.dispatch('mqttConnect');
                setInterval(() => {
                    this.mqttState();
                }, 5000);
            }
        } else if (window.location.hostname === '192.168.127.1') {
            this.$store.commit('setStartAs', 'local');
            this.$connect(); /* start websocket */
        } else {
            this.$store.commit('setStartAs', 'app');
        }

        /* start websocket TODO: conditions... */
        if (this.$store.state.startAs === 'local' && !this.isWsConnected)
            if (this.$store.state.startAs === 'local' && !this.isWsConnected)
                this.$connect();

        //if (window.origin) this.$router.push({ path: '/connect' });
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
            if (this.$store.state.mqtt.isConnected) {
                this.$store.dispatch('mqttSendMessage', {
                    topic: 'status/' + this.User.mqttClientId,
                    payload: JSON.stringify({
                        startAs: this.$store.state.startAs,
                        time_t: Math.trunc(new Date().getTime() / 1000)
                    }),
                    retain: true,
                    qos: 1
                });

                this.$store.dispatch(
                    'mqttSubscribe',
                    'FF00/NTdHEDI5MTA8AEoA/#'
                );
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
        ...mapGetters(['isWsConnected', 'event'])
        // ...mapState({
        //     localDevice: state => state.device.local
        // })
    },

    data() {
        return {
            mqtt: null,
            mqttTimeout: null,
            User: {
                name: 'owner',
                phone: '+79185387721',
                email: '',
                mqttClientId: '0c79113e83070d39',
                mqttUsername: 'b1c2b492c04c829a',
                mqttPassword: 'd042675215ce302b'
            },
            Token: '71ea68c5d042ab636ba9a053a1dda7e2'
        };
    }
};
</script>
