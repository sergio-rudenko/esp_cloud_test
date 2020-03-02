<template>
    <div>
        <v-card
            v-for="(output, i) in outputs"
            :key="i"
            class="ma-2"
            elevation="4"
        >
            <v-row no-gutters>
                <v-col cols="2" class="d-flex align-center justify-center">
                    <svg-icon
                        :name="out[i].state === 'on' ? 'led-on' : 'led-off'"
                        :color="out[i].state === 'on' ? 'red' : 'darkgray'"
                        size="48px"
                    />
                </v-col>
                <v-col>
                    <!-- <div v-if="isOwner">
                        <v-text-field
                            required
                            v-model="model[i].title"
                            :placeholder="output.title"
                            hint="Наименование устройства"
                            counter="32"
                            class="mx-4"
                        ></v-text-field>
                        <v-textarea
                            rows="1"
                            required
                            auto-grow
                            v-model="model[i].description"
                            :placeholder="output.description"
                            hint="Дополнительная информация"
                            counter="128"
                            class="mx-4 mb-2"
                            style="font-size: 0.8rem;"
                        ></v-textarea>
                    </div>-->
                    <div>
                        <v-card-title
                            class="text-truncate font-weight-regular px-2 py-2"
                            >{{ output.title }}</v-card-title
                        >
                        <v-card-subtitle class="px-2 py-1">{{
                            output.description
                        }}</v-card-subtitle>
                    </div>
                </v-col>
            </v-row>
            <v-divider />
            <v-card-actions class="ma-auto">
                <v-layout justify-center>
                    <v-btn
                        :loading="output.state === 'undefined'"
                        :disabled="true"
                        @click="action = i"
                        color="primary"
                        class="mx-0"
                        >{{
                            out[i].state === 'on' ? 'отключить' : 'включить'
                        }}</v-btn
                    >

                    <!-- <v-btn
                        v-if="isOwner"
                        :disabled="output.titleModified === output.title"
                        @click="save = i"
                        color="warning"
                        class="mx-1"
                    >сохранить</v-btn>-->
                </v-layout>
            </v-card-actions>
        </v-card>
    </div>
</template>

<style scoped></style>

<script>
import { mapGetters } from 'vuex';

export default {
    methods: {},

    computed: {
        ...mapGetters(['isWsConnected', 'event', 'devices']),

        out() {
            var data = [];

            for (let i = 0; i < 8; i++) {
                let value = 'off';

                if (this.devices[1])
                    value =
                        this.devices[1].data.outputs & (1 << i) ? 'on' : 'off';

                data.push({
                    state: value
                });
            }

            return data;
        },

        outputs() {
            return this.$store.state.data.outputs;
        },

        isOwner() {
            return this.$store.state.credentials.user.role === 'owner';
        }
    },

    watch: {
        action() {
            const n = this.action;

            if (n !== null) {
                const state = this.outputs[n].state;
                this.$store.commit('setOutputUndefined', n);

                setTimeout(
                    () =>
                        this.$store.commit('setOutput', {
                            num: n,
                            value: state === 'on' ? 'off' : 'on'
                        }),
                    3000
                );
                this.action = null;
            }
        }
    },

    data() {
        return {
            action: ''
        };
    }
};
</script>
