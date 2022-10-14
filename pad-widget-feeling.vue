<template>
  <section>
    <pad-widget-challenge v-on:change="(x) => sendFeeling(mood, x)"></pad-widget-challenge>
    <pad-widget-mood v-on:change="(x) => sendFeeling(x, challenge)"></pad-widget-mood>
  </section>
</template>

<style lang="less" scoped>
</style>

<script>
module.exports = {
  name: "pad-widget-feeling",
  components: {
    "pad-widget-challenge": Vue.loadComponent("pad-widget-challenge.vue"),
    "pad-widget-mood": Vue.loadComponent("pad-widget-mood.vue")
  },
  data: () => ({
    mood: 3,
    challenge: 3
  }),
  methods: {
    sendFeeling (mood, challenge) {
      this.mood = mood
      this.challenge = challenge
      this.huds.sendFeeling(mood, challenge)
    }
  }
}
</script>
