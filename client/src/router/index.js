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

router.beforeEach((to, from, next) => {
    const { isAuth } = store.state.auth;

    if (to.name === navigation.user.name && !isAuth) {
        next({ name: navigation.login.name });
        return;
    }

    if (to.name === navigation.login.name && isAuth) {
        next({ name: navigation.posts.name });
        return;
    }

    if (to.name === navigation.login.name && isAuth || to.name === navigation.register.name && isAuth) {
        next({ name: navigation.posts.name });
        return;
    }

    next();
})

export default router;
