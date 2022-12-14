import Api from './api'

export default {
    createAccount(user) {
        return Api().post('/auth/register', user);
    },

    signIn(user) {
        return Api().post('/auth/login', user);
    },

    authorization() {
      return Api().get('/auth/authorization');
    },

    logaut() {
        return Api().get('/auth/logout');
    }
}
