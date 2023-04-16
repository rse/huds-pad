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
    <div class="app-config">
        <h2 class="title" style="grid-area: title">
            {{ $t("config.config-label") }}
        </h2>
        <button style="grid-area: button1" v-bind:class="{ active: getTheme === 'dark' }"
            v-tippy="{ placement: 'top', content: $t('config.theme-dark-hint'), trigger: $global.value.tippyTrigger }"
            @click="setTheme('dark')">
            <i class="icon fas fa-paint-roller"></i>
            <span class="title" v-html="$t('config.theme-dark-label')"></span>
        </button>
        <button style="grid-area: button2" v-bind:class="{ active: getTheme === 'light' }"
            v-tippy="{ placement: 'top', content: $t('config.theme-light-hint'), trigger: $global.value.tippyTrigger }"
            @click="setTheme('light')">
            <i class="icon fas fa-paint-roller"></i>
            <span class="title" v-html="$t('config.theme-light-label')"></span>
        </button>
        <button style="grid-area: button3" v-bind:class="{ active: getLanguage === 'en' }"
            v-tippy="{ placement: 'top', content: $t('config.lang-en-hint'), trigger: $global.value.tippyTrigger }"
            @click="setLanguage('en')">
            <i class="icon fas fa-globe"></i>
            <span class="title" v-html="$t('config.lang-en-label')"></span>
        </button>
        <button style="grid-area: button4" v-bind:class="{ active: getLanguage === 'de' }"
            v-tippy="{ placement: 'top', content: $t('config.lang-de-hint'), trigger: $global.value.tippyTrigger }"
            @click="setLanguage('de')">
            <i class="icon fas fa-globe"></i>
            <span class="title" v-html="$t('config.lang-de-label')"></span>
        </button>
        <button style="grid-area: button5" v-bind:class="{ active: getHints === true }"
            v-tippy="{ placement: 'top', content: $t('config.hints-yes-hint'), trigger: $global.value.tippyTrigger }"
            @click="setHints(true)">
            <i class="icon fas fa-circle-info"></i>
            <span class="title" v-html="$t('config.hints-yes-label')"></span>
        </button>
        <button style="grid-area: button6" v-bind:class="{ active: getHints === false }"
            v-tippy="{ placement: 'top', content: $t('config.hints-no-hint'), trigger: $global.value.tippyTrigger }"
            @click="setHints(false)">
            <i class="icon fas fa-circle-info"></i>
            <span class="title" v-html="$t('config.hints-no-label')"></span>
        </button>
        <button style="grid-area: button7" v-bind:class="{ active: getDebug === true }"
            v-tippy="{ placement: 'top', content: $t('config.debug-yes-hint'), trigger: $global.value.tippyTrigger }"
            @click="setDebug(true)">
            <i class="icon fas fa-bug"></i>
            <span class="title" v-html="$t('config.debug-yes-label')"></span>
        </button>
        <button style="grid-area: button8" v-bind:class="{ active: getDebug === false }"
            v-tippy="{ placement: 'top', content: $t('config.debug-no-hint'), trigger: $global.value.tippyTrigger }"
            @click="setDebug(false)">
            <i class="icon fas fa-bug"></i>
            <span class="title" v-html="$t('config.debug-no-label')"></span>
        </button>
    </div>
</template>

<i18n lang="yaml">
en:
    config:
        config-label:        SETTINGS
        lang-en-label:       English<br/>Language
        lang-en-hint:        Switch to English language.
        lang-de-label:       German<br/>Language
        lang-de-hint:        Switch to German language.
        theme-dark-label:    Dark<br/>Theme
        theme-dark-hint:     Switch to Dark color theme.
        theme-light-label:   Light<br/>Theme
        theme-light-hint:    Switch to Light color theme.
        hints-yes-label:     Enabled<br/>Hints
        hints-yes-hint:      Switch to enable hints.
        hints-no-label:      Disabled<br/>Hints
        hints-no-hint:       Switch to disabled hints.
        debug-yes-label:     Enabled<br/>Debugging
        debug-yes-hint:      Switch to enable<br>debugging on the console.
        debug-no-label:      Disabled<br/>Debugging.
        debug-no-hint:       Switch to disabled<br>debugging on the console.
