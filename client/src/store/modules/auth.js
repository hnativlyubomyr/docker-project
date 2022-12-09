export const auth = {
    namespaced: true,

    state: () => ({
        isAuth: false,
        user: {
            username: null,
            password: null,
            name: null,
        },
    }),

    getters: {
        isAuth(state) {
            return state.isAuth;
        },
        user(state) {
            return state.user;
        }
    }
}
