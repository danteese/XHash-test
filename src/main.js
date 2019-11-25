import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io';

Vue.prototype.$http = axios;

// TODO: REMOVE THIS CONFIGURATION, JUST FOR THE TEST
Vue.prototype.$http.defaults.headers.common['authorization'] = "wIKY2PZgFop1r4mK3bexpLgvyGcEAYJalmDZi8nIRcElDOaGiTVD9K0ceTiL";
Vue.prototype.$http.defaults.baseURL = 'https://api.xhash.tech/api/';

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  // debug: true,
  connection: 'https://liveness.xhash.tech:8001/'
}))

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
