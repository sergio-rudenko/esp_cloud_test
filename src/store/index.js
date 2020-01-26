import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,

    state: {
        count: 0,

        message: 'Привет!',

        data: {
            outputs: [
                {
                    title: 'Светодиод 1',
                    description: 'Управление доступно всем',
                    state: 'on'
                },
                {
                    title: 'Светодиод 2',
                    description:
                        'Управление доступно на уровнях доступа "Владелец" и "Пользователь"',
                    state: 'off'
                },
                {
                    title: 'Светодиод 3',
                    description:
                        'Управление доступно на уровнях доступа "Владелец" и "Пользователь"',
                    state: 'on'
                },
                {
                    title: 'Светодиод 4',
                    description: 'Управление доступно только владельцу',
                    state: 'off'
                }
            ]
        },

        application: {
            title: 'ESP::Cloud',
            icon: 'MENU',

            menu: [
                // { heading: 'menu' },
                {
                    title: 'Управление',
                    path: '/control',
                    icon: 'control',
                    disabled: false
                },
                {
                    title: 'Контроль',
                    path: '/status',
                    icon: 'clipboard-check-multiple',
                    disabled: false
                },
                {
                    title: 'Настройки',
                    path: '/settings',
                    icon: 'settings',
                    disabled: false
                },
                {
                    title: 'Устройство',
                    path: '/setup/wifi',
                    icon: 'memory',
                    disabled: false
                },
                { divider: true },
                {
                    title: 'Журнал событий',
                    path: '/journal',
                    icon: 'journal',
                    disabled: true
                },
                { divider: true },
                {
                    title: 'О программе',
                    path: '/about',
                    icon: 'INFO',
                    disabled: true
                }
            ]
        },

        credentials: {
            user: {
                role: 'owner',
                name: 'sergio',
                mail: 'sergio.rudenko@gmail.com',
                phone: '+79185387721'
            },

            wifi: {
                ssid: undefined,
                pass: undefined,
                connected: false,
            }
        }
    },

    mutations: {
        increment(state) {
            state.count++;
        },

        setMenuIcon(state, data) {
            window.console.log('setMenuIcon: ', data);
            state.application.icon = data;
        },

        setOutputUndefined(state, num) {
            window.console.log('setOutputUndefined: ', num);
            state.data.outputs[parseInt(num)].state = 'undefined'
        },

        setOutput(state, data) {
            window.console.log('setOutput: ', data);
            window.console.log('setOutput: ' + data.num + ' -> ' + data.value);
            state.data.outputs[parseInt(data.num)].state = data.value
        }

        // setStartAs(state, data) {
        //     window.console.log('setStartAs:', data);
        //     state.startAs = data;
        // },

        // setCloudStatus(state, data) {
        //     window.console.log('cloudStatus:', data);
        //     state.cloudStatus = data;
        // },

        // this.$store.commit('updateDeviceText', {
        //     deviceUid: this.hostUid,
        //     componentUid: this.component.uid,
        //     name: this.name,
        //     description: this.description
        // });

        // updateDeviceText(state, data) {
        //     window.console.log('updateDeviceText');
        //     window.console.log('host = ' + data.deviceUid);
        //     window.console.log('uid = ' + data.componentUid);
        //     window.console.log('name = ' + data.name);
        //     window.console.log('desc = ' + data.description);

        //     const host_uid = data.deviceUid;
        //     const component_uid = data.componentUid;

        //     var host_device = state.devices.filter(function (h) {
        //         return h.uid == host_uid;
        //     })[0];

        //     window.console.log(host_device);

        //     var component_device = host_device.components.filter(function (c) {
        //         return c.uid == component_uid;
        //     })[0];

        //     window.console.log(component_device);

        //     component_device.name = data.name;
        //     component_device.description = data.description;
        // }
    },

    actions: {},

    modules: {}
});
