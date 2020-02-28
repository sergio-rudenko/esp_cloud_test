<template>
    <!-- <v-container fill-height> -->
    <v-layout align-center justify-center>
        <v-card class="ma-2" max-width="400px" flat tile>
            <v-card-title
                class="title font-weight-regular justify-space-between"
                v-text="title"
            />
            <v-card-text>
                <v-text-field
                    v-model="code_raw"
                    :error="code_raw.length > 0 && code_raw.length < 6"
                    :loading="process_code"
                    placeholder="0 0 0 0 0 0"
                    counter="6"
                    type="number"
                ></v-text-field>
            </v-card-text>

            <!-- Description -->
            <v-card-text>
                <span class="caption grey--text text--darken-1 py-0">
                    Введите код (6 цифр без пробелов), отправленный на номер
                    {{ this.user.phone }}. Повторная отправка кода возможна
                    через {{ code_timeout }}
                    секунд
                </span>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions
                class="d-flex align-center justify-space-around pt-4"
            >
                <v-btn
                    v-if="code_raw.length === 6"
                    @click="confirm()"
                    :disabled="code_raw.length !== 6"
                    v-text="'далее'"
                    color="primary"
                    block
                />
                <v-btn
                    v-else
                    @click="request()"
                    :disabled="code_timeout !== 0"
                    v-text="'Запросить код'"
                    :color="wrong_code ? 'error' : 'primary'"
                    block
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
        this.$store.commit('setMenuIcon', 'EDIT');

        this.code_timeout = 60;
        this.timer();
    },

    methods: {
        sendMessage(msg) {
            if (this.$store.state.socket.isConnected)
                this.$store.dispatch('wsSendMessage', msg);
        },

        timer() {
            this.code_timeout--;

            if (this.code_timeout > 0) {
                this.timeout = setTimeout(() => {
                    this.timer();
                }, 1000);
            } else {
                clearTimeout(this.timeout);
                this.code_timeout = 0;
            }
        },

        request() {
            var msg = {
                ep: '/api/device',
                path: 'webapi',
                param: {
                    method: 'POST',
                    proto: 'http',
                    host: 'test-cloud.bast.ru',
                    port: 10495,
                    payload: {}
                },
                token: '__factory__'
            };

            if (this.user.registered) {
                msg.param.url = '/cloud/user/authorize';
                msg.param.payload.userId = this.user.phone;
            } else {
                msg.param.url = '/cloud/user/registration';
                msg.param.payload.name = 'owner';
                msg.param.payload.phone = this.user.phone;
            }
            this.sendMessage(msg);

            this.process_code = false;
        },

        confirm() {
            this.sendMessage({
                ep: '/api/device',
                path: 'webapi',
                param: {
                    method: 'POST',
                    proto: 'http',
                    host: 'test-cloud.bast.ru',
                    url: '/cloud/user/code',
                    port: 10495,
                    payload: {
                        userId: this.user.phone,
                        code: this.code_raw
                    }
                },
                token: '__factory__'
            });

            this.process_code = true;

            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                window.location.reload();
            }, 15000);
        }
    },

    watch: {
        event: function(value) {
            const msg = JSON.parse(value);
            /* proceed events */
            if (msg.event.source === 'webrequest') {
                // user already exists
                if (msg.event.result.code == 400) {
                    window.console.log(
                        'ERROR: ',
                        msg.event.result.code,
                        msg.event.result.headers,
                        msg.event.result.payload
                    );

                    this.code_raw = '';
                    this.wrong_code = true;
                    this.process_code = false;
                    this.code_timeout = 0;

                    clearTimeout(this.timeout);
                }

                if (msg.event.result.code == 200) {
                    if (this.process_code) {
                        this.process_code = false;
                        clearTimeout(this.timeout);
                        // -----
                        // [HTTP-Client][handleHeaderResponse] RX: 'HTTP/1.1 200 OK'
                        // [HTTP-Client][handleHeaderResponse] RX: 'Date: Wed, 19 Feb 2020 09:52:38 GMT'
                        // [HTTP-Client][handleHeaderResponse] RX: 'Token: b5f0f0ad8e879c8cff2c4f51e6501cde                                             '
                        // [HTTP-Client][handleHeaderResponse] RX: 'Content-Type: text/json'
                        // [HTTP-Client][handleHeaderResponse] RX: 'Transfer-Encoding: chunked'
                        // [HTTP-Client][handleHeaderResponse] RX: 'Server: Jetty(9.4.8.v20171121)'
                        // [HTTP-Client][handleHeaderResponse] RX: ''
                        // [HTTP-Client][handleHeaderResponse] code: 200
                        // [HTTP-Client][handleHeaderResponse] Transfer-Encoding: chunked
                        // [HTTP-Client] read chunk len: 153
                        // [HTTP-Client][writeToStreamDataBlock] end of chunk or data (transferred: 153).
                        // [HTTP-Client] read chunk len: 0
                        // [HTTP-Client][end] still data in buffer (2), clean up.
                        // [HTTP-Client][end] tcp keep open for reuse
                        // {"name":"sergio","phone":"+79185387721","email":"","mqttClientId":"7892515c47eed527","mqttUsername":"3cb9b92df073a9fd","mqttPassword":"dfca3ca1c67d70ad"}

                        // [HTTP-Client][end] tcp keep open for reuse
                        // Web Request event: '{"event":{"source":"webrequest","url":"http://test-cloud.bast.ru:10495/cloud/user/code",
                        // "result":{"code":200,"payload":"{\"name\":\"sergio\",\"phone\":\"+79185387721\",\"email\":\"\",\"mqttClientId\":\"7892515c47eed527\"                                             ,\"mqttUsername\":\"3cb9b92df073a9fd\",\"mqttPassword\":\"dfca3ca1c67d70ad\"}"}}}'
                        var payload = JSON.parse(msg.event.result.payload);
                        window.console.log(
                            'OK: ',
                            msg.event.result.code,
                            msg.event.result.headers,
                            payload
                        );

                        var token = msg.event.result.headers.Token;
                        this.$store.commit('setCloudToken', token);

                        this.$router.push({ path: '/setup/tokens' });
                    } else {
                        /* new code requested */
                        this.code_timeout = 60;
                        this.timer();
                    }
                }
            }
        }
    },

    computed: {
        ...mapGetters(['event', 'user'])
    },

    data: () => ({
        timeout: null,
        wrong_code: false,
        process_code: false,

        title: 'Код подтверждения',

        /* user */
        code_raw: '',
        code_timeout: 60
        ///
    })
};
</script>
