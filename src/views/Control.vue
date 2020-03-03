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
                        :name="out[i].state === 'on' ? 'led-on' : 'led-off'"
                        :color="out[i].state === 'on' ? 'red' : 'darkgray'"
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
                <v-btn fab small disabled>{{
                    out[i].state === 'on' ? 'off' : 'on'
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

    methods: {
        onClick(index) {
            window.console.log('ACTION: ', index);
        }
    },

    computed: {
        ...mapGetters(['isWsConnected', 'event', 'devices']),

        device() {
            const d = this.devices.filter(item => {
                return (
                    item.type == this.$store.state.currentDevice.type &&
                    item.devId == this.$store.state.currentDevice.devId
                );
            });

            return d[0];
        },

        out() {
            var data = [];

            for (let i = 0; i < 4; i++) {
                let value = 'off';

                if (this.device) {
                    value = this.device.data.outputs & (1 << i) ? 'on' : 'off';
                    //window.console.log('DEVICE: ', this.device);
                }

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
