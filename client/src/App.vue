<template>
  <div class="container">
    <div class="container-header">
      <div class="users-posts">UsersPosts</div>

      <router-link v-if="isSignIn" to="/login" class="user-link">Sign in</router-link>

      <span v-if="isWelcomeUser" class="user-link">
        Welcome, <router-link to="/user" class="user-link">{{ name }}</router-link>
      </span>

      <router-link v-if="isBackToPosts" to="/" class="user-link">Back to posts</router-link>
    </div>

    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      isAuth: state => state.auth.isAuth,
      name: state => state.auth.name,
    }),

    currentRoute() {
      return this.$route.name;
    },

    isSignIn() {
      return !this.isAuth && this.currentRoute === 'Posts';
    },

    isWelcomeUser() {
      return this.isAuth && this.currentRoute === 'Posts';
    },

    isBackToPosts() {
      return this.currentRoute !== 'Posts';
    }
  }
}
</script>

<style scoped>
  .container {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .container-header {
    padding: 10px;
    background-color: teal;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .users-posts {
    margin-left: 20px;
    font-size: 18px;
    color: white;
    font-family: Tahoma;
    letter-spacing: 0.09em;
  }

  .user-link {
    margin-right: 20px;
    font-size: 16px;
    color: white;
    font-family: Arial;
    letter-spacing: 0.07em;
  }
</style>
