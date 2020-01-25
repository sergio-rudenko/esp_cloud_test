<template>
    <v-card class="ma-2" flat tile>
        <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ title }}</span>
        </v-card-title>

        <v-card-text>
            <v-combobox
                v-model="network"
                :loading="scanning"
                :items="sortedList"
                item-text="ssid"
                label="WiFi сеть"
                counter="16"
                clearable
            >
                <template v-slot:append>
                    <!-- <svg-icon
                    v-if="wifiNet !== null"
                    name="window-close"
                    color="primary"
                    />-->
                    <svg-icon name="menu-down" color="primary" />
                </template>

                <template v-slot:item="{ item }">
                    <v-layout justify-space-between>
                        <span>{{ item.ssid }}</span>
                        <svg-icon :name="item.icon" color="accent" />
                    </v-layout>
                </template>
            </v-combobox>

            <v-text-field
                v-model="password"
                :loading="connecting"
                label="Пароль сети WiFi"
                counter="32"
                placeholder
            ></v-text-field>

            <v-layout justify-center class="my-2 py-0">
                <v-btn
                    v-if="network === null"
                    :disabled="scanning"
                    :loading="scanning"
                    @click="scan()"
                    text
                >обновить список сетей</v-btn>
                <v-btn
                    v-else
                    :disabled="connecting"
                    :loading="connecting"
                    @click="connect()"
                    text
                >подключиться к сети</v-btn>
            </v-layout>
        </v-card-text>

        <!-- Description -->
        <v-card-text>
            <span class="caption grey--text text--darken-1 py-0">{{ description }}</span>
        </v-card-text>

        <v-divider></v-divider>
        <v-card class="d-flex align-center justify-space-around" height="64" flat tile>
            <v-btn :disabled="true" text>назад</v-btn>
            <v-btn :disabled="!configured" color="primary" depressed>далее</v-btn>
        </v-card>
    </v-card>
</template>

<script>
export default {
    mounted() {
        this.scan();
        this.$store.commit('setMenuIcon', 'wifi-strength-off');
    },

    methods: {
        scan() {
            this.scanning = true;

            setTimeout(() => {
                this.list = [
                    { ssid: 'ESP1', rssi: 2 },
                    { ssid: 'Homenet', rssi: 3 },
                    { ssid: 'Skynet', rssi: 1 },
                    { ssid: 'KB', rssi: 3 },
                    { ssid: 'Test', rssi: 0 }
                ];
                this.scanning = false;
            }, 3000);
        },

        connect() {
            this.connecting = true;

            setTimeout(() => {
                this.connecting = false;
                this.configured = true;
                this.$store.commit(
                    'setMenuIcon',
                    'wifi-strength-' + this.network.rssi
                );
            }, 3000);
        }
    },

    computed: {
        sortedList() {
            function compare(a, b) {
                if (a > b) return 1;
                if (a == b) return 0;
                if (a < b) return -1;
            }

            return this.list
                .map(item => {
                    return {
                        ssid: item.ssid,
                        rssi: item.rssi,
                        icon: 'wifi-strength-' + item.rssi
                    };
                })
                .sort((a, b) => {
                    return compare(b.rssi, a.rssi);
                });
        }
    },

    data: () => ({
        title: 'Подключение к сети',
        description:
            'Для соединения с облаком необходимо подключение устройства \
            к сети Internet. Выполните настройку подключения к роутеру.',

        network: null,
        password: null,
        scanning: false,
        connecting: false,
        configured: false,
        list: [
            { ssid: 'ESP1', rssi: 2 },
            { ssid: 'Homenet', rssi: 3 }
        ]
    })
};
</script>
