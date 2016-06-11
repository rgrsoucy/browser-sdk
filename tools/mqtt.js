import Paho from '../vendors/mqttws31.min.js';
export
default class Mqtt {
    constructor(config) {
        var self = this;
        this.paho = new Paho;

        this.config = {
            endpoint: "mqtt.relayr.io",
            port: 443,
            mqttTimeout: 10000
        }

        if (config) {
            Object.assign(this.config, config);
        }
        this.endpoint = this.config.endpoint;
        this.port = this.config.port
        this.clientId = 'JSDK_' + Math.floor((Math.random() * 1000))
        this.client = new this.paho.MQTT.Client(this.endpoint, this.port, this.clientId);
        this._topics = {};
    }

    connect(config) {
        return new Promise((resolve, reject) => {

            let options = {
                timeout: 30,
                keepAliveInterval: 10,
                cleanSession: true,
                useSSL: true,
                userName: config.user,
                password: config.password,
                onSuccess: () => {
                    this._onConnectSuccess();
                    resolve();
                },
                onFailure: () => {
                    this._onConnectFailure()
                    reject();
                }
            };

            this.client.onConnectionLost = () => {
                this._onConnectionLost();
            };
            this.client.onMessageArrived = (data) => {
                this._onMessageArrived(data)
            };
            this.client.connect(options);
        });
    }


    subscribe(topic, eventCallback) {
        if (this.client.isConnected()) this.client.subscribe(topic, 0);

        console.log(this._topics)

        if (this._topics[topic]) {
            this._topics[topic].subscribers.push(eventCallback);
        } else {
            this._topics[topic] = {};
            this._topics[topic].subscribers = [];
            this._topics[topic].subscribers.push(eventCallback);
        }

    }

    _onConnectSuccess() {
        console.log("onSuccess", this._topics)
        for (let topic in this._topics) {
            console.log(topic)
            this.client.subscribe(topic, 0)
        }
    }

    _onConnectFailure() {
        console.log("onFailure")
    }

    _onConnectionLost() {
        console.log('Lost connection');
        setTimeout(function() {
            self.client.isConnected = false;
            self.connect(self.lastParam);

            if (!self.forceDisconnect) {
                self.connect(self.lastParam);
            }
        }, this.config.mqttTimeout);
    }

    _onMessageArrived(data) {
        try {
            let deviceId = data._getDestinationName().split('/v1/')[1].split('/')[0];
            let dataTopic = data._getDestinationName().split('/v1/')[1];
            let incomingData = (data._getPayloadString());
            incomingData = JSON.parse(data._getPayloadString());
            console.log(incomingData)
            for (let topic in this._topics) {
                for (var i = this.topics[topic].subscribers - 1; i >= 0; i--) {
                    let subscriber = this.topic[topic].subscribers[i];
                    if (subscriber) {
                        subscriber(incomingData);
                    }
                }


            }
        } catch (err) {
            console.log('Incoming data function error:', err);
        }
    }

}