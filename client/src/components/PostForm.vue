<template>
  <form>
    <h4>Create post:</h4>

    <my-input
        v-model="title"
        class="input"
        placeholder="Post title"
        @input="validationTitleMessage = ''"
    ></my-input>

    <span v-if="validationTitleMessage" class="validation-message">{{ validationTitleMessage }}</span>

    <my-input
        v-model="body"
        class="input"
        placeholder="Description"
    ></my-input>

    <my-button
        v-if="!updatePost"
        color-button="green"
        @click.prevent="sendPost"
    >
      Create
    </my-button>

    <my-button
        v-else
        color-button="blue"
        @click.prevent="sendPost"
    >
      Update
    </my-button>
  </form>
</template>

<script>
  import postsService from "@/services/PostService";

  export default {
    props: {
      updatePost: {
        type: [Boolean, Object, null],
        required: true,
      }
    },

    data() {
      return {
        title: '',
        body: '',
        validationTitleMessage: '',
      }
    },

    emits: ['sendPost'],

    watch: {
      updatePost(newValue) {
        if (newValue) {
          this.title = newValue.title;
          this.body = newValue.body;
        }
      }
    },

    methods: {
      async sendPost() {
        const { title, body } = this;

        if (!this.title || !this.body || this.validationTitleMessage ) return;

        const post = { title, body };

        try {
          const response = this.updatePost
              ? await postsService.updatePost({ ...post, _id: this.updatePost._id })
              : await postsService.addPost(post);

          this.$emit('sendPost', response.data);
          this.clearForm();
        }
        catch (e) {
          console.log(e);
          if (e.response.status === 403) {
            this.validationTitleMessage = e.response.data;
          }
        }
      },

      clearForm() {
        this.title = '';
        this.body = '';
      },
    }
  }
</script>

<style scoped>
  form {
    display: flex;
    flex-direction: column;
    border: 1px solid teal;
    border-radius: 10px;
    padding: 20px;
    background-color: lightgray;
  }

  form .input {
    margin-bottom: 15px;
  }

  .validation-message {
    color: red;
    margin-bottom: 15px;
  }
</style>
