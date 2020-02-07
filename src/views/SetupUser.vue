<template>
    <v-layout align-center justify-center>
        <v-card class="ma-2" max-width="400px" flat tile>
            <v-card-title
                class="title font-weight-regular justify-space-between"
                v-text="title"
            />
            <v-card-text>
                <v-text-field
                    v-model="phone"
                    :error="phone_wrong"
                    type="number"
                    label="Телефон"
                    counter="16"
                    placeholder
                ></v-text-field>
            </v-card-text>

            <!-- Description -->
            <v-card-text>
                <span class="caption grey--text text--darken-1 py-0">
                    {{ description }}
                </span>
            </v-card-text>

            <v-divider></v-divider>
            <v-card class="d-flex align-center justify-space-around" flat tile>
                <v-card-text>
                    <v-btn
                        @click="test()"
                        v-text="'test'"
                        color="warning"
                        block
                    />
                </v-card-text>
            </v-card>
            <v-card-actions class="d-flex align-center justify-space-around">
                <v-btn v-text="'назад'" />
                <v-btn v-text="'далее'" color="primary" />
            </v-card-actions>
        </v-card>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    created() {
        this.$store.commit('setMenuIcon', 'USER');
    },

    methods: {
        sendMessage(msg) {
            if (this.$store.state.socket.isConnected)
                this.$store.dispatch('wsSendMessage', msg);
        },

        test() {
            this.sendMessage({
                ep: '/api/device',
                path: 'webapi',
                param: {
                    method: 'GET',
                    proto: 'http',
                    host: 'test-cloud.bast.ru',
                    url: '/cloud/user/devices',
                    port: 10495,
                    headers: [
                        {
                            name: 'Token',
                            value: '2cafcbd5d6a86644c8b7f7848fea164f'
                        }
                    ]
                },
                token: '__factory__'
            });
        }
    },

    computed: {
        ...mapGetters(['message'])
    },

    data: () => ({
        timeout: null,

        title: 'Регистрация пользователя',
        description: 'йййццц.',

        /* user */
        phone: null,
        phone_wrong: false
    })
};
</script>
