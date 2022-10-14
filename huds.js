class HUDS {
  client
  channel
  protocol
  hostname
  port
  id

  constructor() {
    const settings = this.loadSettingsFile()

    this.protocol = settings.connection.protocol
    this.hostname = settings.connection.hostname
    this.port = settings.connection.port
    this.id = settings.hud.id
  }

  initClient(token1, token2) {
    let clientId = localStorage.getItem("huds-pad-client-id")
    if (clientId !== undefined) {
      clientId = (new UUID(1)).format()
      localStorage.setItem("huds-pad-client-id", clientId)
    }

    const options = {
      will: {
        topic: `stream/${this.channel}/sender`,
        payload: this.createMessage("attendance", {
          event: "end",
        }),
        qos: 2,
        retain: false
      },
      username: token1,
      password: token2,
      clientId: clientId
    }

    this.client = mqtt.connect(`${this.protocol}://${this.hostname}:${this.port}/mqtt`, options)

    this.client.subscribe(`stream/${this.channel}/receiver`, function (err) {
      console.log()
    })
    this.client.subscribe(`stream/ruzman/sender`, function (err) {
      console.log()
    })
    this.client.on('message', function (topic, message) {
      // message is Buffer
      console.log(message.toString())
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

  endAttendance() {
    return this.sendMessageToBroker("attendance", {
      event: "end"
    })
  }

  sendMessage(text) {
    return this.sendMessageToBroker("message", {
      text: text
    })
  }

  sendFeedback(type) {
    return this.sendMessageToBroker("feedback", {
      type: type
    })
  }

  sendFeeling(mood, challenge) {
    return this.sendMessageToBroker("feeling", {
      challenge: challenge,
      mood: mood
    })
  }

  sendMessageToBroker(event, data) {
    this.assertConnection()
    const msg = this.createMessage(event, data)
    this.client.publish(`stream/${this.channel}/sender`, msg, {qos: 2, retain: false})
  }

  createMessage(event, data) {
    data = data || {}
    data.client = localStorage.getItem("huds-pad-client-id")
    return JSON.stringify({
      id: this.id,
      event: event,
      data: data
    })
  }

  assertConnection() {
    if (!this.client.connected) {
      throw new Error("Not connected")
    }
  }

  disconnect() {
    if (this.client.connected) {
      try {
        this.client.end()
        this.client = {
          connected: false,
        }
      } catch (error) {
        console.log("Disconnect failed", error.toString())
      }
    }
  }

  loadSettingsFile() {
    let settingsFile = null
    const xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", "settings.yaml", false)
    xmlhttp.send()
    if (xmlhttp.status === 200) {
      settingsFile = xmlhttp.responseText
    }
    return jsyaml.load(settingsFile)
  }
}
