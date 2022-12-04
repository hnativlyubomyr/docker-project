import { createRouter, createWebHistory } from "vue-router";
import Posts from "@/pages/Posts";
import Auth from "@/pages/Auth";
import UserInfo from "@/pages/UserInfo";
import store from '@/store';

const routes = [
    {
        path: '/',
        name: 'Posts',
        component: Posts,
    },
    {
        path: '/login',
        name: 'Login',
        component: Auth,
    },
    {
        path: '/register',
        name: 'Register',
        component: Auth,
        props: { isRegister: true }

    },
    {
        path: '/user',
        name: 'Info',
        component: UserInfo,
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(),
});

router.beforeEach((to, from, next) => {
    const { isAuth } = store.state.auth;

    if (to.name === 'Info' && !isAuth) {
        next({ name: 'Login' });
        return;
    }

    if (to.name === 'Login' && isAuth) {
        next({ name: 'Posts' });
        return;
    }

    if (to.name === 'Login' && isAuth || to.name === 'Register' && isAuth) {
        next({ name: 'Posts' });
        return;
    }

    next();
})

export default router;
