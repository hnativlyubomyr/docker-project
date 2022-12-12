<template>
  <div class="container">
    <Header></Header>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import Header from "@/components/Header";
import { mapActions } from "vuex";

export default {
  components: {
    Header,
  },

  methods: {
    ...mapActions('auth', ['authorization']),
  },

  mounted() {
    this.authorization();
  }
}
</script>

<style scoped>
  .container {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
</style>
