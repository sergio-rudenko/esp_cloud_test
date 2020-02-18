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
                wifi: {
                    status: null,
                    ssid: null,
                    list: []
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

        wifiNetworkList: state => {
            return state.device.local.wifi.list;
        },

        wifiStatus: state => {
            return state.device.local.wifi.status;
        },

        wifiSSID: state => {
            return state.device.local.wifi.ssid;
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
            if (count < 5) {
                window.console.info('ws reconnect attempt: #', count);
                state.socket.isConnected = false;
            }
            else {
                window.location.reload();
            }
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
                        window.console.log("EV::InitialState: ", msg.event);

                        state.device.local.mode = msg.event.mode;
                        state.device.local.wifi.status = msg.event.wifi.sta.status;
                        state.device.local.wifi.ssid = msg.event.wifi.sta.ssid;

                        //TODO...
                    }

                    if (msg.event.source === 'wifi') {
                        window.console.log("EV::WiFi: ", msg.event);
                        if (msg.event.state) {
                            state.device.local.wifi.state = msg.event.state;
                            state.device.local.wifi.ssid = msg.event.ssid;
                            state.device.local.wifi.pass = msg.event.pass;

                            if (msg.event.state === 'disconnected')
                                state.device.local.wifi.error = msg.event.error;

                            if (msg.event.state === 'connected')
                                state.device.local.wifi.error = 0;
                        }
                        //TODO...
                    }
                } else {
                    state.socket.message = msg;

                    /* wifi ntwork scan result */
                    if (msg.path == 'wifi' && msg.param.action == 'scan' &&
                        msg.result.length > 0) {
                        // window.console.log('WIFI scan: ', msg);
                        state.device.local.wifi.list = msg.result;
                    }
                }
            } catch (error) {
                state.socket.message = message;
                window.console.log('::message proceed error: ', message);
            }
        },

        flushWifiNetworkList(state) {
            state.device.local.wifi.list = [];
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
        wsSendMessage: function (context, message) {
            const msg = JSON.stringify(message);
            if (this.state.debug) window.console.log('wsSendMessage: ', msg);

            Vue.prototype.$socket.send(msg);
        }
    },

    modules: {}
});
