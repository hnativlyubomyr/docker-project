import postsService from "@/services/PostService";

export const postsModule = {
    namespaced: true,

    state: () => ({
        posts: [],
        page: 1,
        limit: 10,
        updatePost: false,
        isFirstLoading: false,
        isScrollLoading: false,
        isAllPosts: false,
        sortValue: '',
        searchValue: '',
        sortOptions: [
            { value: 'title', name: 'By title' },
            { value: 'body', name: 'By description' },
        ],
        validationTitleMessage: null,
    }),

    getters: {
        sortPosts(state) {
            return [...state.posts].sort((post1, post2) => {
                return state.sortValue ? post1[state.sortValue].localeCompare(post2[state.sortValue]) : 0;
            })
        },

        filteringPost(state, getters) {
            return [...getters.sortPosts].filter(post => post.title.toLowerCase().includes(state.searchValue.toLowerCase()));
        }
    },

    mutations: {
        setPosts(state, posts) {
            state.posts = posts;
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

        setIsFirstLoading(state, value) {
            state.isFirstLoading = value;
        },

        setIsScrollLoading(state, value) {
            state.isScrollLoading = value;
        },

        setPage(state, value) {
            state.page = value;
        },

        setIsAllPosts(state, value) {
            state.isAllPosts = value;
        },

        setUpdatePost(state, value) {
            state.updatePost = value;
        },

        setSearchValue(state, value) {
            state.searchValue = value;
        },

        setSortValue(state, value) {
            state.sortValue = value;
        },


    },
    actions: {
        async fetchPosts({ state, commit }, payload) {
            const { _page, _limit, isAllPosts } = payload;

            if (isAllPosts) return;

            try {
                if (_page === 1) {
                    commit('setIsFirstLoading', true);
                } else {
                    commit('setIsScrollLoading', true);
                }

                const response = await postsService.fetchPosts(_page, _limit);
                const filterPosts = response.data.filter(item => !state.posts.find(post => post._id === item._id));

                commit('setPosts', state.posts.concat(filterPosts));

                const totalItems = response.headers['x-total-count'];

                if (state.posts.length < totalItems) {
                    commit('setPage', ++state.page);
                } else {
                    commit('setIsAllPosts', true);
                }
            }
            catch(e) {
                console.log(e.code);
            }
            finally {
                commit('setIsFirstLoading', false);
                commit('setIsScrollLoading', false);
            }
        },

        async deletePost({ state, commit }, id) {
            try {
                await postsService.deletePost(id);
                commit('deletePost', id);
                commit('setPage', 1);
            }
            catch (e) {
                console.log(e);
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
                commit('setUpdatePost', false);
            }
            catch (e) {
                if (e.response.status === 403) {
                    commit('setValidationTitleMessage', e.response.data)
                }
            }
        }
    }
}
