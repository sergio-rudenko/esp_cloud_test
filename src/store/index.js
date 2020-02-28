import Vue from 'vue';
import Vuex from 'vuex';
import { isUndefined } from 'util';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,

    state: {
        version: '0.2',
        startAs: "",
        debug: true,


        socket: {
            isConnected: null,
            reconnectError: null,
            message: ''
        },

        mqtt: {
            isConnected: null,
            reconnectError: null,
            instance: null,
            message: ''
        },

        event: '',

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
                phone: '+79185387721',
                registered: true,
            },
            mqtt: {
                port: 3883,
                host: 'sa100cloud.com',
                clientId: '0c79113e83070d39',
                user: 'b1c2b492c04c829a',
                pass: 'd042675215ce302b'
            },
            token: null
        },

        local: {
            wifi: {
                ssid: '',
                pass: '',
                state: 0
            }
        }
    },

    getters: {
        isWsConnected: state => {
            return state.socket.isConnected;
        },

        message: state => state.socket.message,
        event: state => state.event,

        //user: state => state.credentials.user,
        //token: state => state.credentials.token,

        local: state => state.local,
        credentials: state => state.credentials
    },

    mutations: {
        setStartAs(state, data) {
            window.console.log('setStartAs:', data);
            state.startAs = data;
        },


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
            if (count < 10) {
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

                    // if (msg.event.source === 'wifi') {
                    //     window.console.log("EV::WiFi: ", msg.event);
                    //     if (msg.event.state) {
                    //         state.device.local.wifi.state = msg.event.state;
                    //         state.device.local.wifi.ssid = msg.event.ssid;
                    //         state.device.local.wifi.pass = msg.event.pass;

                    //         if (msg.event.state === 'disconnected')
                    //             state.device.local.wifi.error = msg.event.error;

                    //         if (msg.event.state === 'connected')
                    //             state.device.wifi.error = 0;
                    //     }
                    //     //TODO...
                    // }
                } else {
                    state.socket.message = msg;
                }
            } catch (error) {
                state.socket.message = message;
                window.console.log('::message proceed error: ', message);
            }
        },

        flushWifiNetworkList(state) {
            state.device.wifi.list = [];
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
        },

        setUserCredentials(state, data) {
            window.console.log('setUserCredentials: ', data);
            // user: {
            //     role: 'owner',
            //     name: 'sergio',
            //     mail: 'sergio.rudenko@gmail.com',
            //     phone: '+79185387721'
            // },

            state.credentials.user.name = data.name;
            state.credentials.user.mail = data.mail;
            state.credentials.user.phone = data.phone;
        },

        setCloudToken(state, data) {
            if (state.debug) {
                window.console.log('setCloudToken: ', data);

                if (data.length)
                    state.title = state.title + "*";
            }
            if (data.length) {
                state.credentials.token = data;
                localStorage.setItem('CT', data);
            }
        },

        setMqttInstance(state, data) {
            window.console.log('mqttinstance:', data);
            state.mqtt.instance = data;
        },

        setMqttStatus(state, data) {
            window.console.log('mqttStatus:', data === true ? 'connected' : 'disconnected');
            state.mqtt.isConnected = (data === true);
        },

        setMqttNessage(state, data) {
            state.mqtt.message = data;
            if (state.debug) window.console.log(
                "topic:'" +
                state.mqtt.message.destinationName +
                "', payload: '" +
                state.mqtt.message.payloadString +
                "'"
            );
        }


        // setStartAs(state, data) {
        //     window.console.log('setStartAs:', data);
        //     state.startAs = data;
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
        },

        mqttConnect: function (context) {
            const mqtt = context.state.credentials.mqtt;
            if (!isUndefined(window.Paho.MQTT.Client) && mqtt.clientId !== null
                && mqtt.host !== null && mqtt.port !== null
                && mqtt.user !== null && mqtt.pass !== null) {

                window.console.log("MQTT: connecting to '" + mqtt.host + "' as " + mqtt.user);
                var connectOptions = {
                    timeout: 30,
                    useSSL: true,
                    userName: mqtt.user,
                    password: mqtt.pass,
                    cleanSession: false,
                    keepAliveInterval: 60,

                    onSuccess: () => {
                        this.commit('setMqttStatus', true);
                    },
                    onFailure: () => {
                        this.commit('setMqttStatus', false);
                    },
                };

                this.commit('setMqttInstance', new window.Paho.MQTT.Client(
                    mqtt.host, mqtt.port, "/mqtt", mqtt.clientId
                ));

                context.state.mqtt.instance.connect(connectOptions);

                context.state.mqtt.instance.onMessageArrived = (msg) => {
                    //window.console.log("onMessageArrived", msg);
                    this.commit('setMqttNessage', msg);
                };

                context.state.mqtt.instance.onConnectionLost = (res) => {
                    window.console.log("onConnectionLost", res);
                    this.commit('setMqttStatus', false);


                    setTimeout(() => {
                        window.console.log('MQTT: Automatic reconnect attempt.');
                        this.dispatch('mqttConnect');
                    }, 5000);
                };
            }
            else {
                window.console.log('mqttConnect: Credentials required!', mqtt);
            }
        },

        mqttSubscribe: function (context, filter) {
            if (context.state.mqtt.isConnected) {
                context.state.mqtt.instance.subscribe(filter, {
                    onSuccess: () =>
                        window.console.log("subscribe to '" + filter + "': ok"),
                    onFailure: () =>
                        window.console.log("subscribe to '" + filter + "': FAIL!")
                });
            }
            else {
                window.console.log('mqttSubscribe: is not connected!');
            }
        },

        mqttUnsubscribe: function (context, filter) {
            if (context.state.mqtt.isConnected) {
                context.state.mqtt.instance.subscribe(filter, {
                    onSuccess: () =>
                        window.console.log("unsubscribe from '" + filter + "': ok"),
                    onFailure: () =>
                        window.console.log("unsubscribe from '" + filter + "': FAIL!")
                });
            }
            else {
                window.console.log('mqttUnsubscribe: is not connected!');
            }
        },

        mqttSendMessage: function (context, data) {
            //this.mqtt.send(topic, data, qos, retain);
            var msg = new window.Paho.MQTT.Message(data.payload);
            msg.destinationName = data.topic;
            msg.retained = data.retain || false;
            msg.qos = data.qos || 0;

            context.state.mqtt.instance.send(msg);
        }
    },

    modules: {}
});
