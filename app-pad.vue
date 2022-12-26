<!--
**
**  HUDS - Head-Up-Display Server (HUDS)
**  Copyright (c) 2022 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**
-->

<template>
    <section>
        <app-pad-message></app-pad-message>
        <app-pad-vote></app-pad-vote>
        <app-pad-feedback></app-pad-feedback>
        <app-pad-feeling></app-pad-feeling>
    </section>
</template>

<style lang="stylus">
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
import appPadMessage       from "./app-pad-message.vue"
import appPadVote          from "./app-pad-vote.vue"
import appPadFeedback      from "./app-pad-feedback.vue"
import appPadFeeling       from "./app-pad-feeling.vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app-pad",
    components: {
        "app-pad-message":  appPadMessage,
        "app-pad-vote":     appPadVote,
        "app-pad-feedback": appPadFeedback,
        "app-pad-feeling":  appPadFeeling
    }
})
</script>

