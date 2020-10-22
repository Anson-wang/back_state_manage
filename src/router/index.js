import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
const Home = () =>
    import ('../components/Home.vue')
import '../assets/css/global.css'


Vue.use(VueRouter)

const routes = [{
        path: '',
        redirect: '/login'
    }, {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router