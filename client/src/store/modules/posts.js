import postsService from "@/services/PostService";

export const posts = {
    namespaced: true,

    state: () => ({
        posts: [],
        currentPost: false,
        totalItems: 0,
        page: 1,
        validationTitleMessage: null,
    }),

    getters: {
        posts(state) {
            return state.posts;
        },

        page(state) {
            return state.page;
        },

        currentPost(state) {
            return state.currentPost;
        },

        totalItems(state) {
            return state.totalItems;
        },

        validationTitleMessage(state) {
            return state.validationTitleMessage;
        },
    },

    mutations: {
        setPosts(state, posts) {
            state.posts = posts;
        },

        setPage(state, page) {
            state.page = page;
        },

        setCurrentPost(state, post) {
            state.currentPost = post;
        },

        deletePost(state, id) {
            state.posts = state.posts.filter(item => item._id !== id);
        },

        addNewPost(state, post) {
            state.posts = [...state.posts, post];
        },

        updateExistPost(state, post) {
            state.posts = state.posts.map(item => item._id === post._id ? post : item);
        },

        setValidationTitleMessage(state, message) {
            state.validationTitleMessage = message;
        },

        setTotalItems(state, value) {
            state.totalItems = value;
        },
    },

    actions: {
        async fetchPosts({ state, commit }, payload) {
            const { _page, _limit } = payload;

            try {
                const response = await postsService.fetchPosts(_page, _limit);
                const filterPosts = response.data.filter(item => !state.posts.find(post => post._id === item._id));

                commit('setPosts', state.posts.concat(filterPosts));
                commit('setTotalItems', response.headers['x-total-count']);
            }
            catch(e) {
                console.log(e.code);
            }
        },

        async deletePost({ state, commit }, id) {
            try {
                await postsService.deletePost(id);
                commit('deletePost', id);
                commit('setPage', 1);
            }
            catch (e) {
                console.log(e.code);
            }
        },

        async addNewPost({ state, commit }, post) {
            try {
                const response = await postsService.addPost(post);
                commit('addNewPost', response.data);
            }
            catch (e) {
                if (e.response.status === 403) {
                    commit('setValidationTitleMessage', e.response.data)
                }
            }
        },

        async updateExistPost({ state, commit }, post) {
            try {
                const response = await postsService.updatePost(post);
                commit('updateExistPost', response.data);
                commit('setCurrentPost', false);
            }
            catch (e) {
                if (e.response.status === 403) {
                    commit('setValidationTitleMessage', e.response.data)
                }
            }
        }
    }
}
