<template>
  <div id="bookflip">
    <flipbook />
  </div>
</template>

<script>
import Flipbook from "@/components/Flipbook/index.vue";

export default {
  name: "App",
  components: {
    Flipbook,
  },
};
</script>

<style>
#bookflip {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
