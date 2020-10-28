import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/font/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
//配置请求路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

//给请求头(headers)添加Authorization字段,值为token
//request拦截器中,显示进度条
axios.interceptors.request.use(config => {
        NProgress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token')
            //返回config请求字段
        return config
    })
    //在response 拦截器中,隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
});
Vue.component('tree-table', TreeTable);
Vue.use(VueQuillEditor, /* { default global options } */ )
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')