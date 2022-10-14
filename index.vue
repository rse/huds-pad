<template>
  <main>
    <index-widget-title v-bind:show-disconnect="$status.value.connected"></index-widget-title>
    <pad v-if="$status.value.connected"></pad>
    <settings v-else></settings>
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
    "index-widget-title": Vue.loadComponent("index-widget-title.vue"),
    "pad": Vue.loadComponent("pad.vue"),
    "settings": Vue.loadComponent("settings.vue"),
    "index-widget-info": Vue.loadComponent("index-widget-info.vue")
  }
}
</script>

