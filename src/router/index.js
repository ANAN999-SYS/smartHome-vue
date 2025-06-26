import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
const instance = new Vue();
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes:[
        {
            path: '/',
            name: 'login',
            meta: {title: '登录' ,requireAuth:false},
            component: Login
        },
        {
            path: '/home',
            component: () => import('../components/Home.vue'),
            children:[
                {
                    path: '/dashboard',
                    meta: { title: '数据总览',requireAuth:true },
                    component: () => import('../views/Dashboard.vue')
                },
                {
                    path: '/deviceTable',
                    name: 'deviceTable',
                    meta: { title: '设备信息',requireAuth:true },
                    component: () => import('../views/deviceTable.vue')
                },
                {
                    path: '/scensTable',
                    meta: { title: '情景信息',requireAuth:true },
                    component: () => import('../views/scensTable.vue')
                },
                {
                    path: '/roomTable',
                    meta: { title: '房间信息',requireAuth:true },
                    component: () => import('../views/roomTable.vue')
                },
                {
                    path: '/recordTable',
                    meta: { title: '操作记录',requireAuth:true },
                    component: () => import('../views/recordTable.vue')
                },
                {
                    path: '/feedbackTable',
                    meta: { title: '用户反馈',requireAuth:true },
                    component: () => import('../views/feedbackTable.vue')
                },

                {
                    path: '/userTable',
                    name: 'userTable',
                    meta: { title: '微信用户',requireAuth:true },
                    component: () => import('../views/userTable.vue')
                },
                {
                    path: '/adminTable',
                    meta: { title: '后台用户',requireAuth:true },
                    component: () => import('../views/adminTable.vue')
                },
            ]
        }
    ]

})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    // 检查是否需要身份验证
    if (to.meta.requireAuth && !localStorage.getItem("Token")) {
        if (to.path === "/"){
            next({
                path: "/",
                query: {
                    redirect: to.fullPath
                }
            });
        }
        else {
            instance.$alert('用户登录状态失效，请重新登录', '提示', {
                confirmButtonText: '确定',
                callback:action => {
                    next({
                        path: "/",
                        query: {
                            redirect: to.fullPath
                        }
                    })
                }
            });
        }
    } else if (to.path === "/" && localStorage.getItem("Token")) {
        next("/dashboard");
    } else {
        next();
    }
});

export default router
