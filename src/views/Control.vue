<template>
    <div>
        <v-list shaped dense flat>
            <v-list-item
                v-for="(output, i) in outputs"
                :key="i"
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

            if (this.isMqttConnected) {
                var topic = this.device.type + '/' + this.device.devId + '/';

                if (this.device.userRole == 'owner') {
                    topic += '0/';
                }
                if (this.device.userRole == 'user') {
                    topic += '2/';
                }
                if (this.device.userRole == 'guest') {
                    topic += '3/';
                }

                topic += this.credentials.token + '/req/api/mcu';

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
                    retain: true,
                    qos: 1
                });

                this.outputs[index].state = undefined;
            }
        }
    },

    watch: {
        deviceOutputs() {
            this.setOutputs();
        }
    },

    computed: {
        ...mapGetters([
            'isWsConnected',
            'isMqttConnected',
            'devices',
            'credentials'
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
