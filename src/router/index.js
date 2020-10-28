import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
const Home = () =>
    import ('../components/Home.vue')
const Welcome = () =>
    import ('../components/welcome.vue')
import '../assets/css/global.css'
const Users = () =>
    import ('../components/user/Users.vue')
const Rights = () =>
    import ('../components/power/Rights.vue')
const Roles = () =>
    import ('../components/power/roles.vue')
const Cate = () =>
    import ('../components/goods/cate.vue')
const Params = () =>
    import ('../components/goods/param.vue')
const Goods = () =>
    import ('../components/goods/list.vue')
const GoodsAdd = () =>
    import ('../components/goods/add.vue')
const Order = () =>
    import ('../components/order/order.vue')
const Report = () =>
    import ('../components/report/report.vue')


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
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Cate
            },
            {
                path: '/params',
                component: Params
            },
            {
                path: '/goods',
                component: Goods,
            },
            {
                path: '/goods/add',
                component: GoodsAdd,
            },
            {
                path: '/orders',
                component: Order,
            },
            {
                path: '/reports',
                component: Report,
            }
        ]
    },

]

const router = new VueRouter({
    routes,
    mode: 'history'
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to将要访问的路径 from代表从哪个路径跳转来，next是一个函数表示放行
    if (to.path === '/login') return next()
        //获取token,如果token为空直接返回登录界面
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router