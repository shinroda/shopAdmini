import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 富文本插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import './assets/css/global.css'
import './assets/js/global.js'

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
