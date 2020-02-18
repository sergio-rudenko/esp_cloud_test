<template>
    <v-layout align-center justify-center>
        <v-card class="ma-2" max-width="400px" flat tile>
            <v-card-title
                class="title font-weight-regular justify-space-between"
                v-text="title"
            />
            <v-card-text>
                <v-text-field
                    v-model="phone_raw"
                    :error="phone === null && phone_raw != ''"
                    :loading="process_auth || process_local"
                    label="Телефон"
                    placeholder="X (XXX) XXX-XXXX"
                    counter="16"
                    prefix="+"
                ></v-text-field>
            </v-card-text>

            <!-- Description -->
            <v-card-text>
                <span class="caption grey--text text--darken-1 py-0">
                    {{ description }}
                </span>
            </v-card-text>

            <v-divider></v-divider>
            <!-- <v-card class="d-flex align-center justify-space-around" flat tile>
                <v-card-text>
                    <v-btn
                        @click="test()"
                        v-text="'test'"
                        color="warning"
                        block
                    />
                </v-card-text>
            </v-card> -->
            <v-card-actions
                class="d-flex align-center justify-space-around pt-4"
            >
                <v-btn
                    @click="disableUplink()"
                    :loading="process_local"
                    color="warning"
                    text
                >
                    Локальный режим
                </v-btn>
                <v-btn
                    @click="register()"
                    :disabled="phone === null"
                    v-text="'далее'"
                    color="primary"
                />
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

        register() {
            this.sendMessage({
                ep: '/api/device',
                path: 'webapi',
                param: {
                    method: 'POST',
                    proto: 'http',
                    host: 'test-cloud.bast.ru',
                    url: '/cloud/user/registration',
                    port: 10495,
                    headers: [
                        {
                            name: 'Content-Type',
                            value: 'application/json'
                        }
                    ],
                    payload: {
                        name: 'owner',
                        phone: this.phone2cloud
                    }
                },
                token: '__factory__'
            });

            this.process_auth = true;

            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                window.location.reload();
            }, 15000);
        },

        authorize() {
            this.sendMessage({
                ep: '/api/device',
                path: 'webapi',
                param: {
                    method: 'POST',
                    proto: 'http',
                    host: 'test-cloud.bast.ru',
                    url: '/cloud/user/authorize',
                    port: 10495,
                    headers: [
                        {
                            name: 'Content-Type',
                            value: 'application/json'
                        }
                    ],
                    payload: {
                        userId: this.phone2cloud
                    }
                },
                token: '__factory__'
            });

            this.process_auth = true;
            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                window.location.reload();
            }, 15000);
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

            this.process_local = true;
            clearTimeout(this.timeout);

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                window.location.reload();
            }, 15000);
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

    watch: {
        phone: function(value) {
            if (value != '') {
                this.phone_raw = value;
            }
        },

        event: function(value) {
            const msg = JSON.parse(value);
            /* proceed events */
            if (msg.event.source === 'webrequest') {
                // user already exists
                if (msg.event.result.code == 400) {
                    if (
                        msg.event.url ==
                        'http://test-cloud.bast.ru:10495/cloud/user/registration'
                    ) {
                        window.console.log(
                            'ERROR(registration): ',
                            msg.event.result.payload
                        );
                        this.authorize();
                    }

                    if (
                        msg.event.url ==
                        'http://test-cloud.bast.ru:10495/cloud/user/authorize'
                    ) {
                        this.process_auth = false;
                        clearTimeout(this.timeout);

                        window.console.log(
                            'ERROR(authorize): ',
                            msg.event.result.payload
                        );
                    }
                }

                if (msg.event.result.code == 200) {
                    this.process_auth = false;
                    clearTimeout(this.timeout);

                    window.console.log('OK!');
                    this.$router.push({ path: '/setup/code' });
                }
            }
        }
    },

    computed: {
        ...mapGetters(['event']),

        phone() {
            const p = this.phone_raw;
            let c = ('' + p).replace(/\D/g, '');
            let a = c.match(/^(\d{2})(\d{3})(\d{3})(\d{4})$/);
            if (!a) {
                a = c.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
            }
            //FIXME!
            if (a) {
                if (a[1] === '8') {
                    a[1] = '7';
                }
            }
            return a ? a[1] + ' (' + a[2] + ') ' + a[3] + '-' + a[4] : null;
        },

        phone2cloud() {
            const p = this.phone_raw;
            let c = ('' + p).replace(/\D/g, '');
            let a = c.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
            //FIXME!
            if (a) {
                if (a[1] === '8') {
                    a[1] = '7';
                }
            }
            return a ? '+' + a[1] + a[2] + a[3] + a[4] : null;
        }
    },

    data: () => ({
        timeout: null,
        process_auth: false,
        process_local: false,

        title: 'Регистрация пользователя',
        description:
            'На этот номер телефона будет выслан код \
            подтверждения регистрации нового пользователя \
            или аутентификации существующего аккаунта',

        /* user */
        phone_raw: ''
    })
};
</script>
