<template>
    <!-- fill-height -->
    <v-container>
        <!-- WIFI -->
        <v-card class="mb-2" width="100%" tile>
            <v-card-title class="title ">
                <!-- justify-center -->
                <span class="text-truncate font-weight-regular">
                    WiFi: {{ wifi_ssid }}
                </span>
            </v-card-title>

            <v-card-subtitle>
                <span class="text-truncate font-weight-regular">
                    <span class="font-weight-bold">Состояние: </span>
                    {{ wifi_state }}
                </span>
            </v-card-subtitle>

            <v-divider />
            <v-card-actions>
                <v-btn to="/setup/wifi" color="warning" block>
                    Настройка WiFi
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- User -->
        <v-card class="mb-2" width="100%" tile>
            <v-card-title class="title ">
                <span class="text-truncate font-weight-regular">
                    Пользователь: {{ user_phone }}
                </span>
            </v-card-title>

            <v-card-subtitle>
                <span class="text-truncate font-weight-regular">
                    <span class="font-weight-bold">Состояние: </span>
                    {{ user_state }}
                </span>
            </v-card-subtitle>

            <v-divider />
            <v-card-actions>
                <v-btn
                    @click="reload()"
                    :disabled="wifi_ssid == ''"
                    color="warning"
                    block
                >
                    Настройка пользователя
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- User -->
        <v-card class="mb-2" width="100%" tile>
            <v-card-title class="title ">
                <span class="text-truncate font-weight-regular">
                    Токены доступа
                </span>
            </v-card-title>

            <v-divider />
            <v-card-actions>
                <v-btn to="/setup/tokens" color="warning" block>
                    Настройка уровней доступа
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    // methods: {
    //     reload() {
    //         this.$router.push({ name: 'home', params: { userId: '123' } });
    //         window.location.reload();
    //     }
    // },

    computed: {
        ...mapGetters(['local', 'credentials']),

        wifi_ssid() {
            return this.local.wifi.ssid ? this.local.wifi.ssid : '';
        },

        wifi_state() {
            var state = 'не сконфигурирован';

            return state;
        },

        user_phone() {
            return this.credentials.user.phone
                ? this.credentials.user.phone
                : '';
        },

        user_state() {
            var state = 'не сконфигурирован';

            if (this.token) {
                state = 'с доступом к ЛК';
            } else if (this.credentials.user.phone) {
                state = 'без доступа к ЛК';
            }

            return state;
        }
    },

    data: () => ({})
};
</script>
