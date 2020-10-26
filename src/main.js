import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/font/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
//配置请求路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

//给请求头(headers)添加Authorization字段,值为token
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //返回config请求字段
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')