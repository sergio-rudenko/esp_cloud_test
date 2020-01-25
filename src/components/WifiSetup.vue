<template>
    <span>
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
            >Обновить список сетей</v-btn>
            <v-btn
                v-else
                :disabled="connecting"
                :loading="connecting"
                @click="connect()"
                text
            >подключиться к сети</v-btn>
        </v-layout>
    </span>
</template>

<script>
import SvgIcon from '@/components/Svg/Icon.vue';

export default {
    components: {
        SvgIcon
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
