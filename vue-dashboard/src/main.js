import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { firestorePlugin } from 'vuefire'
import vuetify from './plugins/vuetify';

Vue.use(Vuetify)
Vue.use(firestorePlugin);
new Vue({
  el: '#app',
  vuetify,
  render: h => h(App)
});
