<template>
    <v-container>
        <v-layout text-center wrap class="ma-2">
            <v-flex xs12>
                <v-img
                    :src="require('../assets/logo.svg')"
                    height="128"
                    contain
                ></v-img>
            </v-flex>
        </v-layout>
        <v-layout text-center wrap class="ma-8">
            <v-flex>
                <v-progress-circular
                    :indeterminate="isConnected !== true"
                    color="primary"
                    size="128"
                >
                    {{ isConnected !== true ? 'connect...' : 'connected' }}
                </v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout text-center wrap class="ma-8">
            <v-flex> </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'home',
    components: {},

    beforeMount() {
        /* get module state */
    },

    methods: {
        route() {
            if (this.$route) {
                var path = '';
                if (this.module.wifi_configured == false) {
                    /* 1st step: connect to WiFi AP */
                    path = '/setup/wifi';
                } else if (this.module.auth_configured == false) {
                    /* 2st step: login to cloud */
                    path = '/setup/user';
                } else {
                    /* Setup finished: */
                    path = '/control';
                }
                this.$router.push({ path: path });
            }
        }
    },

    computed: {
        isConnected() {
            return this.$store.state.socket.isConnected;
        },

        localDevice() {
            return this.$store.state.device.local;
        }
    },

    data: () => ({
        module: null
    })
};
</script>
