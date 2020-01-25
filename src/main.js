import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

// global components
import SvgIcon from '@/components/Svg/Icon.vue';
Vue.component('SvgIcon', SvgIcon)

Vue.config.productionTip = false;

/*const app =*/new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');

// window.console.log('>>> ', app);
