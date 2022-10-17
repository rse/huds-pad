
<template>
    <div class="app-pad-head">
        <div class="back">
            <button v-show="$status.value.connected" @click="disconnect()">
                <i class="icon fas fa-arrow-alt-circle-left"></i><br>
            </button>
        </div>
        <div class="title">
            <h1 ref="h1">
                <span class="title1">HUDS</span>
                <span class="title2">Pad</span>
            </h1>
        </div>
        <div class="qrcode">
            <button @click="$status.toggleQRCode()">
                <i class="icon fas fa-qrcode"></i><br>
            </button>
        </div>
    </div>
</template>

<style lang="less">
.app-pad-head {
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    button {
        line-height: 12pt;
        background: none;
        cursor: pointer;
        border: 0;
        .icon {
            display: inline-block;
            color: var(--color-std-fg-1);
            font-size: 18pt;
            width: 25px;
            text-align: center;
        }
        .hoverable &:hover {
            border: 0;
            outline: none;
            color: var(--color-acc-fg-5);
            .icon {
                color: var(--color-acc-fg-1);
            }
        }
    }
    .back {
        width: 40px;
    }
    .title {
        flex-grow: 1;
        perspective: 300px;
        h1 {
            transform-origin: 50% 50%;
            transform-style:  preserve-3d;
            line-height: 0;
            margin-top: 12px;
            margin-bottom: 12px;
            text-align: center;
            .title1 {
                font-weight: 900;
                letter-spacing: -1px;
                padding-left: 4px;
                padding-right: 2px;
            }
        }
    }
}
</style>

<script>
module.exports = {
    name: "app-head",
    mounted () {
        setTimeout( () => { this.animate() },      4 * 1000)
        setInterval(() => { this.animate() }, 5 * 60 * 1000)
    },
    methods: {
        disconnect () {
            this.huds.endAttendance()
            this.huds.client.once("close", () => {
                this.$info.clearMessage()
                this.$info.clearError()
            })
            this.huds.disconnect()
        },
        animate: (function () {
            /*  animate the logo  */
            let i = 0
            return function () {
                const tl = anime.timeline({
                    targets:  this.$refs.h1,
                    duration: 2000,
                    easing:   "easeInOutQuad"
                })
                if (i++ % 2 === 0)
                    /*  rotate around the X-axis  */
                    tl.add({ rotateX: [ 0, 360 ] })
                else
                    /*  rotate around the Y-axis  */
                    tl.add({ rotateY: [ 0, 360 ] })
            }
        })()
    }
}
</script>

