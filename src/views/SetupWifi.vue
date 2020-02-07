<template>
    <v-layout align-center justify-center>
        <v-card class="ma-2" max-width="400px" flat tile>
            <v-card-title
                class="title font-weight-regular justify-space-between"
            >
                <span>{{ title }}</span>
            </v-card-title>

            <v-card-text>
                <v-combobox
                    v-model="network"
                    :loading="scanning"
                    :items="sortedNetworks"
                    item-text="ssid"
                    :label="'WiFi сеть [' + this.sortedNetworks.length + ']'"
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
                                {{ item.ssid }}
                            </span>
                            <svg-icon
                                :name="'wifi-strength-' + item.rssi"
                                color="gray"
                            />
                        </v-layout>
                    </template>
                </v-combobox>

                <v-text-field
                    v-model="password"
                    :loading="connecting"
                    :error="password_wrong"
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
                        >обновить список сетей</v-btn
                    >
                    <v-btn
                        v-else
                        :disabled="connecting"
                        :loading="connecting"
                        @click="connectWiFi()"
                        text
                        >подключиться к сети</v-btn
                    >
                </v-layout>
            </v-card-text>

            <!-- Description -->
            <v-card-text>
                <span class="caption grey--text text--darken-1 py-0">
                    {{ description }}
                </span>
            </v-card-text>

            <v-divider></v-divider>
            <v-card
                class="d-flex align-center justify-space-around"
                height="64"
                flat
                tile
            >
                <!-- <v-btn :disabled="true" text>назад</v-btn> -->
                <v-btn
                    @click="disableUplink()"
                    v-text="'отмена'"
                    color="warning"
                    block
                />
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

        this.password_wrong = this.wifiStatus === /*WL_CONNECT_FAILED*/ 4;

        if (this.wifiSSID === null) {
            this.network = null;
        } else {
            this.network = {
                ssid: this.wifiSSID
            };
        }
    },

    beforeDestroy() {
        clearTimeout(this.timeout);
    },

    methods: {
        sendMessage(msg) {
            if (this.$store.state.socket.isConnected)
                this.$store.dispatch('wsSendMessage', msg);
        },

        scanNetworks() {
            if (this.scanning == false) {
                this.scanning = true;
                this.$store.commit('flushWifiNetworkList');
            }

            if (this.sortedNetworks.length == 0) {
                this.sendMessage({
                    ep: '/api/module',
                    path: 'wifi',
                    param: {
                        action: 'scan'
                    },
                    token: '__factory__'
                });

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.scanNetworks();
                }, 2000);
            } else {
                this.scanning = false;
            }
        },

        connectWiFi() {
            this.$store.commit('flushWifiConnectState');
            this.sendMessage({
                ep: '/api/module',
                path: 'wifi',
                param: {
                    action: 'connect',
                    ssid: this.network.ssid,
                    pass: this.password
                },
                token: '__factory__'
            });

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.connecting = true;
                this.getDeviceState();
            }, 2000);
        },

        getDeviceState() {
            if (
                this.localDeviceWifi.state !== 'connected' &&
                this.localDeviceWifi.state !== 'disconnected'
            ) {
                this.sendMessage({
                    ep: '/api/device',
                    path: 'state',
                    token: '__factory__'
                });
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.getDeviceState();
                }, 1000);
            } else {
                this.connecting = false;
            }
        },

        disableWiFi() {
            this.connecting = true;
            this.sendMessage({
                ep: '/api/module',
                path: 'wifi',
                param: {
                    action: 'disable'
                },
                token: '__factory__'
            });
        }

        // onConnected() {
        //     window.console.log('connected!');
        //     clearTimeout(this.timeout);
        //     this.connecting = false;
        //     this.configured = true;
        //     //this.$router.go(-1);
        // },

        // onDisconnected() {
        //     window.console.log('failed to connect..');
        //     clearTimeout(this.timeout);
        //     this.connecting = false;
        //     this.auth_error = true;
        // }
    },

    watch: {
        localDeviceWifi: function(value) {
            window.console.log('STA state: ', value);
            this.network.ssid = value.ssid;
        },

        password: function() {
            this.password_wrong = false;
        }
    },

    computed: {
        ...mapGetters(['message', 'wifiNetworkList', 'wifiStatus', 'wifiSSID']),

        sortedNetworks() {
            function compare(a, b) {
                if (a > b) return 1;
                if (a == b) return 0;
                if (a < b) return -1;
            }

            return this.wifiNetworkList
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
    },

    data: () => ({
        timeout: null,

        title: 'Подключение к сети',
        description:
            'Для соединения с облаком необходимо подключение устройства \
            к сети Internet. Выполните настройку подключения к роутеру.',

        network: null,
        password: '',

        scanning: false,
        connecting: false,
        password_wrong: false
    })
};
</script>
