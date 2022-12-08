<template>
  <div class="container">
    <Header></Header>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  components: {
    Header,
  },
}
</script>

<style scoped>
  .container {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
</style>
