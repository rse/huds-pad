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

/*  provide global Vue "$status" property  */
let showhints = localStorage.getItem("huds-pad-show-hints")
if (typeof showhints !== "string" || !showhints.match(/^(?:yes|no)$/)) {
    showhints = "yes"
    localStorage.setItem("huds-pad-show-hints", showhints)
}
const status = Vue.reactive({
    online:              true,
    showqrcode:          false,
    showabout:           false,
    showhints:           showhints === "yes",
    tippyTrigger:        showhints === "yes" ? "mouseenter focus" : "manual",
    logTraffic:          false,
    activeTraffic:       false,
    connected:           false,
    isMessagingDisabled: false,
    isVotingDisabled:    true,
    votingType:          "propose",
    clearVoting:         false
})
const $status = {
    value: status,
    setOnline (online)           { status.online = online },
    toggleQRCode ()              { status.showqrcode = !status.showqrcode },
    toggleAbout ()               { status.showabout  = !status.showabout  },
    toggleHints ()               {
        status.showhints = !status.showhints
        localStorage.setItem("huds-pad-show-hints", status.showhints ? "yes" : "no")
        status.tippyTrigger = status.showhints ? "mouseenter focus" : "manual"
    },
    toggleLogTraffic ()          { status.logTraffic = !status.logTraffic },
    setActiveTraffic (active)    { status.activeTraffic = active },
    setConnectionEstablished ()  { status.connected = true  },
    setConnectionClosed ()       { status.connected = false },
    disabledMessaging (disabled) { status.isMessagingDisabled = disabled },
    disabledVoting (disabled)    { status.isVotingDisabled    = disabled },
    setVotingType (type)         { status.votingType = type },
    clearVoting ()               { status.clearVoting = !status.clearVoting }
}

/*  provide global Vue "$info" property  */
const msg = Vue.ref("")
const err = Vue.ref("")
const clients = Vue.ref(0)
const $info = {
    msg,
    err,
    clients,
    setMessage   (text) { msg.value = text },
    clearMessage ()     { msg.value = ""   },
    setError     (text) { err.value = text },
    clearError   ()     { err.value = ""   },
    setClients   (num)  { clients.value = num }
}

/*  export results  */
export default { $status, $info }

