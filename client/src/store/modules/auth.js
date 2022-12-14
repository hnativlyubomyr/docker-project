import authService from "@/services/AuthService";

export const auth = {
    namespaced: true,

    state: () => ({
        isAuth: false,
        user: {
            _id: null,
            username: null,
            password: null,
            name: null,
        },
        errorMessage: '',
    }),

    mutations: {
        setIsAuth(state, isValue) {
            state.isAuth = isValue;
        },

        setUser(state, user) {
            state.user = user;
        },

        setErrorMessage(state, message) {
            state.errorMessage = message;
        },
    },

    getters: {
        isAuth(state) {
            return state.isAuth;
        },
        user(state) {
            return state.user;
        },
        errorMessage(state) {
            return state.errorMessage;
        }
    },

    actions: {
        async createAccount({ state, commit }, payload) {
            try {
                const response = await authService.createAccount(payload);
                commit('addNewPost', response.data);
            }
            catch (e) {
                if (e.response.status === 403)
                    commit('setErrorMessage', e.response.data);
                    reject();
                }
            },

        async signIn({ state, commit }, payload) {
            try {
                const response = await authService.signIn(payload);
                commit('setIsAuth', true);
                commit('setUser', response.data.user);
            }
            catch (e) {
                if (e.response.status === 403) {
                    commit('setErrorMessage', e.response.data);
                }
            }
        },

        async authorization({ state, commit }) {
            try {
                const response = await authService.authorization();
                if (response.data) {
                    commit('setIsAuth', response.data.isAuth);
                    commit('setUser', response.data.user);
                }
            }
            catch (e) {
                console.log(e);
            }
        },

        async logOut({ state, commit }) {
            try {
                await authService.logaut();
                commit('setIsAuth', false);
                commit('setUser', null);
            }
            catch (e) {
                console.log(e);
            }
        },
    }
}
