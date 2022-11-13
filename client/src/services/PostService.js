import Api from './api'

export default {
    fetchPosts(_page, _limit) {
        return Api().get('/posts', { params: { _page, _limit }});
    },

    addPost(post) {
        return Api().post('/posts/add', post);
    },

    updatePost(post) {
        const { _id, title, body } = post;

        return Api().put(`/posts/update/${_id}`, { title, body });
    },

    deletePost(id) {
        return Api().delete(`/posts/delete/${id}`)
    }
}
