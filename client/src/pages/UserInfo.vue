<template>
  <div class="user-info-container">
    <div class="user-info">
      <div class="user-title">User information:</div>

      <div class="user-text">Name: {{ user.name }}</div>
      <div class="user-text">Username: {{ user.username }}</div>
      <div class="user-text">Password: {{ user.password }}</div>

      <my-button
          color-button="red"
          class="logout-btn"
          data-delete
      >
        Logout
      </my-button>
    </div>
  </div>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters('auth', ['user']),
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
