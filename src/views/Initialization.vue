<template>
    <div
        style="width: 100%; height: 100%;"
        class="d-flex align-center justify-center"
    >
        <v-card
            width="90%"
            max-width="500"
            height="90%"
            max-height="600"
            elevation="4"
            shaped
        >
            <v-card flat tile height="60%">
                <v-card-title
                    class="title font-weight-regular justify-space-between"
                >
                    <span>{{ steps[step].title }}</span>
                    <v-avatar
                        color="primary lighten-2"
                        class="subheading white--text"
                        size="28"
                        >{{ step + 1 }}</v-avatar
                    >
                </v-card-title>

                <v-window v-model="step">
                    <v-window-item
                        v-for="(step, i) in steps"
                        :value="i"
                        :key="i"
                    >
                        <v-card-text>
                            <!-- Настройка WiFi -->
                            <wifi-setup />

                            <!-- User Login -->
                            <span v-if="i == 1">
                                <v-card-text>
                                    <v-text-field
                                        label="Телефон"
                                        counter="16"
                                        prefix="+"
                                        placeholder="7 XXX XXX-XXXX"
                                        value=""
                                        class="mb-2"
                                    ></v-text-field>
                                </v-card-text>
                            </span>

                            <!-- Настройка WiFi -->
                            <span v-if="i == 2"> </span>
                        </v-card-text>
                    </v-window-item>
                </v-window>
            </v-card>

            <v-card flat tile height="25%">
                <!-- Description -->
                <v-card-text>
                    <span class="caption grey--text text--darken-1 py-0">
                        {{ steps[step].description }}
                    </span>
                </v-card-text>
            </v-card>

            <v-divider></v-divider>
            <v-card
                class="d-flex align-center justify-space-around"
                height="15%"
                flat
                tile
            >
                <v-btn
                    v-if="step < lastStep"
                    :disabled="step === 0"
                    @click="step--"
                    text
                >
                    назад
                </v-btn>
                <v-btn
                    v-if="step < lastStep"
                    :disabled="!canProceedNext"
                    @click="step++"
                    color="primary"
                    depressed
                >
                    далее
                </v-btn>

                <v-row v-if="step === lastStep" no-gutters class="mx-4">
                    <v-btn
                        :disabled="true"
                        to="/"
                        color="primary"
                        depressed
                        block
                    >
                        Ок
                    </v-btn>
                </v-row>
            </v-card>
        </v-card>
    </div>
</template>

<script>
// import SvgIcon from '@/components/Svg/Icon.vue';
// import WifiSetup from '@/components/WifiSetup.vue';

export default {
    components: {
        // SvgIcon
        // WifiSetup
    },

    methods: {},

    computed: {
        lastStep() {
            return this.steps.length - 1;
        },

        canProceedNext() {
            var result = false;
            // if (this.step === 0 && this.wifi.configured) result = true;

            return result;
        }
    },

    data: () => ({
        step: 0,
        steps: [
            {
                title: 'Подключение к сети',
                description:
                    'Для настройки соединения с облаком необходимо настроить подключение \
                    устройства к сети Internet. Выполните настройку подключения к роутеру.'
            },
            {
                title: 'Вход в систему',
                description:
                    'На этот номер телефона будет выслан код подтверждения \
                    регистрации нового или аутентификации существующего аккаунта'
            },
            { title: 'Step3' }
        ]
    })
};
</script>
