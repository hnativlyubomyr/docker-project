<template>
  <div class="user-info-container">
    <div class="user-info">
      <div class="user-title">User information:</div>

      <div class="user-text">Name: {{ name }}</div>
      <div class="user-text">Username: {{ username }}</div>
      <div class="user-text">Password: {{ password }}</div>

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
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      name: state => state.auth.name,
      username: state => state.auth.username,
      password: state => state.auth.password,
    }),
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
