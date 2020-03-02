import Vue from 'vue';
import App from './App.vue';

import store from "./store";
import router from './router';

import vuetify from './plugins/vuetify';


import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(vuetify, {
  iconfont: "mdi"
});




/* websockets */
import vueNativeSock from 'vue-native-websocket'
if (window.location.hostname === '192.168.127.1') {
  /* local mode only */
  Vue.use(vueNativeSock, 'ws://192.168.127.1/ws', {
    store: store,
    reconnection: true,       // (Boolean) whether to reconnect automatically (false)
    reconnectionDelay: 2000,  // (Number) how long to initially wait before attempting a new (1000) 
  })
}

// my global components
import SvgIcon from '@/components/Svg/Icon.vue';
Vue.component('SvgIcon', SvgIcon)
Vue.config.productionTip = false;

/*const app =*/new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');

// window.console.log('>>> ', app);
