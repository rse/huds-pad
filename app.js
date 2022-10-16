
class HUDS {
    client
    channel
    url
    id

    constructor (settingsFile) {
        const settings = this.loadSettingsFile(settingsFile)
        this.url = settings.mqtt.url
        this.id  = settings.huds.id
        if (this.url === "auto") {
            const uri = URI(window.location.href)
            if (uri.protocol() === "http")
                uri.protocol("ws")
            else if (uri.protocol() === "https")
                uri.protocol("wss")
            uri.pathname("/mqtt/")
            uri.search("")
            uri.hash("")
            this.url = uri.toString()
        }
    }

    initClient (token1, token2) {
        let clientId = localStorage.getItem("huds-pad-client-id")
        if (clientId !== undefined) {
            clientId = (new UUID(1)).format()
            localStorage.setItem("huds-pad-client-id", clientId)
        }

        const options = {
            will: {
              topic:   `stream/${this.channel}/sender`,
              payload: this.createMessage("attendance", { event: "end" }),
              qos:     2,
              retain:  false
            },
            username:  token1,
            password:  token2,
            clientId:  clientId
        }

        this.client = mqtt.connect(this.url, options)
        this.client.subscribe(`stream/${this.channel}/receiver`, (err) => {
            /*  FIXME  */
        })

        return this.client
    }

    beginAttendance() {
        return this.sendMessageToBroker("attendance", {
            event: "begin",
            data: {
                name: this.client.id,
                privacy: "private"
            }
        })
    }

    endAttendance () {
        return this.sendMessageToBroker("attendance", {
            event: "end"
        })
    }

    sendMessage (text) {
        return this.sendMessageToBroker("message", {
            text: text
        })
    }

    sendFeedback (type) {
        return this.sendMessageToBroker("feedback", {
            type: type
        })
    }

    sendFeeling (mood, challenge) {
        return this.sendMessageToBroker("feeling", {
            challenge: challenge,
            mood: mood
        })
    }

    sendMessageToBroker (event, data) {
        this.assertConnection()
        const msg = this.createMessage(event, data)
        this.client.publish(`stream/${this.channel}/sender`, msg, {qos: 2, retain: false})
    }

    createMessage (event, data) {
        data = data || {}
        data.client = localStorage.getItem("huds-pad-client-id")
        return JSON.stringify({
            id:    this.id,
            event: event,
            data:  data
        })
    }

    assertConnection () {
        if (!this.client.connected)
            throw new Error("Not connected")
    }

    disconnect () {
        if (this.client.connected) {
            try {
                this.client.end()
                this.client = { connected: false }
            }
            catch (error) {
                console.log("Disconnect failed", error.toString())
            }
        }
    }

    loadSettingsFile (file) {
        let settingsFile = null
        const xmlhttp = new XMLHttpRequest()
        xmlhttp.open("GET", file, false)
        xmlhttp.send()
        if (xmlhttp.status === 200)
            settingsFile = xmlhttp.responseText
        return jsyaml.load(settingsFile)
    }
}

class App {
    static main () {
        /*  initialize user interface  */
        Vue.load = (name) => {
            return window["vue3-sfc-loader"].loadModule(name, {
                moduleCache: { vue: Vue, less: less },
                getFile (url) {
                    return fetch(url).then((res) => res.ok ? res.text() :
                        Promise.reject(Object.assign(new Error(`${url}: ${res.statusText}`), { res })))
                },
                addStyle (textContent) {
                    const style = Object.assign(document.createElement("style"), { textContent })
                    const ref = document.head.getElementsByTagName("style")[0] || null
                    document.head.insertBefore(style, ref)
                },
                log (type, ...args) {
                    console.log("vue3-sfc-loader", type, ...args)
                },
                additionalModuleHandlers: {
                    ".css": (source, path, options) => {
                        return less.render(source, { globalVars: vars }).then((result) => result.css)
                    }
                }
            })
        }
        Vue.loadComponent = (name) =>
            Vue.defineAsyncComponent(() => Vue.load(name))
        let app = Vue.createApp({ components: { "app": Vue.loadComponent("app.vue") } })
        app.mount("#app")

        /*  provide global properties  */
        const info   = Vue.ref("")
        const status = Vue.reactive({
            connected:           false,
            isMessagingDisabled: false,
            isVotingDisabled:    true,
            votingType:          "propose",
            clearVoting:         false
        })
        const huds = new HUDS("app.yaml")
        app.config.globalProperties.huds = huds
        app.config.globalProperties.$status = {
            value: status,
            setConnectionEstablished ()  { status.connected = true  },
            setConnectionClosed ()       { status.connected = false },
            disabledMessaging (disabled) { status.isMessagingDisabled = disabled },
            disabledVoting (disabled)    { status.isVotingDisabled    = disabled },
            setVotingType (type)         { status.votingType = type },
            clearVoting ()               { status.clearVoting = !status.clearVoting }
        }
        app.config.globalProperties.$info = {
            value: info,
            setMessage (text) { info.value = text },
            clearMessage ()   { info.value = "" }
        }
    }
}

