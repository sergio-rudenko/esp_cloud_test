<template>
    <div>
        <v-card
            class="ma-2"
            elevation="2"
            v-for="(device, i) in devices"
            @click="onClick(device.type, device.devId)"
            :disabled="!device.online"
            :key="i"
        >
            <v-card-title class="text-truncate font-weight-regular px-2 py-2">
                {{ device.type + '/' + device.devId }}
            </v-card-title>
            <v-card-subtitle class="px-2 py-1">
                {{ 'out ' + device.data.outputs }}
                {{ 'inp ' + device.data.inputs }}
            </v-card-subtitle>
        </v-card>
    </div>

    <!-- <v-list>
            <v-list-item
                v-for="(device, i) in devices"
                :disabled="!device.online"
                :key="i"
                link
            >
                <v-list-item-content>
                    <v-list-item-title>
                        <span>
                            {{ device.type + '/' + device.devId }}
                        </span>
                    </v-list-item-title>
                    <v-list-item-content>
                        {{ 'out ' + device.data.outputs }}
                        {{ 'inp ' + device.data.inputs }}
                    </v-list-item-content>
                </v-list-item-content>
            </v-list-item></v-list
        > -->
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    created() {
        this.$store.commit('setTitle', 'Список устройств:');
    },

    methods: {
        onClick(type, devId) {
            //window.console.log('CLICK: ', type, uuid);
            this.$store.commit('setCurrentDevice', {
                devId: devId,
                type: type
            });

            this.$router.push({ name: 'control' });
        }
    },

    computed: {
        ...mapGetters(['isMqttConnected', 'devices'])
    },

    data() {
        return {};
    }
};
</script>
