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
    <div class="app-info"
        v-tippy="{ placement: 'bottom', content: 'Global status and/or error<br/>information of the application.', trigger: $global.value.tippyTrigger }">
        <div v-show="$global.value.msg" class="msg">{{ $global.value.msg }}</div>
        <div v-show="$global.value.err" class="err">{{ $global.value.err }}</div>
    </div>
</template>

<style lang="stylus">
.app-info
    margin-top: 0
    margin-bottom: 0
    width: 100%
    font-weight: 300
    text-align: center
    .msg
        color: var(--color-std-fg-2)
    .err
        color: var(--color-sig-fg-2)
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app-info"
})
</script>

