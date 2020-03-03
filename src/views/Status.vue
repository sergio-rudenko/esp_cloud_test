<template>
    <div style="width: 100%; height: 100%;">
        <v-card flat tile height="50%">
            <span class="font-weight-bold ma-4">
                Органы управления:
            </span>
            <v-row>
                <v-col cols="6">
                    <v-row v-for="(jumper, i) in jumpers" :key="i">
                        <v-col
                            cols="2"
                            class="d-flex align-center justify-center pa-0 ml-4"
                        >
                            <svg-icon
                                :color="
                                    jumper.state === true ? 'red' : 'darkgray'
                                "
                                :name="
                                    jumper.state === true
                                        ? 'lightbulb-on-outline'
                                        : 'lightbulb-off-outline'
                                "
                            />
                        </v-col>
                        <v-col style="font-size: 0.9rem;">
                            {{ jumper.title }}
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6">
                    <v-row v-for="(button, i) in buttons" :key="i">
                        <v-col
                            cols="2"
                            class="d-flex align-center justify-center pa-0 ml-4"
                        >
                            <svg-icon
                                :color="
                                    button.state === true ? 'red' : 'darkgray'
                                "
                                :name="
                                    button.state === true
                                        ? 'lightbulb-on-outline'
                                        : 'lightbulb-off-outline'
                                "
                            />
                        </v-col>
                        <v-col style="font-size: 0.9rem;">
                            {{ button.title }}
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card>
        <v-card flat tile height="50%">
            <v-divider class="py-2" />
            <span class="font-weight-bold ma-4">
                Температура:
            </span>

            <v-layout justify-center class="pb-4">
                <v-progress-circular
                    :rotate="-90"
                    :size="100"
                    :width="12.5"
                    :value="(temperature.current * 100) / 50"
                    :color="temperatureColor"
                >
                    {{ temperature.current }}
                </v-progress-circular>
            </v-layout>

            <v-sparkline
                :fill="graph.fill"
                :gradient="graph.gradient"
                :line-width="graph.lineWidth"
                :padding="graph.padding"
                :smooth="graph.radius || false"
                :value="temperature.history"
                :labels="graph.labels"
                auto-draw
            ></v-sparkline>
        </v-card>

        <!-- <v-layout>
        
        </v-layout>

        <v-divider class="py-2" />
        <span class="font-weight-bold ma-4">
            Температура:
        </span>

        <v-layout justify-center class="pb-4">
            <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="12.5"
                :value="(temperature.current * 100) / 50"
                :color="temperatureColor"
            >
                {{ temperature.current }}
            </v-progress-circular>
        </v-layout>

        <span
            class="ma-auto"
            style="background: #F5F5F5; width: 100%; height: 100%;"
        >
            <v-sparkline
                height="128"
                :fill="graph.fill"
                :gradient="graph.gradient"
                :line-width="graph.lineWidth"
                :padding="graph.padding"
                :smooth="graph.radius || false"
                :value="temperature.history"
                :labels="graph.labels"
                auto-draw
            ></v-sparkline>
        </span> -->
    </div>
</template>

<style scoped></style>

<script>
const gradients = [
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea']
];

import { mapGetters } from 'vuex';

export default {
    created() {
        this.$store.commit('setTitle', 'Контроль:');
    },

    computed: {
        ...mapGetters(['isWsConnected', 'isMqttConnected', 'devices']),

        device() {
            const d = this.devices.filter(item => {
                return (
                    item.type == this.$store.state.currentDevice.type &&
                    item.devId == this.$store.state.currentDevice.devId
                );
            });
            return d[0];
        },

        jumpers() {
            var j = [];

            for (let i = 0; i < 4; i++) {
                let value = false;

                if (this.device) {
                    value =
                        this.device.data.inputs & (1 << (i + 4)) ? false : true;
                }

                j.push({
                    title: 'Джампер №' + (i + 1),
                    state: value
                });
            }

            return j;
        },

        buttons() {
            var b = [];

            for (let i = 0; i < 4; i++) {
                let value = false;

                if (this.device) {
                    value = this.device.data.inputs & (1 << i) ? false : true;
                }

                b.push({
                    title: 'Кнопка №' + (i + 1),
                    state: value
                });
            }

            return b;
        },

        temperatureColor() {
            var color = 'gray';

            if (this.temperature.current <= 25.0) color = 'green';
            else if (this.temperature.current <= 35.0) color = 'orange';
            else color = 'red';

            return color;
        }
    },

    data() {
        return {
            temperature: {
                current: 0.0,
                history: [
                    25.5,
                    22.4,
                    25.0,
                    25.1,
                    23.3,
                    18.1,
                    20.0,
                    26.4,
                    30.1,
                    28.2,
                    23.4,
                    21.5,
                    20.7
                ]
            },
            graph: {
                showLabels: false,
                lineWidth: 1,
                labelSize: 7,
                labels: [
                    '-12',
                    '-11',
                    '-10',
                    '-9',
                    '-8',
                    '-7',
                    '-6',
                    '-5',
                    '-4',
                    '-3',
                    '-2',
                    '-1',
                    '0'
                ],
                radius: 10,
                padding: 8,
                lineCap: 'round',
                gradient: gradients[3],
                gradientDirection: 'top',
                gradients,
                fill: true,
                type: 'trend',
                autoLineWidth: false
            }
        };
    }
};
</script>
