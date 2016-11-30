(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../../vendors/mqttws31.min.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../../vendors/mqttws31.min.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.mqttws31Min);
        global.mqtt = mod.exports;
    }
})(this, function (exports, _mqttws31Min) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.mqtt = undefined;

    var _mqttws31Min2 = _interopRequireDefault(_mqttws31Min);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Mqtt = function () {
        function Mqtt(config) {
            _classCallCheck(this, Mqtt);

            var self = this;

            this.config = {
                endpoint: 'mqtt.relayr.io',
                port: 443,
                mqttTimeout: 10000,
                reconnectLimit: 10,
                reconnectTimeout: 60000
            };

            if (config) {
                Object.assign(this.config, config);
            }
            this.endpoint = this.config.endpoint;
            this.port = this.config.port;
            this.clientId = 'JSDK_' + Math.floor(Math.random() * 1000);
            this._topics = {};

            try {
                this.paho = new _mqttws31Min2.default();
                this._initClient();
            } catch (e) {
                //Caught when window is not present
            }

            return this;
        }

        _createClass(Mqtt, [{
            key: 'connect',
            value: function connect(config) {
                var _this = this;

                if (!config) throw Error('You must provide configuration options');
                if (!config.userName) throw Error('You must provide userName in options');
                if (!config.password) throw Error('You must provide password in options');
                return new Promise(function (resolve, reject) {

                    var options = {
                        timeout: 30,
                        keepAliveInterval: 10,
                        cleanSession: true,
                        useSSL: true,
                        onSuccess: function onSuccess() {
                            _this.isConnecting = false;
                            _this._onConnectSuccess();
                            resolve();
                        },
                        onFailure: function onFailure(err) {
                            _this.isConnecting = false;
                            _this._onConnectFailure(err);
                            reject();
                        }

                    };
                    Object.assign(options, config);

                    if (_this.client) {
                        _this.client.onConnectionLost = function () {
                            _this._onConnectionLost(options);
                        };
                        _this.client.onMessageArrived = function (data) {
                            _this._onMessageArrived(data);
                        };

                        if (!_this.isConnecting && !_this.client.isConnected()) {
                            _this.client.connect(options);
                            _this.isConnecting = true;
                        }
                    }
                    resolve();
                });
            }
        }, {
            key: 'subscribe',
            value: function subscribe(topic, eventCallback) {
                if (!topic) throw Error('You must provide a topic');
                if (!eventCallback) throw Error('You must provide a callback for live events');
                if (this.client && this.client.isConnected()) this.client.subscribe(topic, 0);

                if (this._topics[topic]) {
                    this._topics[topic].subscribers.push(eventCallback);
                } else {
                    this._topics[topic] = {};
                    this._topics[topic].subscribers = [];
                    this._topics[topic].subscribers.push(eventCallback);
                }
                return this;
            }
        }, {
            key: 'unsubscribe',
            value: function unsubscribe(topic, eventCallback) {
                if (!topic) throw Error('You must provide a topic');

                if (this._topics[topic]) {
                    this._topics[topic].subscribers = this._topics[topic].subscribers.filter(function (subscriber) {
                        return eventCallback !== subscriber;
                    });
                }

                if (this._topics[topic] && !eventCallback) {
                    this._topics[topic].subscribers = [];
                }

                if (this._topics[topic] && this._topics[topic].subscribers.length === 0) {
                    this.client.unsubscribe(topic);
                }
                return this;
            }
        }, {
            key: '_onConnectSuccess',
            value: function _onConnectSuccess() {
                for (var topic in this._topics) {
                    this.client.subscribe(topic, 0);
                }
            }
        }, {
            key: '_onConnectFailure',
            value: function _onConnectFailure(err) {
                console.log('onFailure', err);
            }
        }, {
            key: '_onConnectionLost',
            value: function _onConnectionLost(lastConfig) {
                var _this2 = this;

                if (lastConfig) {
                    if (lastConfig._reconnects >= this.config.reconnectLimit) {
                        setTimeout(function () {
                            lastConfig._reconnects = 0;
                            _this2.connect(lastConfig);
                        }, this.config.reconnectTimeout);
                    } else {
                        if (!lastConfig._reconnects) lastConfig._reconnects = 0;
                        lastConfig._reconnects++;
                        this.connect(lastConfig);
                    }
                }
            }
        }, {
            key: '_onMessageArrived',
            value: function _onMessageArrived(data) {
                var dataTopic = data._getDestinationName();
                var incomingData = data._getPayloadString();
                incomingData = JSON.parse(data._getPayloadString());

                var subscribers = this._topics[dataTopic] ? this._topics[dataTopic].subscribers : null;
                if (subscribers) {
                    for (var i = subscribers.length - 1; i >= 0; i--) {
                        var subscriber = subscribers[i];
                        if (subscriber) {
                            subscriber(incomingData);
                        }
                    }
                }
            }
        }, {
            key: '_initClient',
            value: function _initClient() {
                this.client = new this.paho.MQTT.Client(this.endpoint, this.port, this.clientId);
                return this;
            }
        }]);

        return Mqtt;
    }();

    var mqtt = exports.mqtt = new Mqtt();

    exports.default = Mqtt;
});