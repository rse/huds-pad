/*
**  HUDS -- Head-Up-Display Server (HUDS)
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
*/

import * as Vue from "vue"

let showhints = localStorage.getItem("huds-pad-show-hints")
if (typeof showhints !== "string" || !showhints.match(/^(?:yes|no)$/)) {
    showhints = "yes"
    localStorage.setItem("huds-pad-show-hints", showhints)
}

const global = Vue.reactive({
    online:                 true,
    showqrcode:             false,
    showabout:              false,
    showhints:              showhints === "yes",
    tippyTrigger:           showhints === "yes" ? "mouseenter focus" : "manual",
    logTraffic:             false,
    activeTraffic:          false,
    connected:              false,
    isMessagingDisabled:    false,
    isVotingDisabled:       true,
    votingType:             "propose",
    clearVoting:            false,
    theme:                  "",
    feelingRefreshInterval: null,
    msg:                    "",
    err:                    "",
    clients:                0,
    pkg:                    {}
})

export default {
    value: global,
    setOnline (online: boolean)  { this.value.online = online },
    toggleQRCode ()              { this.value.showqrcode = !this.value.showqrcode },
    toggleAbout ()               { this.value.showabout  = !this.value.showabout  },
    setTheme (theme: string) {
        this.value.theme = theme
    },
    setHints (active: boolean) {
        this.value.showhints = active
        localStorage.setItem("huds-pad-show-hints", this.value.showhints ? "yes" : "no")
        this.value.tippyTrigger = this.value.showhints ? "mouseenter focus" : "manual"
    },
    toggleHints ()               {
        this.value.showhints = !this.value.showhints
        localStorage.setItem("huds-pad-show-hints", this.value.showhints ? "yes" : "no")
        this.value.tippyTrigger = this.value.showhints ? "mouseenter focus" : "manual"
    },
    toggleLogTraffic ()                   { this.value.logTraffic = !this.value.logTraffic },
    setActiveTraffic (active: boolean)    { this.value.activeTraffic = active },
    setConnectionEstablished ()           { this.value.connected = true  },
    setConnectionClosed ()                { this.value.connected = false },
    disabledMessaging (disabled: boolean) { this.value.isMessagingDisabled = disabled },
    disabledVoting (disabled: boolean)    { this.value.isVotingDisabled    = disabled },
    setVotingType (type: string)          { this.value.votingType = type },
    clearVoting ()                        { this.value.clearVoting = !this.value.clearVoting },
    setMessage (text: string)             { this.value.msg = text },
    clearMessage ()                       { this.value.msg = ""   },
    setError (text: string)               { this.value.err = text },
    clearError ()                         { this.value.err = ""   },
    setClients (num: number)              { this.value.clients = num },
    setPkg (pkg: object)                  { this.value.pkg = pkg }
}

