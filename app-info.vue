
<template>
    <div class="app-info">{{ $info.value.value }}</div>
</template>

<style lang="less">
.app-info {
    margin-top: 0px;
    margin-bottom: 0px;
    width: 100%;
    font-weight: 200;
    text-align: center;
    color: var(--color-std-fg-2);
}
</style>

<script>
module.exports = {
    name: "app-info"
}
</script>

