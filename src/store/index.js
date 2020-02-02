import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,

    state: {
        debug: true,

        socket: {
            isConnected: null,
            reconnectError: null,
            message: ''
        },
        event: '',

        device: {
            local: {
                mode: 0,
                auth: {
                    configured: false
                },
                wifi: {
                    configured: false,
                    mode: null,
                    ssid: null
                }
            },
            remote: []
        },

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
                connected: false
            }
        }
    },

    getters: {
        isWsConnected: state => {
            return state.socket.isConnected;
        },

        message: state => state.socket.message,
        event: state => state.event
    },

    mutations: {
        /* websocket */
        SOCKET_ONOPEN(state, event) {
            //Vue.prototype.$socket = event.currentTarget
            state.socket.isConnected = true;
            window.console.log('ws open ', event);
        },
        SOCKET_ONCLOSE(state, event) {
            if (state.socket.isConnected) {
                window.console.log('ws closed ', event);

                state.message = null;
                state.event = null;

                state.socket.isConnected = false;
            }
        },
        SOCKET_ONERROR(state, event) {
            window.console.log('ws error ', state, event);
        },
        // mutations for reconnect methods
        SOCKET_RECONNECT(state, count) {
            //window.console.info("ws reconnect: ", state, count)
            window.console.info('ws reconnect attempt: #', count);
            state.socket.isConnected = false;
        },
        SOCKET_RECONNECT_ERROR(state) {
            state.socket.reconnectError = true;
            window.console.info('ws reconnect error..');
        },
        // default handler called for all methods
        SOCKET_ONMESSAGE(state, message) {
            try {
                const msg = JSON.parse(message.data);
                //window.console.log("::message proceed: ", msg);

                if (msg.event) {
                    /* store event */
                    state.event = message.data;

                    /* proceed events */
                    if (msg.event.source === 'state') {
                        /* local device state, received after connection */
                        //window.console.log("::event state: ", msg.event);

                        state.device.local.mode = msg.event.mode;
                        state.device.local.auth.configured =
                            msg.event.auth_configured;
                        state.device.local.wifi.configured =
                            msg.event.wifi_configured;

                        if (msg.event.wifi_configured) {
                            state.device.local.wifi.mode = msg.event.wifi_mode;
                            state.device.local.wifi.sta.ssid =
                                msg.event.wifi_ssid;
                        } else {
                            state.device.local.wifi.mode = 'SoftAP';
                        }

                        //TODO...
                    }

                    if (msg.event.source === 'wifi') {
                        state.device.local.wifi.mode = msg.event.mode;

                        if (msg.event.state) {
                            state.device.local.wifi.sta.ssid = msg.event.ssid;
                            state.device.local.wifi.sta.state = msg.event.state;

                            if (msg.event.state === 'disconnected')
                                state.device.local.wifi.sta.reason =
                                    msg.event.reason;
                        }
                        //TODO...
                    }
                } else {
                    state.socket.message = msg;
                }
            } catch (error) {
                state.socket.message = message;
                window.console.log('::message proceed error: ', message);
            }
        },

        /* other */
        increment(state) {
            state.count++;
        },

        setMenuIcon(state, data) {
            window.console.log('setMenuIcon: ', data);
            state.application.icon = data;
        },

        setOutputUndefined(state, num) {
            window.console.log('setOutputUndefined: ', num);
            state.data.outputs[parseInt(num)].state = 'undefined';
        },

        setOutput(state, data) {
            window.console.log('setOutput: ', data);
            window.console.log('setOutput: ' + data.num + ' -> ' + data.value);
            state.data.outputs[parseInt(data.num)].state = data.value;
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

    actions: {
        wsSendMessage: function(context, message) {
            const msg = JSON.stringify(message);
            if (this.state.debug) window.console.log('wsSendMessage: ', msg);

            Vue.prototype.$socket.send(msg);
        }
    },

    modules: {}
});
