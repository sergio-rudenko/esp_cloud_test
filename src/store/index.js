import Vue from 'vue';
import Vuex from 'vuex';
import { isUndefined } from 'util';
const axios = require('axios').default;

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,

    state: {
        version: '0.2',
        startAs: "",
        debug: true,

        timer: null,
        uptime: 0,

        deviceList: [],

        socket: {
            isConnected: null,
            reconnectError: null,
            message: ''
        },

        mqtt: {
            instance: null,
            isConnected: null,
            reconnectError: null,
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

        isMqttConnected: state => {
            return state.mqtt.isConnected;
        },

        message: state => state.socket.message,
        mqttMsg: state => state.mqtt.message,
        event: state => state.event,

        //user: state => state.credentials.user,
        //token: state => state.credentials.token,

        local: state => state.local,
        credentials: state => state.credentials,

        devices: state => state.deviceList

        // devices: state => {

        // return state.deviceList
        //     .filter(function (d) {
        //         //FIXME! filter only target type devices
        //         if (d.data == null) {
        //             d.data = { inputs: 0, outputs: 0 };
        //         }

        //         const targetType = 'FF00';
        //         return d.type == targetType;
        //     })
        //     .sort(function (a, b) {
        //         //TODO: sort devices by status|name
        //         return a.devId > b.devId ? 1 : -1;
        //     });
        //        }
    },

    mutations: {
        _setTimer(state, data) {
            state.timer = data;
        },

        _incUptime(state) {
            state.uptime++;
            //window.console.log('uptime:', state.uptime);
        },

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

        _mqttInstance(state, data) {
            window.console.log('mqttinstance:', data);
            state.mqtt.instance = data;
        },

        MQTT_ONOPEN(state) {
            window.console.log('MQTT_ONOPEN');
            state.mqtt.isConnected = true;
        },

        MQTT_ONERROR(state) {
            window.console.log('MQTT_ONERROR');
            state.mqtt.isConnected = false;
        },

        MQTT_RECONNECT(state, event) {
            window.console.log("MQTT_RECONNECT", event);
            state.mqtt.isConnected = false;
        },

        MQTT_ONMESSAGE(state, message) {
            //state.mqtt.message = message;
            const result = message.destinationName.match(/(.*)\/(.*)\/(.*)/);

            if (result) {
                state.mqtt.message = {
                    type: result[1],
                    devId: result[2],
                    path: result[3],
                    payload: message.payloadString
                };

                if (state.mqtt.message.path === 'status') {
                    this.commit('setDeviceStatus', {
                        type: state.mqtt.message.type,
                        devId: state.mqtt.message.devId,
                        status: JSON.parse(state.mqtt.message.payload)
                    });
                }

                if (state.mqtt.message.path === 'data') {
                    // for (let k = 0; k < state.deviceList.length; k++) {
                    //     if (state.deviceList[k].type == state.mqtt.message.type &&
                    //         state.deviceList[k].devId == state.mqtt.message.devId) {

                    //         //                    if (state.deviceList[k].data != data.data) {
                    //         //state.deviceList[k].data = state.mqtt.message.payload;
                    //         Vue.set(state.deviceList[k], 'data', state.mqtt.message.payload);
                    //         window.console.log('data:', state.deviceList[k].data);
                    //         //                  }
                    //     }
                    // }


                    // window.console.log('data:', state.mqtt.message.payload);
                    this.commit('setDeviceData', {
                        type: state.mqtt.message.type,
                        devId: state.mqtt.message.devId,
                        value: JSON.parse(state.mqtt.message.payload)
                    });
                }
            }
            else {
                window.console.log("ERROR! topic:'" +
                    message.destinationName + "', payload: '" +
                    message.payloadString + "'");
            }
        },

        setDeviceStatus(state, data) {
            for (let k = 0; k < state.deviceList.length; k++) {
                if (state.deviceList[k].type == data.type &&
                    state.deviceList[k].devId == data.devId) {

                    if (state.deviceList[k].online != (data.state != 'offline')) {
                        state.deviceList[k].online = (data.state != 'offline');

                        window.console.log(
                            state.deviceList[k].type + '/' +
                            state.deviceList[k].devId + " online: " +
                            state.deviceList[k].online);
                    }
                }
            }
        },

        setDeviceData(state, data) {
            // window.console.log('setDeviceData: ', data);

            for (let k = 0; k < state.deviceList.length; k++) {
                if (state.deviceList[k].type == data.type &&
                    state.deviceList[k].devId == data.devId) {

                    Vue.set(state.deviceList[k], 'data', data.value);
                    // window.console.log('data:', state.deviceList[k].data);
                }
            }
        },

        updateDeviceList(state, data) {
            // unvalidate list
            state.deviceList.forEach(item => {
                item.checked = false;
            });

            for (let i = 0; i < data.length; i++) {
                let index = -1;

                for (let j = 0; j < state.deviceList.length; j++) {
                    if (state.deviceList[j].type == data[i].type &&
                        state.deviceList[j].devId == data[i].devId) {
                        index = j;
                    }
                }

                if (index < 0) {
                    data[i].checked = true;
                    data[i].online = false;
                    data[i].data = { inputs: 0, outputs: 0 }

                    state.deviceList.push(data[i]);
                    index = state.deviceList.length - 1;

                    this.dispatch(
                        'mqttSubscribe',
                        state.deviceList[index].type + '/' +
                        state.deviceList[index].devId + '/#'
                    );
                }
                else {
                    // Vue.set(state.deviceList[index], 'data', data);
                    // Vue.set(state.deviceList[index], 'online', online);
                    Vue.set(state.deviceList[index], 'checked', true);

                    window.console.log('updated: ',
                        state.deviceList[index].type + '/' +
                        state.deviceList[index].devId);
                }
            }

            // delete & unsubscribe
            for (let k = 0; k < state.deviceList.length; k++) {
                if (state.deviceList[k].checked == false) {
                    this.dispatch(
                        'mqttUnsubscribe',
                        state.deviceList[k].type + '/' +
                        state.deviceList[k].devId + '/#'
                    );
                    state.deviceList.splice(k);
                }
            }
        }
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
                    timeout: 300,
                    useSSL: true,
                    userName: mqtt.user,
                    password: mqtt.pass,
                    cleanSession: false,
                    keepAliveInterval: 60,

                    onSuccess: () => {
                        this.commit('MQTT_ONOPEN');
                    },
                    onFailure: () => {
                        this.commit('MQTT_ONERROR');
                    },
                };

                this.commit('_mqttInstance', new window.Paho.MQTT.Client(
                    mqtt.host, mqtt.port, "/mqtt", mqtt.clientId
                ));

                context.state.mqtt.instance.connect(connectOptions);

                context.state.mqtt.instance.onMessageArrived = (msg) => {
                    this.commit('MQTT_ONMESSAGE', msg);
                };

                context.state.mqtt.instance.onConnectionLost = (res) => {
                    this.commit('MQTT_RECONNECT', res);

                    setTimeout(() => {
                        window.console.log('MQTT: Reconnect attempt');
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
        },

        onEverySec: function (context) {
            if (context.state.timer === null) {
                this.commit('_setTimer', setInterval(
                    () => {
                        if (context.state.uptime % 15 == 0) {
                            axios({
                                method: 'get',
                                //url: 'https://sa100cloud.com/app/kv/aquabast/version',
                                url: 'https://sa100cloud.com/cloud/user/devices',
                                headers: { 'Token': '71ea68c5d042ab636ba9a053a1dda7e2' }
                            })
                                .then(response => this.commit('updateDeviceList', response.data));

                        }
                        this.commit('_incUptime');
                    }, 1000
                ));
            }
        }
    },

    modules: {}
});
