<template>
    <!-- <v-container fill-height> -->
    <v-layout align-center justify-center>
        <v-card class="ma-2" max-width="400px" flat tile>
            <v-card-title
                class="title font-weight-regular justify-space-between"
                v-text="title"
            />
            <v-card-text>
                <v-row v-for="(token, i) in tokens" :key="i" no-gutters>
                    <v-col cols="11">
                        <v-text-field
                            :error="
                                token.value.length !== 6 || isNaN(token.value)
                            "
                            :label="token.title"
                            @change="saved = false"
                            v-model="tokens[i].value"
                            placeholder="0 0 0 0 0 0"
                            counter="6"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-btn
                            @click="
                                tokens[i].value = (
                                    Math.random() * 1000000 +
                                    163524
                                )
                                    .toString()
                                    .substring(0, 6);
                                saved = false;
                            "
                            color="default"
                            text
                            fab
                            ><svg-icon name="memory"
                        /></v-btn>
                    </v-col>
                </v-row>
                <span class="caption grey--text text--darken-1 py-0">
                    Коды доступа (6 цифр без пробелов)
                </span>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions
                class="d-flex align-center justify-space-around pt-4"
            >
                <v-btn
                    @click="cancel()"
                    v-text="'назад'"
                    color="warning"
                    text
                />
                <v-btn
                    @click="update()"
                    :disabled="
                        saved ||
                            tokens[0].value.length !== 6 ||
                            tokens[1].value.length !== 6 ||
                            tokens[2].value.length !== 6
                    "
                    v-text="'далее'"
                    color="primary"
                />
            </v-card-actions>
            <!-- {{ '/' + $store.state.version }}
            {{ '/' + $store.state.credentials.token }} -->
        </v-card>
    </v-layout>
    <!-- </v-container> -->
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    created() {
        this.$store.commit('setMenuIcon', 'memory');

        // for (var i = 0; i < this.tokens.length; i++) {
        //     //window.console.log('>>>', this.tokens[i].title);
        //     if (this.tokens[i].value == '') {
        //         this.tokens[i].value = (Math.random() * 1000000 + 163524)
        //             .toString()
        //             .substring(0, 6);
        //         this.saved = false;
        //     }
        // }

        this.timeout = setTimeout(() => {
            this.getTokens();
        }, 1000);
    },

    methods: {
        sendMessage(msg) {
            if (this.$store.state.socket.isConnected)
                this.$store.dispatch('wsSendMessage', msg);
        },

        getTokens() {
            this.sendMessage({
                ep: '/api/device',
                path: 'auth',
                param: {
                    action: 'get'
                },
                token: '__factory__'
            });
        },

        update() {
            this.sendMessage({
                ep: '/api/device',
                path: 'auth',
                param: {
                    action: 'set',
                    tokens: [
                        this.tokens[0].value,
                        this.tokens[1].value,
                        this.tokens[2].value
                    ]
                },
                token: '__factory__'
            });
        },

        cancel() {
            clearTimeout(this.timeout);
            this.$router.go(-1);
        }

        // timer() {
        //     this.code_timeout--;

        //     if (this.code_timeout > 0) {
        //         this.timeout = setTimeout(() => {
        //             this.timer();
        //         }, 1000);
        //     } else {
        //         clearTimeout(this.timeout);
        //         this.code_timeout = 0;
        //     }
        // },
    },

    watch: {
        message: function(msg) {
            if (msg.path == 'auth') {
                if (msg.param.action == 'get' && !msg.result.error) {
                    this.saved = true;
                    for (var i = 0; i < this.tokens.length; i++) {
                        //window.console.log('>>>', this.tokens[i].title);
                        this.tokens[i].value = msg.result[i];
                        if (this.tokens[i].value == '') {
                            this.tokens[i].value = (
                                Math.random() * 1000000 +
                                163524
                            )
                                .toString()
                                .substring(0, 6);
                            this.saved = false;
                        }
                    }
                }
                if (msg.param.action == 'set' && !msg.result.error) {
                    this.saved = true;
                }
            }
        }
    },

    computed: {
        ...mapGetters(['message', 'user'])
    },

    data: () => ({
        timeout: null,
        title: 'Коды доступа к устройству',

        /* user */
        tokens: [
            { title: 'Владелец', value: '' },
            { title: 'Пользователь', value: '' },
            { title: 'Гость', value: '' }
        ],
        saved: true
    })
};
</script>
