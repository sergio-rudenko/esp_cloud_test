<template>
    <div>
        <v-list shaped dense flat>
            <v-list-item
                v-for="(output, i) in outputs"
                :key="i"
                :disabled="output.state === undefined"
                @click="onClick(i)"
                rounded
                dense
            >
                <v-list-item-avatar>
                    <svg-icon
                        :name="output.state === 1 ? 'led-on' : 'led-off'"
                        :color="output.state === 1 ? 'red' : 'darkgray'"
                        size="48px"
                    />
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title
                        class="text-truncate font-weight-regular"
                    >
                        {{ output.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ output.description }}
                    </v-list-item-subtitle>
                </v-list-item-content>

                <!-- <v-switch v-model="$vuetify.theme.dark" @click.prevent /> -->
                <v-btn :loading="output.state === undefined" fab small>{{
                    output.state === 1 ? 'off' : 'on'
                }}</v-btn>
            </v-list-item>
            <v-divider />
        </v-list>

        <p class="text-center font-weight-black mt-8">
            Уровень доступа:
        </p>

        <v-layout align-center justify-center>
            <v-radio-group v-model="roleValue">
                <v-radio
                    v-for="(role, i) in roles"
                    :key="i"
                    :label="role.title"
                    :value="role.value"
                ></v-radio>
            </v-radio-group>
        </v-layout>
        <!-- <div class="text-center">
            <v-btn dark color="red darken-2" @click="snackbar = true">
                Open Snackbar
            </v-btn>
        </div> -->
        <v-snackbar v-model="snackbar" bottom :timeout="3000" color="error">
            {{ snackbarTitle }}
            <v-btn text @click="snackbar = false">
                ЗАКРЫТЬ
            </v-btn>
        </v-snackbar>
    </div>
</template>

<style scoped></style>

<script>
import { mapGetters } from 'vuex';

export default {
    created() {
        this.$store.commit('setTitle', 'Управление:');
    },

    mounted() {
        this.setOutputs();
    },

    methods: {
        setOutputs() {
            for (var i = 0; i < this.outputs.length; i++) {
                // window.console.log('index:', i);
                this.outputs[i].state = (this.deviceOutputs >> i) & 0x1;
            }
        },

        onClick(index) {
            // window.console.log('ACTION: ', index);

            if (
                this.isMqttConnected &&
                this.outputs[index].state !== undefined
            ) {
                var topic = this.device.type + '/' + this.device.devId + '/';

                topic += this.roleValue + '/';
                topic += this.credentials.token + '/req/api/mcu';

                // window.console.log('topic: ', topic, this.roleValue);

                this.$store.dispatch('mqttSendMessage', {
                    topic: topic,
                    payload: JSON.stringify({
                        param: {
                            action: 'cmd',
                            value:
                                ((0x10 + index + 1) << 8) +
                                (this.outputs[index].state === 1 ? 0 : 1)
                        }
                    }),
                    retain: false,
                    qos: 1
                });
                this.outputs[index].state = undefined;
            }
        }
    },

    watch: {
        deviceOutputs() {
            this.setOutputs();
        },

        mqttMsg(value) {
            //window.console.log('mqttMsg: ', value);
            const s = value.topic.split('/');

            if (
                s[0] == this.device.type &&
                s[1] == this.device.devId &&
                s[3] == this.credentials.token &&
                s[4] == 'res'
            ) {
                const result = JSON.parse(value.payload);
                if (result.event) {
                    if (result.event.error) {
                        this.snackbarTitle = result.event.error;
                        this.snackbar = true; // show error
                        this.setOutputs();
                    }
                }
            }
        }
    },

    computed: {
        ...mapGetters([
            'isWsConnected',
            'isMqttConnected',
            'credentials',
            'devices',
            'mqttMsg'
        ]),

        device() {
            const d = this.devices.filter(item => {
                return (
                    item.type == this.$store.state.currentDevice.type &&
                    item.devId == this.$store.state.currentDevice.devId
                );
            });
            return d[0];
        },

        deviceInputs() {
            return this.device.data.inputs;
        },

        deviceOutputs() {
            return this.device.data.outputs;
        }

        // out() {
        //     var data = [];

        //     for (let i = 0; i < 4; i++) {
        //         let value = 'off';

        //         if (this.device) {
        //             value = this.device.data.outputs & (1 << i) ? 'on' : 'off';
        //             //window.console.log('DEVICE: ', this.device);
        //         }

        //         data.push({
        //             state: value
        //         });
        //     }

        //     return data;
        // }
    },

    data() {
        return {
            snackbar: 0,
            snackbarTitle: null,

            roleValue: 1,

            roles: [
                { title: 'Владелец', value: 1 },
                { title: 'Пользователь', value: 2 },
                { title: 'Гость', value: 3 }
            ],

            outputs: [
                {
                    title: 'Светодиод 1',
                    description: 'Доступно всем',
                    state: 0
                },
                {
                    title: 'Светодиод 2',
                    description: '"Владелец" и "Пользователь"',
                    state: 0
                },
                {
                    title: 'Светодиод 3',
                    description: '"Владелец" и "Пользователь"',
                    state: 0
                },
                {
                    title: 'Светодиод 4',
                    description: 'только "Владелец"',
                    state: 0
                }
            ]
        };
    }
};
</script>
