import Vue from 'vue'
import App from './App.vue'
import apolloProvider from './apollo'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './plugins'

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
