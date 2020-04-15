import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { firestorePlugin } from 'vuefire'
import vuetify from './plugins/vuetify';

import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(Vuetify)
Vue.use(VueRouter);
Vue.use(firestorePlugin);

const router = new VueRouter({routes});

new Vue({
  el: '#app',
  vuetify,
  router,
  render: h => h(App)
});
