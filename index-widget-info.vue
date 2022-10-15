
<template>
    <p class="info">{{ $info.value.value }}</p>
</template>

<style lang="less" scoped>
    .info {
        margin-top: 20px;
        width: 100%;
        text-align: center;
        color: var(--color-std-fg-0);
    }
</style>

<script>
module.exports = {
    name: "index-widget-info"
}
</script>

