<template>
    <div>
        <v-card
            v-for="(device, i) in output"
            :key="i"
            class="ma-2"
            elevation="4"
        >
            <v-row no-gutters>
                <v-col cols="2" class="d-flex align-center justify-center">
                    <svg-icon
                        :name="device.state === 'on' ? 'led-on' : 'led-off'"
                        :color="device.state === 'on' ? 'red' : 'darkgray'"
                        size="48px"
                    />
                </v-col>
                <v-col>
                    <div v-if="isOwner">
                        <v-text-field
                            required
                            v-model="device.titleModified"
                            placeholder="device.title"
                            counter="32"
                            hint="Наименование устройства"
                            class="mx-4"
                        ></v-text-field>
                        <v-textarea
                            rows="1"
                            required
                            auto-grow
                            v-model="device.description"
                            hint="Дополнительная информация"
                            counter="128"
                            class="mx-4 mb-2"
                            style="font-size: 0.8rem;"
                        ></v-textarea>
                    </div>
                    <div v-else>
                        <v-card-title
                            class="text-truncate font-weight-regular px-2 py-2"
                        >
                            {{ device.title }}
                        </v-card-title>
                        <v-card-subtitle class="px-2 py-1">{{
                            device.description
                        }}</v-card-subtitle>
                    </div>
                </v-col>
            </v-row>
            <v-divider />
            <v-card-actions class="ma-auto">
                <v-layout :justify-end="isOwner" :justify-center="!isOwner">
                    <v-btn
                        :loading="output[i].state === 'undefined'"
                        :disabled="output[i].state === 'undefined'"
                        @click="action = i"
                        color="primary"
                        class="mx-0"
                    >
                        отключить
                    </v-btn>

                    <v-btn
                        v-if="isOwner"
                        :disabled="device.titleModified === device.title"
                        @click="save = i"
                        color="warning"
                        class="mx-1"
                    >
                        сохранить
                    </v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </div>
</template>

<style scoped></style>

<script>
import SvgIcon from '@/components/Svg/Icon.vue';

export default {
    components: {
        SvgIcon
    },

    computed: {
        isOwner() {
            return false;
        }
    },

    watch: {
        action() {
            const n = this.action;

            if (n !== null) {
                this.output[n].state = 'undefined';

                setTimeout(() => (this.output[n].state = 'on'), 3000);
                this.action = null;
            }
        }
    },

    data() {
        return {
            action: '',

            output: [
                {
                    title: 'Светодиод 1',
                    titleModified: 'Светодиод 1',
                    description: 'Управление доступно всем',
                    state: 'on'
                },
                {
                    title: 'Светодиод 2',
                    titleModified: 'Светодиод 2',

                    description:
                        'Управление доступно на уровнях доступа "Владелец" и "Пользователь"',
                    state: 'off'
                },
                {
                    title: 'Светодиод 3',
                    titleModified: 'Светодиод 3',

                    description:
                        'Управление доступно на уровнях доступа "Владелец" и "Пользователь"',
                    descriptionModified: '',

                    state: 'on'
                },
                {
                    title: 'Светодиод 4',
                    titleModified: 'Светодиод 4',

                    description: 'Управление доступно только владельцу',
                    state: 'off'
                }
            ]
        };
    }
};
</script>
