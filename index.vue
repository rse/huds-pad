<template>
  <main>
    <index-widget-header v-bind:show-disconnect="$status.value.connected"></index-widget-header>
    <pad v-if="$status.value.connected"></pad>
    <login v-else></login>
    <index-widget-info></index-widget-info>
  </main>
</template>

<style lang="less" scoped>
main {
  margin: 0 auto;
  padding: 0 10px;
  max-width: 500px;
  min-height: 100vh;
  background: var(--color-std-bg-5);
}

@media only screen and (orientation: landscape) {
  main {
    border-left: 1px solid var(--color-std-fg-4);
    border-right: 1px solid var(--color-std-fg-4);
  }
}
</style>

<script>
module.exports = {
  name: "index",
  components: {
    "index-widget-header": Vue.loadComponent("index-widget-header.vue"),
    "pad": Vue.loadComponent("pad.vue"),
    "login": Vue.loadComponent("login.vue"),
    "index-widget-info": Vue.loadComponent("index-widget-info.vue")
  }
}
</script>

