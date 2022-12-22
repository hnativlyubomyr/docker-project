import { createRouter, createWebHistory } from "vue-router";
import Posts from "@/pages/Posts";
import Auth from "@/pages/Auth";
import UserInfo from "@/pages/UserInfo";
import store from '@/store';
import { navigation } from "@/router/dictionary";

const routes = [
    {
        path: navigation.posts.path,
        name: navigation.posts.name,
        component: Posts,
    },
    {
        path: navigation.login.path,
        name: navigation.login.name,
        component: Auth,
    },
    {
        path: navigation.register.path,
        name: navigation.register.name,
        component: Auth,
        props: { isRegister: true }

    },
    {
        path: navigation.user.path,
        name: navigation.user.name,
        component: UserInfo,
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(),
});

const isAuthenticated = async () => {
    await store.dispatch('auth/authorization');

    return store.state.auth.isAuth;
}

router.beforeEach(async (to, from, next) => {
    let { isAuth } = store.state.auth;

    isAuth = isAuth || await isAuthenticated();

    if (to.name === navigation.user.name && !isAuth) {
        return next({ name: navigation.login.name });
    }

    if ((to.name === navigation.login.name || to.name === navigation.register.name) && isAuth) {
        return isAuth ? next({ name: navigation.posts.name }) : next();
    }

    next();
})

export default router;
