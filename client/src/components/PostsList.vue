<template>
  <div v-if="posts.length" class="posts-container">
    <div class="posts-title">Posts: {{ posts.length }}</div>

    <transition-group name="posts">
      <post-item
          v-for="item in posts"
          :key="item._id"
          :post="item"
          class="posts-list-item"
          @action-item="this.$emit('actionItem', $event)"
      >
      </post-item>
    </transition-group>
  </div>

  <div v-if="!posts.length" class="post-container-empty">
    There are no posts!
  </div>
</template>

<script>
  import PostItem from "./PostItem";

  export default {
    components: {
      PostItem,
    },

    props: {
      posts: {
        type: Array,
        required: true,
      },
    },

    emits: ['actionItem'],
  }
</script>

<style scoped>
.posts-container {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid teal;
  border-radius: 10px;
  background-color: lightgray;
}

.post-container-empty {
  margin-top: 30px;
  font-size: 20px;
  font-weight: bold;
  color: red;
}

.posts-title {
  font-weight: bold;
}

.posts-item {
  display: inline-block;
  margin-right: 10px;
}
.posts-enter-active,
.posts-leave-active {
  transition: all 0.4s ease;
}
.posts-enter-from,
.posts-leave-to {
  opacity: 0;
  transform: translateX(500px);
}

.posts-move {
  transition: transform 0.4s ease;
}
</style>

