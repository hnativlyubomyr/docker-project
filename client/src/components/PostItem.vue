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
import { mapActions } from "vuex";

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  emits: ['actionItem'],

  methods: {
    ...mapActions('posts', ['deletePost']),

    actionItem(event) {
      const isDelete = event.target.hasAttribute('data-delete');
      const { _id } = this.post;

      if (isDelete) {
        this.deletePost(_id);

        return;
      }

      this.$emit('actionItem', { _id });
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
