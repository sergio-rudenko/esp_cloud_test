<template>
    <div
        style="width: 100%; height: 100%;"
        class="d-flex align-center justify-center"
    >
        <v-card
            class="ma-2"
            width="90%"
            max-width="500"
            height="90%"
            max-height="600"
            elevation="4"
            shaped
        >
            <v-card flat tile height="80%">
                <v-card-title
                    class="title font-weight-regular justify-space-between"
                >
                    <span>{{ currentTitle }}</span>
                    <v-avatar
                        color="primary lighten-2"
                        class="subheading white--text"
                        size="36"
                        v-text="step"
                    ></v-avatar>
                </v-card-title>

                <v-window v-model="step">
                    <v-window-item :value="1">
                        <v-card-text>
                            <v-text-field
                                label="Телефон"
                                counter="16"
                                prefix="+"
                                placeholder="X (XXX) XXX-XXXX"
                                value=""
                                class="mb-2"
                            ></v-text-field>
                            <span class="caption grey--text text--darken-1">
                                На этот номер телефона будет выслан код
                                подтверждения регистрации нового пользователя
                                или аутентификации существующего аккаунта
                            </span>
                        </v-card-text>
                    </v-window-item>

                    <v-window-item :value="2">
                        <v-card-text>
                            <v-text-field
                                counter="6"
                                placeholder="Х Х Х Х Х Х"
                                type="number"
                                class="mx-8 mb-2"
                            ></v-text-field>
                            <span class="caption grey--text text--darken-1">
                                Введите код (6 цифр без пробелов), полученный в
                                СМС с номера ХХХ. Повторная отправка возможна
                                черз
                                {{ timeout }}
                                секунд
                            </span>
                        </v-card-text>
                    </v-window-item>

                    <v-window-item :value="3">
                        <div class="pa-4 text-center">
                            <!-- <v-img
                            class="mb-4"
                            contain
                            height="128"
                            src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                            ></v-img> -->

                            <v-progress-circular
                                :rotate="-90"
                                :size="50"
                                :width="3"
                                indeterminate
                                color="primary"
                                class="ma-4"
                            >
                            </v-progress-circular>

                            <h3
                                v-if="false"
                                class="title font-weight-light mb-2"
                            >
                                Welcome to Vuetify 1342412
                            </h3>
                            <span v-if="false" class="caption grey--text"
                                >Thanks for signing up!</span
                            >
                        </div>
                    </v-window-item>
                </v-window>
            </v-card>
            <v-divider></v-divider>
            <v-card
                class="d-flex align-center justify-space-around"
                height="20%"
                flat
                tile
            >
                <v-btn
                    v-if="step !== 3"
                    :disabled="step === 1"
                    @click="step--"
                    text
                >
                    назад
                </v-btn>
                <v-btn
                    v-if="step !== 3"
                    @click="step++"
                    color="primary"
                    depressed
                >
                    далее
                </v-btn>

                <v-row v-if="step === 3" no-gutters class="mx-4">
                    <v-btn
                        :disabled="true"
                        to="/"
                        color="primary"
                        class="px-4"
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

export default {
    components: {
        // SvgIcon
    },

    computed: {
        currentTitle() {
            switch (this.step) {
                case 1:
                    return 'Ввод данных:';
                case 2:
                    return 'Код подтверждения:';
                default:
                    return 'Связь с облаком...   ';
            }
        }
    },

    data() {
        return {
            step: 1,
            timeout: 59
        };
    }
};
</script>
