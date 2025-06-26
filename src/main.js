import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import JsonExcel from 'vue-json-excel'
import 'echarts-wordcloud';
import * as echarts from 'echarts'

Vue.component('downloadExcel', JsonExcel)

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts;
Vue.use(VueAxios, axios)

new Vue({
  router,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