de:
    config:
        config-label:        EINSTELLUNGEN
        lang-en-label:       Englische<br/>Sprache
        lang-en-hint:        Wechsle zu englischer Sprache.
        lang-de-label:       Deutsche<br/>Sprache
        lang-de-hint:        Wechsle zu deutcher Sprache.
        theme-dark-label:    Dunkles<br/>Farbschema
        theme-dark-hint:     Wechsle zu dunklem Farbschema.
        theme-light-label:   Helles<br/>Farbschema
        theme-light-hint:    Wechsle zu hellem Farbschema.
        hints-yes-label:     Eingeschaltete<br/>Hinweise
        hints-yes-hint:      Wechsle zu eingeschalteten Hinweisen.
        hints-no-label:      Ausgeschaltete<br/>Hinweise
        hints-no-hint:       Wechsle zu ausgeschalteten Hinweisen.
        debug-yes-label:     Eingeschaltetes<br/>Debugging
        debug-yes-hint:      Wechsle zu eingeschaltetem<br>Debugging auf der Konsole.
        debug-no-label:      Ausgeschaltetes<br/>Debugging
        debug-no-hint:       Wechsle zu ausgeschaltetem<br>Debugging auf der Konsole.
</i18n>

<style lang="stylus">
.app-config
    display: grid
    grid-template: "title title title title" "button1 button2 button3 button4" "button5 button6 button7 button8"
    grid-template-columns: repeat(4, minmax(45px, 1fr))
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
        .title
            font-weight: normal
            font-size: 8pt
            text-align: center
            line-height: 8pt
        .hoverable &:hover:not(:disabled)
            border: 0
            outline: none
            color: var(--color-acc-fg-5)
            background-color: var(--color-acc-bg-3)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
        &.active
            cursor: not-allowed
            color: var(--color-acc-fg-5)
            background-color: var(--color-acc-bg-3)
            border-top: 1px solid var(--color-acc-bg-5)
            border-left: 1px solid var(--color-acc-bg-5)
            border-right: 1px solid var(--color-acc-bg-1)
            border-bottom: 1px solid var(--color-acc-bg-1)
            .icon
                color: var(--color-acc-fg-3)
            .title
                color: var(--color-acc-fg-3)
</style>

<script setup lang="ts">
import { defineComponent } from "vue"
</script>

<script lang="ts">
export default defineComponent({
    name: "app-config",
    data: () => ({
        invalidated: 0
    }),
    computed: {
        getLanguage () {
            void (this.invalidated)
            return this.settings.opts.ui.language
        },
        getTheme () {
            void (this.invalidated)
            return this.settings.opts.ui.theme
        },
        getHints () {
            void (this.invalidated)
            return this.settings.opts.ui.hints
        },
        getDebug () {
            void (this.invalidated)
            return this.settings.opts.ui.debug
        }
    },
    methods: {
        setLanguage (language: string) {
            this.$i18n.locale = language
            this.settings.opts.ui.language = language
            this.settings.exportToLocalStorage()
            this.settings.exportToHash()
            this.invalidated++
        },
        setTheme (theme: string) {
            this.$global.setTheme(theme)
            this.settings.opts.ui.theme = theme
            this.settings.exportToLocalStorage()
            this.settings.exportToHash()
            this.invalidated++
        },
        setHints (enabled: boolean) {
            this.$global.setHints(enabled)
            this.settings.opts.ui.hints = enabled
            this.settings.exportToLocalStorage()
            this.settings.exportToHash()
            this.invalidated++
        },
        setDebug (enabled: boolean) {
            this.$global.setDebug(enabled)
            this.settings.opts.ui.debug = enabled
            this.settings.exportToLocalStorage()
            this.settings.exportToHash()
            this.invalidated++
        }
    }
})
</script>

