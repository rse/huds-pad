
<template>
    <div class="app-info">
        <div v-show="$info.msg.value" class="msg">{{ $info.msg.value }}</div>
        <div v-show="$info.err.value" class="err">{{ $info.err.value }}</div>
    </div>
</template>

<style lang="less">
.app-info {
    margin-top: 0px;
    margin-bottom: 0px;
    width: 100%;
    font-weight: 300;
    text-align: center;
    .msg {
        color: var(--color-std-fg-2);
    }
    .err {
        color: var(--color-sig-fg-2);
    }
}
</style>

<script>
module.exports = {
    name: "app-info"
}
</script>

