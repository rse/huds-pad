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
    <section class="app-pad-feedback">
        <h2 style="grid-area: title">
            FEEDBACK
            <span v-show="isFeedbackDisabled" class="disabled">
                (temporarily disabled for throttling reasons)
            </span>
        </h2>
        <button style="grid-area: button1"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: 'Indicate your consent with<br/>the current session content.', trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('thumbsup')">
            <i class="icon positive fas fa-thumbs-up"></i>
            <span class="title positive">Consent</span>
        </button>
        <button style="grid-area: button2"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: 'Indicate your refusal with<br/>the current session content.', trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('thumbsdn')">
            <i class="icon fas fa-thumbs-down"></i>
            <span class="title">Refusal</span>
        </button>
        <button style="grid-area: button3"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: 'Indicate your surprise with<br/>the current session content.', trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('surprise')">
            <i class="icon positive fas fa-surprise"></i>
            <span class="title positive">Surprise</span>
        </button>
        <button style="grid-area: button4"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: 'Indicate your smile with<br/>the current session content.', trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('smile')">
            <i class="icon positive fas fa-grin-wink"></i>
            <span class="title positive">Smile</span>
        </button>
        <button style="grid-area: button5"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: 'Indicate your frown with<br/>the current session content.', trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('frown')">
            <i class="icon fas fa-angry"></i>
            <span class="title">Frown</span>
        </button>
        <button style="grid-area: button6"
            v-bind:disabled="isFeedbackDisabled"
            v-tippy="{ placement: 'top', content: 'Indicate your sadness with<br/>the current session content.', trigger: $global.value.tippyTrigger }"
            @click="sendFeedback('sadness')">
            <i class="icon fas fa-sad-tear"></i>
            <span class="title">Sadness</span>
        </button>
    </section>
</template>

<style lang="stylus">
.app-pad-feedback
    display: grid
    grid-template: "title title title title title title" "button1 button2 button3 button4 button5 button6"
    grid-template-columns: repeat(6, minmax(45px, 1fr))
    grid-gap: 2px
    .disabled
        font-size: 9pt
        font-weight: 300
        color: var(--color-acc-fg-3)
        margin-left: 4px
    button
        cursor: pointer
        color: var(--color-std-fg-3)
        background-color: var(--color-std-bg-4)
        border-top: 1px solid var(--color-std-bg-5)
        border-left: 1px solid var(--color-std-bg-5)
        border-right: 1px solid var(--color-std-bg-1)
        border-bottom: 1px solid var(--color-std-bg-1)
        border-radius: 4px
        font-size: 22pt
        text-align: center
        line-height: 0
        padding: 8px 0
        .icon
            width: 100%
            padding-bottom: 6px
            &.positive
                color: var(--color-acc-fg-3)
        .title
            font-weight: normal
            font-size: 8pt
            text-align: center
            line-height: 8pt
            &.positive
                color: var(--color-acc-fg-3)
        .hoverable &:hover:not(:disabled)
            border: 0
            outline: none
            color: var(--color-acc-fg-5)
            background-color: var(--color-acc-bg-3)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
        &:disabled
            cursor: not-allowed
            color: var(--color-std-fg-0)
            background-color: var(--color-std-bg-3)
            border-top: 1px solid var(--color-std-bg-5)
            border-left: 1px solid var(--color-std-bg-5)
            border-right: 1px solid var(--color-std-bg-1)
            border-bottom: 1px solid var(--color-std-bg-1)
            .icon
                color: var(--color-std-fg-0)
                &.positive
                    color: var(--color-acc-fg-0)
            .title
                color: var(--color-std-fg-0)
                &.positive
                    color: var(--color-acc-fg-0)
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app-pad-feedback",
    data: () => ({
        isFeedbackDisabled: false
    }),
    methods: {
        sendFeedback (value: string) {
            if (this.isFeedbackDisabled)
                return
            this.isFeedbackDisabled = true
            this.huds.sendFeedback(value)
            setTimeout(() => {
                this.isFeedbackDisabled = false
            }, 30 * 1000)
        }
    }
})
</script>

