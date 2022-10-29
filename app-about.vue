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
    <div class="app-about">
        <h2 class="title" style="grid-area: title">
            ABOUT
        </h2>
        <div class="about">
            This is <a target="_blank" href="https://github.com/rse/huds-pad"><b>HUDS Pad</b></a>,
            version <b>{{ $root.pkg.version }}</b>,
            the attendee client-side web application (for desktop and mobile devices) for interacting
            with a live video-streaming session leveraging
            <a target="_blank" href="https://engelschall.com">Dr. Ralf S. Engelschall</a>'s
            <a target="_blank" href="https://github.com/rse/huds">Head-Up-Display Server (HUDS)</a> and its
            <a target="_blank" href="https://github.com/rse/huds-hud-training">Training HUD</a>.
            <p>
            It allows attendees to anonymously send textual messages, give their vote on proposals,
            judgements and quizzes, send feedback with emojis, and share their feeling through
            challenge and mood indicators.
            </p>
        </div>
    </div>
</template>

<style lang="less">
.app-about {
    display: grid;
    grid-template:
        "title"
        "about";
    grid-gap: 2px;
    .about {
        background-color: var(--color-std-bg-2);
        border-top: 1px solid var(--color-std-bg-1);
        border-left: 1px solid var(--color-std-bg-1);
        border-right: 1px solid var(--color-std-bg-5);
        border-bottom: 1px solid var(--color-std-bg-5);
        border-radius: 4px;
        width: calc(100% - 40px);
        padding: 20px;
        font-size: 12pt;
        line-height: 125%;
        p {
            margin: 0;
            margin-top: 6px;
            padding: 0;
            text-indent: 30px;
        }
    }
}
</style>

<script>
module.exports = {
    name: "app-about"
}
</script>

