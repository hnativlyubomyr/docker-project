<template>
  <div class="container-header">
    <div class="users-posts">UsersPosts</div>

    <router-link v-if="isSignIn" :to="navigation.login.path" class="user-link">Sign in</router-link>

    <span v-if="isWelcomeUser" class="user-link">
        Welcome, <router-link :to="navigation.user.path" class="user-link">{{ user.name }}</router-link>
      </span>

    <router-link v-if="isBackToPosts" :to="navigation.posts.path" class="user-link">Back to posts</router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { navigation } from "@/router/dictionary";

export default {
  computed: {
    ...mapGetters('auth', ['isAuth', 'user']),

    currentRoute() {
      return this.$route.name;
    },

    navigation() {
      return navigation;
    },

    isSignIn() {
      return !this.isAuth && this.currentRoute === this.navigation.posts.name;
    },

    isWelcomeUser() {
      return this.isAuth && this.currentRoute === this.navigation.posts.name;
    },

    isBackToPosts() {
      return this.currentRoute !== this.navigation.posts.name;
    }
  }
}
</script>

<style scoped>
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
