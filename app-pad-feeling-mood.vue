
<template>
    <section>
        <input v-model.number="mood"
            v-bind:class="['range' + mood ]"
            type="range"
            min="1"
            max="5"
            step="1"
            @change="change"
        />
        <div class="title">Mood</div>
    </section>
</template>

<style lang="less" scoped>
section {
    text-align: center;
    .title {
        font-size: 8pt;
        font-weight: 400;
        text-align: center;
        width: 100%;
        margin-bottom: 4px;
    }
    input {
        width: calc(100% - 10px);
        color: var(--color-acc-fg-3);
        -webkit-appearance: none;
        background-color: var(--color-std-bg-3);
        border-top: 1px solid var(--color-std-bg-1);
        border-left: 1px solid var(--color-std-bg-1);
        border-right: 1px solid var(--color-std-bg-5);
        border-bottom: 1px solid var(--color-std-bg-5);
        outline: none;
        border-radius: 15px;
        margin-top: 8px;
        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 21px;
            width: 21px;
            border-radius: 15px;
            background-color: var(--color-std-fg-2);
            border-top: 1px solid var(--color-std-fg-3);
            border-left: 1px solid var(--color-std-fg-3);
            border-right: 1px solid var(--color-std-fg-1);
            border-bottom: 1px solid var(--color-std-fg-1);
            cursor: pointer;
        }
        &::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            border-radius: 15px;
            background-color: var(--color-std-bg-3);
            border-top: 1px solid var(--color-std-bg-1);
            border-left: 1px solid var(--color-std-bg-1);
            border-right: 1px solid var(--color-std-bg-5);
            border-bottom: 1px solid var(--color-std-bg-5);
        }
        &:hover {
            background-color: var(--color-sig-bg-3);
            &::-webkit-slider-runnable-track {
                background-color: var(--color-sig-bg-3);
                border-top: 1px solid var(--color-sig-bg-1);
                border-left: 1px solid var(--color-sig-bg-1);
                border-right: 1px solid var(--color-sig-bg-5);
                border-bottom: 1px solid var(--color-sig-bg-5);
            }
        }
        &.range1 {
            &::-webkit-slider-thumb {
                background-color: var(--color-sig-bg-4);
                border-top: 1px solid var(--color-sig-bg-5);
                border-left: 1px solid var(--color-sig-bg-5);
                border-right: 1px solid var(--color-sig-bg-3);
                border-bottom: 1px solid var(--color-sig-bg-3);
            }
        }
        &.range2 {
            &::-webkit-slider-thumb {
                background-color: var(--color-sig-bg-5);
                border-top: 1px solid var(--color-sig-bg-5);
                border-left: 1px solid var(--color-sig-bg-5);
                border-right: 1px solid var(--color-sig-bg-4);
                border-bottom: 1px solid var(--color-sig-bg-4);
            }
        }
        &.range3 {
            &::-webkit-slider-thumb {
                background-color: var(--color-std-fg-2);
                border-top: 1px solid var(--color-std-fg-3);
                border-left: 1px solid var(--color-std-fg-3);
                border-right: 1px solid var(--color-std-fg-1);
                border-bottom: 1px solid var(--color-std-fg-1);
            }
        }
        &.range4 {
            &::-webkit-slider-thumb {
                background-color: var(--color-acc-bg-5);
                border-top: 1px solid var(--color-acc-bg-5);
                border-left: 1px solid var(--color-acc-bg-5);
                border-right: 1px solid var(--color-acc-bg-4);
                border-bottom: 1px solid var(--color-acc-bg-4);
            }
        }
        &.range5 {
            &::-webkit-slider-thumb {
                background-color: var(--color-acc-bg-4);
                border-top: 1px solid var(--color-acc-bg-5);
                border-left: 1px solid var(--color-acc-bg-5);
                border-right: 1px solid var(--color-acc-bg-3);
                border-bottom: 1px solid var(--color-acc-bg-3);
            }
        }
    }
}
</style>

<script>
module.exports = {
    name: "app-pad-feeling-mood",
    data: () => ({
        mood: 3
    }),
    methods: {
        change () {
            this.$emit("changed-value", this.mood)
        }
    }
}
</script>

