import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import { useUserStore } from '@/store/user.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes = [{
        path: '/',
        name: 'home',
        component: Home,
        redirect: '/dashboard',
        children: [{
                path: '/dashboard',
                name: 'dashboard',
                component: () =>
                    import ('../views/Dashboard.vue')
            },
            {
                path: '/setting',
                name: 'setting',
                component: () =>
                    import ('../views/Setting.vue')
            }
        ]
    }, {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            next: true
        }
    },
    {
        path: '/info',
        name: 'info',
        component: () =>
            import ('../views/Info.vue'),
    },
    {
        path: '/passworld',
        name: 'passworld',
        component: () =>
            import ('../views/Passworld.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    NProgress.start();
    let userStore = useUserStore();

    if (userStore.uid) {
        return next();
    }

    if (!to.meta.next) {
        next({ name: 'login' });
    } else {
        next();
    }
})

router.afterEach(() => {
    NProgress.done();
})

export default router