import Vue from 'vue';
import App from './App.vue';

import store from "./store";
import router from './router';
import vuetify from './plugins/vuetify';

/* websockets */
import vueNativeSock from 'vue-native-websocket'
Vue.use(vueNativeSock, 'ws://192.168.127.1/ws', {
  store: store,
  reconnection: true,       // (Boolean) whether to reconnect automatically (false)
  // reconnectionDelay: 1000,  // (Number) how long to initially wait before attempting a new (1000) 
})

// global components
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
