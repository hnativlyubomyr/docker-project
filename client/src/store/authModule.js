export const authModule = {
    namespaced: true,

    state: () => ({
        isAuth: false,
        username: null,
        password: null,
        name: null,
    })
}
