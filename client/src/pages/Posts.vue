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
            :update-post="currentPost"
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
          @action-item="handleActionItem"
      >
      </posts-list>

      <div v-if="isScrollLoading">isLoading...</div>
    </div>

    <my-button
        v-if="!isAllPosts"
        class="load-more-button"
        @click="getPosts(fetchPostsPayload);"
    >
      Load more...
    </my-button>

    <div v-if="isFirstLoading">isLoading...</div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import PostsList from "@/components/PostsList";
import PostForm from "@/components/PostForm";

export default {
  components: {
    PostsList,
    PostForm,
  },

  computed: {
    ...mapGetters('posts', ['posts', 'page', 'totalItems', 'currentPost']),

    sortPosts() {
      return [...this.posts].sort((post1, post2) => {
        return this.sortValue ? post1[this.sortValue].localeCompare(post2[this.sortValue]) : 0;
      })
    },

    filteringPost() {
      return [...this.sortPosts].filter(post => post.title.toLowerCase().includes(this.searchValue.toLowerCase()));
    },

    fetchPostsPayload() {
      const _page = this.page;
      const _limit = this.limit;
      const isAllPosts = this.isAllPosts;

      return { _page, _limit, isAllPosts };
    }
  },

  data() {
    return {
      isOpenDialog: false,
      sortValue: '',
      searchValue: '',
      sortOptions: [
        { value: 'title', name: 'By title' },
        { value: 'body', name: 'By description' },
      ],
      limit: 10,
      isFirstLoading: false,
      isScrollLoading: false,
      isAllPosts: false,
    }
  },

  methods: {
    ...mapActions('posts', ['fetchPosts']),

    ...mapMutations('posts', ['setPage', 'setCurrentPost']),

    getPosts(pageObj) {
      const { _page, _limit, isAllPosts } = pageObj;

      if (isAllPosts) return;

      if (_page === 1) {
        this.isFirstLoading = true
      } else {
        this.isScrollLoading = true;
      }

      this.fetchPosts({ _page, _limit})
      .then(() => {
        if (this.posts.length < this.totalItems) {
          this.setPage(this.page + 1)
        } else {
          this.isAllPosts = true;
        }
      })
      .finally(() => {
        this.isFirstLoading = false;
        this.isScrollLoading = false;
      })
    },

    scroll() {
      window.onscroll = () => {
        const isLoading = this.isScrollLoading || this.isFirstLoading;

        if (window.scrollY + window.innerHeight > document.body.clientHeight && !isLoading) {
          this.getPosts(this.fetchPostsPayload);
        }
      }
    },

    async handleActionItem(event) {
      this.isOpenDialog = true;
      this.setCurrentPost(null);

      await this.$nextTick();

      this.setCurrentPost(this.posts.find(item => item._id === event._id));
    },
  },

  mounted() {
    this.getPosts(this.fetchPostsPayload);
    this.scroll();
  },
}
</script>

<style scoped>
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
