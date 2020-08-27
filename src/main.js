import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/css/golbal.css'

import TreeTable from 'vue-table-with-tree-grid'

//axios
import axios from 'axios'
axios.interceptors.request.use(config=> {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);
  return config
})
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'  
Vue.prototype.$http = axios

Vue.component('tree-table',TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
