<template>
  <div class="user-info-container">
    <div v-if="user" class="user-info">
      <div class="user-title">User information:</div>

      <div class="user-text">Name: {{ user.name }}</div>
      <div class="user-text">Username: {{ user.username }}</div>
      <div class="user-text">Password: {{ user.password }}</div>

      <my-button
          color-button="red"
          class="logout-btn"
          data-delete
          @click="handleLogout"
      >
        Logout
      </my-button>
    </div>
  </div>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import { navigation } from "@/router/dictionary";

export default {
  computed: {
    ...mapGetters('auth', ['user', 'isAuth']),
  },

  methods: {
    ...mapActions('auth', ['logOut']),

    async handleLogout() {
      await this.logOut();

      if (!this.isAuth) {
        this.$router.push(navigation.posts.path);
      }
    }
  }
}
</script>

<style scoped>
.user-info-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.user-info {
  background-color: lightgray;
  width: 300px;
  padding: 20px 5px 10px 20px;
}

.user-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.user-text {
  font-size: 20px;
  margin-bottom: 5px;
}

.logout-btn {
  margin-top: 10px;
}
</style>
