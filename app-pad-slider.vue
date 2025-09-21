<!--
**
**  HUDS - Head-Up-Display Server (HUDS)
**  Copyright (c) 2022-2024 Dr. Ralf S. Engelschall <rse@engelschall.com>
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
    <section class="app-pad-slider">
        <input v-model.number="value"
            type="range"
            min="1"
            max="5"
            step="1"
            @change="change"
        />
        <div class="caption">
            <div class="left">{{ left }}</div>
            <div class="title">{{ title }}</div>
            <div class="right">{{ right }}</div>
        </div>
    </section>
</template>

<style lang="stylus">
.app-pad-slider
    text-align: center
    .caption
        padding: 0 20px
        margin-top: -4px
        margin-bottom: 4px
        display: flex
        flex-direction: row
        .left,
        .right
            font-size: 8pt
            font-weight: 300
        .title
            flex-grow: 1
            font-size: 8pt
            font-weight: normal
            text-align: center
            width: 100%
    input
        width: calc(100% - 20px)
        color: var(--color-acc-fg-3)
        -webkit-appearance: none
        background-color: var(--color-std-bg-3)
        border-top: 1px solid var(--color-std-bg-1)
        border-left: 1px solid var(--color-std-bg-1)
        border-right: 1px solid var(--color-std-bg-5)
        border-bottom: 1px solid var(--color-std-bg-5)
        outline: none
        border-radius: 15px
        margin-top: 8px
        &::-webkit-slider-thumb
            -webkit-appearance: none
            height: 21px
            width: 21px
            border-radius: 15px
            background-color: var(--color-std-fg-2)
            border-top: 1px solid var(--color-std-fg-3)
            border-left: 1px solid var(--color-std-fg-3)
            border-right: 1px solid var(--color-std-fg-1)
            border-bottom: 1px solid var(--color-std-fg-1)
            cursor: pointer
        &::-webkit-slider-runnable-track
            -webkit-appearance: none
            border-radius: 15px
            background-color: var(--color-std-bg-3)
            border-top: 1px solid var(--color-std-bg-1)
            border-left: 1px solid var(--color-std-bg-1)
            border-right: 1px solid var(--color-std-bg-5)
            border-bottom: 1px solid var(--color-std-bg-5)
        .hoverable &:hover
            background-color: var(--color-acc-bg-3)
            &::-webkit-slider-thumb
                background-color: var(--color-acc-fg-2)
                border-top: 1px solid var(--color-acc-fg-3)
                border-left: 1px solid var(--color-acc-fg-3)
                border-right: 1px solid var(--color-acc-fg-1)
                border-bottom: 1px solid var(--color-acc-fg-1)
            &::-webkit-slider-runnable-track
                background-color: var(--color-acc-bg-3)
                border-top: 1px solid var(--color-acc-bg-1)
                border-left: 1px solid var(--color-acc-bg-1)
                border-right: 1px solid var(--color-acc-bg-5)
                border-bottom: 1px solid var(--color-acc-bg-5)
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app-pad-slider",
    props: {
        title: { type: String, default: "" },
        left:  { type: String, default: "" },
        right: { type: String, default: "" }
    },
    emits: [ "changed-value" ],
    data: () => ({
        value: 3
    }),
    mounted () {
        (window as any).allowTouchMove(this.$el)
    },
    methods: {
        change () {
            this.$emit("changed-value", this.value)
        }
    }
})
</script>

