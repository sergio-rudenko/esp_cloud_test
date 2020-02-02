<template>
    <v-layout align-center justify-center>
        <v-card class="ma-2" max-width="400px" flat tile>
            <v-card-title class="title font-weight-regular justify-space-between">
                <span>{{ title }}</span>
            </v-card-title>

            <v-card-text>
                <v-combobox
                    v-model="network"
                    :loading="scanning"
                    :items="sortedNetworks"
                    item-text="ssid"
                    label="WiFi сеть"
                    counter="32"
                    clearable
                >
                    <template v-slot:append>
                        <!-- <svg-icon
                    v-if="wifiNet !== null"
                    name="window-close"
                    color="primary"
                        />-->
                        <svg-icon
                            :name="
                                network == null
                                    ? 'menu-down'
                                    : 'wifi-strength-' + network.rssi
                            "
                            color="gray"
                        />
                    </template>

                    <template v-slot:item="{ item }">
                        <v-layout justify-space-between>
                            <span class="text-truncate" style="width: 80%;">
                                {{
                                item.ssid
                                }}
                            </span>
                            <svg-icon :name="'wifi-strength-' + item.rssi" color="gray" />
                        </v-layout>
                    </template>
                </v-combobox>

                <v-text-field
                    v-model="password"
                    :loading="connecting"
                    :error="auth_error"
                    type="password"
                    label="Пароль сети WiFi"
                    counter="64"
                    placeholder
                ></v-text-field>

                <v-layout justify-center class="my-2 py-0">
                    <v-btn
                        v-if="password == ''"
                        :disabled="scanning"
                        :loading="scanning"
                        @click="scanNetworks()"
                        text
                    >обновить список сетей</v-btn>
                    <v-btn
                        v-else
                        :disabled="connecting"
                        :loading="connecting"
                        @click="connectUplink()"
                        text
                    >подключиться к сети</v-btn>
                </v-layout>
            </v-card-text>

            <!-- Description -->
            <v-card-text>
                <span class="caption grey--text text--darken-1 py-0">
                    {{
                    description
                    }}
                </span>
            </v-card-text>

            <v-divider></v-divider>
            <v-card class="d-flex align-center justify-space-around" height="64" flat tile>
                <!-- <v-btn :disabled="true" text>назад</v-btn> -->
                <v-btn @click="disableUplink()" v-text="'отмена'" color="warning" block />
            </v-card>
        </v-card>
    </v-layout>
</template>

<script>
// const axios = require('axios').default;
import { mapGetters } from 'vuex';
export default {
    created() {
        this.$store.commit('setMenuIcon', 'wifi-strength-off');
        this.scanNetworks();
    },

    methods: {
        sendMessage(msg) {
            if (this.$store.state.socket.isConnected)
                this.$store.dispatch('wsSendMessage', msg);
        },

        scanNetworks() {
            this.scanning = true;
            this.sendMessage({
                ep: '/api/module',
                path: 'wifi',
                param: {
                    action: 'scan'
                },
                token: '__factory__'
            });

            this.timeout = setTimeout(() => {
                //window.location.reload();
                this.scan();
            }, 7000);
        },

        connectUplink() {
            this.sendMessage({
                ep: '/api/module',
                path: 'wifi',
                param: {
                    action: 'join',
                    ssid: this.network.ssid,
                    pass: this.password
                },
                token: '__factory__'
            });
        },

        disableUplink() {
            this.sendMessage({
                ep: '/api/module',
                path: 'wifi',
                param: {
                    action: 'disable'
                },
                token: '__factory__'
            });
        },

        onConnected() {
            window.console.log('connected!');
            clearTimeout(this.timeout);
            this.connecting = false;
            this.configured = true;
            //this.$router.go(-1);
        },

        onDisconnected() {
            window.console.log('failed to connect..');
            clearTimeout(this.timeout);
            this.connecting = false;
            this.auth_error = true;
        }
    },

    watch: {
        message: function(msg) {
            if (msg !== null) {
                window.console.log('SetupWifi msg: ', msg);

                /* wifi ntwork scan result */
                if (msg.path == 'wifi' && msg.param.action == 'scan') {
                    clearTimeout(this.timeout);

                    if (msg.result.error || msg.result.length == 0) {
                        this.timeout = setTimeout(() => {
                            this.scanNetworks();
                        }, 2000);
                    } else {
                        this.networks = msg.result;
                        this.scanning = false;
                    }
                }
            }
        },

        password: function() {
            this.auth_error = false;
        }
    },

    computed: {
        ...mapGetters(['message']),

        sortedNetworks() {
            function compare(a, b) {
                if (a > b) return 1;
                if (a == b) return 0;
                if (a < b) return -1;
            }

            return this.networks
                .map(item => {
                    var rssi_level = 0;
                    if (item.rssi < -50 /*dBm*/)
                        rssi_level = Math.floor(
                            (2 * (item.rssi + 100)) / 33 + 1
                        );
                    else rssi_level = 3;

                    return {
                        ssid: item.ssid,
                        rssi: rssi_level
                    };
                })
                .sort((a, b) => {
                    return compare(b.rssi, a.rssi);
                });
        }

        // wsMessage() {
        //     return this.$store.state.socket.message;
        // }
    },

    data: () => ({
        timeout: null,

        title: 'Подключение к сети',
        description:
            'Для соединения с облаком необходимо подключение устройства \
            к сети Internet. Выполните настройку подключения к роутеру.',

        networks: [],
        network: null,
        password: '',
        scanning: false,
        connecting: false,
        configured: false,

        auth_error: false
    })
};
</script>
