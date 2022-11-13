<template>
  <div class="main">
    <div class="navigation-panel">
      <my-input v-model="searchValue" placeholder="Filtering..."></my-input>

      <my-select
          v-model="sortValue"
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
            @send-post="handleSendPost"
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
        @click="fetchPosts(page, limit, isAllPosts);"
    >
      Load more...
    </my-button>

    <div v-if="isFirstLoading">isLoading...</div>
  </div>
</template>

<script>
  import PostsList from "./components/PostsList";
  import PostForm from "./components/PostForm";
  import postsService from './services/PostService';

  export default {
    components: {
      PostsList,
      PostForm,
    },

    computed: {
      sortPosts() {
        return [...this.posts].sort((post1, post2) => {
          return this.sortValue ? post1[this.sortValue].localeCompare(post2[this.sortValue]) : 0;
        })
      },

      filteringPost() {
        return [...this.sortPosts].filter(post => post.title.toLowerCase().includes(this.searchValue.toLowerCase()));
      }
    },

    data() {
      return {
        posts: [],

        page: 1,

        limit: 10,

        updatePost: false,

        isOpenDialog: false,

        isFirstLoading: false,

        isScrollLoading: false,

        isAllPosts: false,

        sortValue: '',

        searchValue: '',

        sortOptions: [
          { value: 'title', name: 'By title' },
          { value: 'body', name: 'By description' },
        ],


      }
    },

    methods: {
      handleSendPost(event) {
        if (this.updatePost) {
          const index = this.posts.findIndex(item => item._id === event._id);

          this.posts.splice(index, 1, event);
          this.updatePost = false;
        } else {
          this.posts.push(event);
        }

        this.isOpenDialog = false;
      },

      scroll() {
        window.onscroll = () => {
          const isLoading = this.isScrollLoading || this.isFirstLoading;

          if(window.scrollY + window.innerHeight > document.body.clientHeight && !isLoading){
            this.fetchPosts(this.page, this.limit, this.isAllPosts);
          }
        }
      },

      async handleActionItem(event) {
        if (event.isDelete) {
          this.posts = this.posts.filter(item => item._id !== event._id);
          this.page = 1;
        } else {
          this.isOpenDialog = true;
          this.updatePost = null;
          await this.$nextTick();
          this.updatePost = this.posts.find(item => item._id === event._id);
        }
      },

      async fetchPosts(_page, _limit, isAllPosts) {
        if (isAllPosts) return;

        try {
          if (_page === 1) {
            this.isFirstLoading = true;
          } else {
            this.isScrollLoading = true;
          }

          const response = await postsService.fetchPosts(_page, _limit);
          const filterPosts = response.data.filter(item => !this.posts.find(post => post._id === item._id));

          this.posts = this.posts.concat(filterPosts);

          const totalItems = response.headers['x-total-count'];

          if (this.posts.length < totalItems) {
            this.page++;
          } else {
            this.isAllPosts = true;
          }
        }
        catch(e) {
          console.log(e.code);
        }
        finally {
          this.isFirstLoading = false;
          this.isScrollLoading = false;
        }
      },
    },

    mounted() {
      this.fetchPosts(this.page, this.limit, this.isAllPosts);
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
