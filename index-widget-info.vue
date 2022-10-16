
<template>
    <div class="info">{{ $info.value.value }}</div>
</template>

<style lang="less" scoped>
    .info {
        margin-top: 8px;
        width: 100%;
        font-weight: 200;
        text-align: center;
        color: var(--color-std-fg-1);
    }
</style>

<script>
module.exports = {
    name: "index-widget-info"
}
</script>

