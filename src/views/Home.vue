<template>
    <!-- <v-container fill-height> -->
    <v-layout align-center justify-center>
        <v-card flat>
            <v-card-title>
                <span class="text-center" style="width: 100%; color: darkred;">
                    <h2 class="mt-8">Внимание!</h2>
                </span>
            </v-card-title>
            <v-card-text>
                <p class="text-center" style="width: 100%">
                    Начиная с версии приложения 0.3 для обеспечения доступа к
                    устройству потребуется предварительная авторизация
                    пользователя.
                </p>
                <p class="text-center font-weight-black">
                    Текущая версия: {{ $store.state.version }}
                </p>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-layout text-center wrap class="ma-8">
                    <v-flex>
                        <v-progress-circular
                            v-if="!(isMqttConnected || isWsConnected)"
                            indeterminate
                            color="primary"
                            size="128"
                            >{{ 'connect' }}
                        </v-progress-circular>
                        <v-btn v-else to="/list" color="warning" block
                            >далее</v-btn
                        >
                    </v-flex>
                </v-layout>
            </v-card-actions>

            <!-- <v-card-text>
                    <v-list flat>
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
                        </v-list-item>
                    </v-list>
                </v-card-text> -->
        </v-card>
    </v-layout>
    <!-- </v-container> -->
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        // ...mapState({
        //     localDevice: state => state.device.local
        // })
        ...mapGetters(['isMqttConnected', 'isWsConnected', 'devices'])
    }
};
</script>
