<template>
  <form>
    <h4>Create post:</h4>

    <my-input
        v-model="title"
        class="input"
        placeholder="Post title"
        @input="setValidationTitleMessage(null)"
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
  import { mapActions, mapGetters, mapMutations } from "vuex";

  export default {
    props: {
      updatePost: {
        type: [Boolean, Object, null],
        required: true,
      }
    },

    computed: {
      ...mapGetters('posts', ['validationTitleMessage']),
      ...mapGetters('auth', ['user']),
    },

    data() {
      return {
        title: '',
        body: '',
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
      ...mapMutations('posts', ['setValidationTitleMessage']),
      ...mapActions('posts', ['addNewPost', 'updateExistPost']),

      async sendPost() {
        const { title, body } = this;

        if (!this.title || !this.body || this.validationTitleMessage ) return;

        const post = { title, body };

        if (this.updatePost) {
          await this.updateExistPost({ ...post, _id: this.updatePost._id })
        } else {
          await this.addNewPost({ ...post, user: this.user._id });
        }

        if (!this.validationTitleMessage) {
          this.$emit('sendPost');
          this.clearForm();
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
