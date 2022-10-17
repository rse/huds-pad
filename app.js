
/*  main application procedure  */
window.App = class App {
    static main () {
        /*  provide custom Vue loader  */
        Vue.load = (name) => {
            return window["vue3-sfc-loader"].loadModule(name, {
                moduleCache: { vue: Vue, less },
                getFile (url) {
                    return fetch(url).then((res) => res.ok ?
                        res.text() :
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
                    ".css": (source, path, options) =>
                        less.render(source, { globalVars: {} }).then((result) => result.css)
                }
            })
        }
        Vue.loadComponent = (name) =>
            Vue.defineAsyncComponent(() => Vue.load(name))

        /*  initialize user interface  */
        const app = Vue.createApp({ components: { "app": Vue.loadComponent("app.vue") } })

        /*  provide global $status property  */
        const status = Vue.reactive({
            showqrcode:          false,
            connected:           false,
            isMessagingDisabled: false,
            isVotingDisabled:    true,
            votingType:          "propose",
            clearVoting:         false
        })
        app.config.globalProperties.$status = {
            value: status,
            toggleQRCode ()              { status.showqrcode = !status.showqrcode },
            setConnectionEstablished ()  { status.connected = true  },
            setConnectionClosed ()       { status.connected = false },
            disabledMessaging (disabled) { status.isMessagingDisabled = disabled },
            disabledVoting (disabled)    { status.isVotingDisabled    = disabled },
            setVotingType (type)         { status.votingType = type },
            clearVoting ()               { status.clearVoting = !status.clearVoting }
        }

        /*  provide global $info property  */
        const msg = Vue.ref("")
        const err = Vue.ref("")
        app.config.globalProperties.$info = {
            msg,
            err,
            setMessage   (text) { msg.value = text },
            clearMessage ()     { msg.value = ""   },
            setError     (text) { err.value = text },
            clearError   ()     { err.value = ""   }
        }

        /*  provide global huds property  */
        const huds = new HUDS("app.yaml")
        app.config.globalProperties.huds = huds

        /*  ensure all fonts are loaded  */
        const fonts = [
            { family: "TypoPRO Source Sans Pro", spec: { weight: 300 } },
            { family: "TypoPRO Source Sans Pro", spec: { weight: 400 } },
            { family: "TypoPRO Source Sans Pro", spec: { weight: 700 } },
            { family: "TypoPRO Source Sans Pro", spec: { weight: 900 } }
        ]
        Promise.all(fonts.map((font) => (new FontFaceObserver(font.family, font.spec)).load())).then(() => {
            /*  mount UI  */
            app.mount("#app")
        })
    }
}

