<template>
  <div>
    <div class="post">
      <div class="post-content">
        <div><b>Title:</b> {{ post.title }}</div>
        <div class="post-caption"><b>Description:</b> {{ post.body }}</div>
      </div>
      <div class="post-buttons" @click="actionItem">
        <my-button color-button="blue">Update</my-button>
        <my-button
            color-button="red"
            class="post-action-btn"
            data-delete
        >
          Delete
        </my-button>
      </div>
    </div>
  </div>
</template>

<script>
import postsService from "@/services/PostService";

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  emits: ['actionItem'],

  methods: {
    async actionItem(event) {
      const isDelete = event.target.hasAttribute('data-delete');
      const { _id } = this.post;
      const data = { _id, isDelete };

      if (isDelete) {
        try {
          await postsService.deletePost(_id);
          this.$emit('actionItem', data);

          return;
        }
        catch (e) {
          console.log(e);
        }
      }

      this.$emit('actionItem', data);
    }
  }
}
</script>

<style scoped>
  .post {
    padding: 20px;
    margin-top: 15px;
    border: 1px solid teal;
    color: teal;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

  .post-caption {
    margin-top: 10px;
    color: black;
  }

  .post-content {
    width: 60%;
  }

  .post-action-btn {
    margin-left: 10px;
  }
</style>
