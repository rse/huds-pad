
/*  HUDS communication  */
window.HUDS = class HUDS {
    constructor (settingsFile) {
        this.channel = ""
        this.client  = null

        /*  load settings  */
        const settings = this.loadSettingsFile(settingsFile)
        this.url    = settings.mqtt.url
        this.id     = settings.huds.id

        /*  optionally automatically determine MQTT broker URL  */
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

    /*  synchronously load settings file  */
    loadSettingsFile (file) {
        let settingsFile = null
        const xmlhttp = new XMLHttpRequest()
        xmlhttp.open("GET", file, false)
        xmlhttp.send()
        if (xmlhttp.status === 200)
            settingsFile = xmlhttp.responseText
        return jsyaml.load(settingsFile)
    }

    /*  connect to MQTT broker  */
    connect (channel, token1, token2) {
        /*  determine client UUID  */
        let clientId = localStorage.getItem("huds-pad-client-id")
        if (clientId !== undefined) {
            clientId = (new UUID(1)).format()
            localStorage.setItem("huds-pad-client-id", clientId)
        }

        /*  connect to MQTT broker  */
        this.channel = channel
        if (this.client !== null)
            this.disconnect().catch(() => {})
        this.client = mqtt.connect(this.url, {
            will: {
                /*  use an MQTT "last will" message to end attendance (implicitly)  */
                topic:   `stream/${this.channel}/sender`,
                payload: this.createMessage("attendance", { event: "end" }),
                qos:     2,
                retain:  false
            },
            username: token1,
            password: token2,
            clientId,
            reconnectPeriod: 4 * 1000,
            connectTimeout: 30 * 1000
        })
        this.client.subscribe(`stream/${this.channel}/receiver`, () => {})
        return this.client
    }

    /*  begin/end attendance (explicitly)  */
    beginAttendance () {
        return this.sendMessageToBroker("attendance", {
            event: "begin",
            data: {
                name:    this.client.id,
                image:   "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
                privacy: "private"
            }
        })
    }
    endAttendance () {
        return this.sendMessageToBroker("attendance", {
            event: "end"
        })
    }

    /*  send a message/feedback/feeling  */
    sendMessage (text) {
        return this.sendMessageToBroker("message", {
            text
        })
    }
    sendFeedback (type) {
        return this.sendMessageToBroker("feedback", {
            type
        })
    }
    sendFeeling (mood, challenge) {
        return this.sendMessageToBroker("feeling", {
            challenge,
            mood
        })
    }

    /*  send an arbitrary message to the MQTT broker  */
    sendMessageToBroker (event, data) {
        return new Promise((resolve, reject) => {
            if (!this.client.connected)
                reject(new Error("Not connected to MQTT broker"))
            const msg = this.createMessage(event, data)
            this.client.publish(`stream/${this.channel}/sender`, msg, { qos: 2, retain: false }, (err) => {
                if (err) reject(err)
                else     resolve()
            })
        })
    }

    /*  create an arbitrary MQTT message for HUDS  */
    createMessage (event, data = {}) {
        data.client = localStorage.getItem("huds-pad-client-id")
        return JSON.stringify({
            id:    this.id,
            event,
            data
        })
    }

    /*  disconnect from MQTT broker  */
    disconnect () {
        return new Promise((resolve, reject) => {
            if (!this.client.connected)
                reject(new Error("still not connected"))
            try {
                this.client.end()
                this.client = { connected: false }
            }
            catch (error) {
                reject(error)
            }
        })
    }
}

