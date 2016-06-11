export
default class Mqtt {
    constructor(config) {

        this.config = {
            mqttTimeout: 10000
        }

        if (config) {
            Object.assign(this.config, config);
        }
        this.endpoint = options.endpoint;
        this.port = options.port
        this.clientId = 'JSDK_' + Math.floor((Math.random() * 1000))
        this.client = new Paho.MQTT.Client(this.endpoint, this.port, this.clientId);
        this._topics = {};

    }

    connect(config) {
        let options = {
            timeout: 30,
            keepAliveInterval: 10,
            cleanSession: true,
            useSSL: true,
            userName: config.user,
            password: config.password,
            onSuccess: this._onConnectSuccess,
            onFailure: this._onConnectFailure
        };

        this.client.onConnectionLost = _onConnectionLost;
        this.client.onMessageArrived = _onMessageArrived;
        this.client.connect(options);
    }


    subscribe(topic, eventCallback) {
        this.client.subscribe(topic, 0);

        let thisTopic = this._topics[topic];
        if (thisTopic) {
            thisTopic.subscribers.push(eventCallback);
        } else {
            thisTopic.subscribers = [];
        }

    }

    _onConnectSuccess() {

        this.topics.forEach(function(subscription) {
            this.client.subscribe(subscription.credentials.topic, 0);
        });
    }

    _onConnectFailure() {
        if (!this.forceDisconnect) {
            this.connect(this.credentials);
        }
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