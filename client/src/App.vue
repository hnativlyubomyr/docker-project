<template>
  <div class="main">
    <div class="navigation-panel">
      <my-input v-model="searchValueModel" placeholder="Filtering..."></my-input>

      <my-select
          v-model="sortValueModel"
          class="select-sorting"
          default-text="Sorting posts"
          :options="sortOptions"
      >
      </my-select>

      <my-button
          color-button="green"
          @click="isOpenDialog = true"
      >
        Create Post
      </my-button>
    </div>

    <my-dialog v-model:isShow="isOpenDialog">
      <template v-slot:header>Create post</template>

      <template v-slot:default>
        <post-form
            :update-post="updatePost"
            @send-post="isOpenDialog = false"
        >
        </post-form>
      </template>

      <template v-slot:footer>
        <my-button
            color-button="red"
            @click="isOpenDialog = false"
        >
          Close
        </my-button>
      </template>
    </my-dialog>

    <div ref="postsList">
      <posts-list
          v-if="!isFirstLoading"
          :posts="filteringPost"
          ref="postsList"
          @action-item="handleActionItem"
      >
      </posts-list>

      <div v-if="isScrollLoading">isLoading...</div>
    </div>

    <my-button
        v-if="!isAllPosts"
        class="load-more-button"
        @click="fetchPosts(fetchPostsPayload);"
    >
      Load more...
    </my-button>

    <div v-if="isFirstLoading">isLoading...</div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import PostsList from "./components/PostsList";
  import PostForm from "./components/PostForm";

  export default {
    components: {
      PostsList,
      PostForm,
    },

    computed: {
      ...mapState({
        posts: state => state.posts.posts,
        page: state => state.posts.page,
        limit: state => state.posts.limit,
        updatePost: state => state.posts.updatePost,
        isFirstLoading: state => state.posts.isFirstLoading,
        isScrollLoading: state => state.posts.isScrollLoading,
        isAllPosts: state => state.posts.isAllPosts,
        sortValue: state => state.posts.sortValue,
        searchValue: state => state.posts.searchValue,
        sortOptions: state => state.posts.sortOptions,
      }),

      ...mapGetters({
        filteringPost: 'posts/filteringPost',
      }),

      fetchPostsPayload() {
        const _page = this.page;
        const _limit = this.limit;
        const isAllPosts = this.isAllPosts;

        return { _page, _limit, isAllPosts };
      }
    },

    watch: {
      searchValueModel(value) {
        this.setSearchValue(value);
      },

      sortValueModel(value) {
        this.setSortValue(value);
      }
    },

    data() {
      return {
        isOpenDialog: false,
        searchValueModel: this.searchValue,
        sortValueModel: this.sortValue,
      }
    },

    methods: {
      ...mapMutations({
        setSearchValue: 'posts/setSearchValue',
        setSortValue: 'posts/setSortValue',
        setPage: 'posts/setPage',
        setUpdatePost: 'posts/setUpdatePost'
      }),

      ...mapActions({
        fetchPosts: 'posts/fetchPosts'
      }),

      scroll() {
        window.onscroll = () => {
          const isLoading = this.isScrollLoading || this.isFirstLoading;

          if (window.scrollY + window.innerHeight > document.body.clientHeight && !isLoading) {
            this.fetchPosts(this.fetchPostsPayload);
          }
        }
      },

      async handleActionItem(event) {
        this.isOpenDialog = true;
        this.setUpdatePost(null);
        await this.$nextTick();

        const post = this.posts.find(item => item._id === event._id);

        this.setUpdatePost(post);
      },
    },

    mounted() {
      this.fetchPosts(this.fetchPostsPayload);
      this.scroll();
    },
  }
</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .main {
    padding: 10px 500px;
    font-size: 20px;
  }

  .navigation-panel {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 15px;
    background-color: lightgray;
    border-radius: 10px;
    border: 1px solid teal;
  }

  .select-sorting {
    margin: 0 15px;
  }

  .load-more-button {
    margin-top: 10px;
  }
</style>
