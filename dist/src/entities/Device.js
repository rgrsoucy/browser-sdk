(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../tools/ajax.js', '../tools/connection.js', './history/DeviceHistory', '../tools/mqtt', './Model'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('../tools/ajax.js'), require('../tools/connection.js'), require('./history/DeviceHistory'), require('../tools/mqtt'), require('./Model'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.ajax, global.connection, global.DeviceHistory, global.mqtt, global.Model);
        global.Device = mod.exports;
    }
})(this, function (module, exports, _ajax, _connection, _DeviceHistory, _mqtt, _Model) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _ajax2 = _interopRequireDefault(_ajax);

    var _connection2 = _interopRequireDefault(_connection);

    var _DeviceHistory2 = _interopRequireDefault(_DeviceHistory);

    var _mqtt2 = _interopRequireDefault(_mqtt);

    var _Model2 = _interopRequireDefault(_Model);

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

    var sharedChannel = null;
    var mqtt = null;

    var Device = function () {
        function Device() {
            var rawDevice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            _classCallCheck(this, Device);

            this.rawDevice = rawDevice;
            this.config = config;

            mqtt = mqtt || new _mqtt2.default(config.mqtt);
            this.id = rawDevice.id;
            this.name = rawDevice.name;
            this.modelId = rawDevice.modelId;
            this.model = new _Model2.default(this.modelId, config);
            this.description = rawDevice.description;
            this.owner = rawDevice.owner;
            this.openToPublic = rawDevice.public;
            this.history = new _DeviceHistory2.default(rawDevice, config);
            this.configurations = [];
            this.commands = [];
            this.metadata = {};
        }

        _createClass(Device, [{
            key: 'updateDevice',
            value: function updateDevice(patch, raw) {
                var _this = this;

                if (!this.id) {
                    throw new Error('Provide the device id during instantiation');
                } else if (!patch) {
                    throw new Error('Provide a patch of parameters to update');
                } else if (!Object.keys(patch).length) {
                    throw new Error('Provide a patch with some parameters to update');
                }

                for (var x in patch) {
                    if (!this.hasOwnProperty(x)) {
                        throw new Error('Provide a patch with relevant parameters to update');
                    }
                }

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.patch('/devices/' + _this.id, patch, {
                        raw: raw
                    }).then(function (response) {
                        _this.name = response.name;
                        _this.modelId = response.modelId;
                        _this.owner = response.owner;
                        _this.openToPublic = response.public;
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'getHistoricalData',
            value: function getHistoricalData(opts) {
                return this.history.getHistoricalData(opts);
            }
        }, {
            key: 'getAllHistoricalData',
            value: function getAllHistoricalData(opts) {
                return this.history.getAllHistoricalData(opts);
            }
        }, {
            key: 'getReadings',
            value: function getReadings() {
                if (!this.id) {
                    throw new Error('Provid a device id');
                }
                return _ajax.ajax.get('/devices/' + this.id + '/readings');
            }
        }, {
            key: 'deleteDevice',
            value: function deleteDevice(raw) {
                var _this2 = this;

                if (!this.id) {
                    throw new Error('Provide the device id during instantiation');
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.delete('/devices/' + _this2.id).then(function (response) {
                        //right now the object hangs around, but on the cloud it is gone
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'sendCommand',
            value: function sendCommand(command, raw) {
                var _this3 = this;

                if (!this.id) {
                    throw new Error('Provide the device id during instantiation');
                } else if (!command) {
                    throw new Error('Provide a command');
                }
                //path, name, value
                else if (!command.path && !command.name && !command.value) {
                        throw new Error('Provide a properly formatted command');
                    }

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.post('/devices/' + _this3.id + '/commands', command, {
                        raw: raw
                    }).then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'getChannel',
            value: function getChannel(transport) {
                var _this4 = this;

                return new Promise(function (resolve, reject) {
                    if (_this4._channelCredentials) {
                        resolve(_this4._channelCredentials);
                    } else {

                        var body = {
                            deviceId: _this4.id,
                            transport: transport || 'mqtt'
                        };
                        _ajax.ajax.post('/channels', body).then(function (response) {
                            _this4._channelCredentials = response;
                            if (!sharedChannel) {
                                sharedChannel = _this4._channelCredentials;
                            }
                            resolve(response);
                        }).catch(function (error) {
                            reject(error);
                        });
                    }
                });
            }
        }, {
            key: 'connect',
            value: function connect() {
                var transport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'mqtt';

                var connection = new _connection2.default();
                var getChannel = this.getChannel();

                var subscribeMqtt = function subscribeMqtt(newChannelCredentials) {
                    var options = {
                        password: sharedChannel.credentials.password,
                        userName: sharedChannel.credentials.user
                    };

                    mqtt.subscribe(newChannelCredentials.credentials.topic, connection.event);
                    connection.unsubscribe = function () {
                        mqtt.unsubscribe(newChannelCredentials.credentials.topic, connection.event);
                    };
                    return mqtt.connect(options);
                };

                return new Promise(function (resolve, reject) {
                    getChannel.then(subscribeMqtt).then(function () {
                        resolve(connection);
                    }).catch(function (error) {
                        return reject(error);
                    });
                });
            }
        }, {
            key: 'getDeviceState',
            value: function getDeviceState() {
                var _this5 = this;

                if (!this.id) {
                    throw new Error('Provide the device id during instantiation');
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.get('/devices/' + _this5.id + '/state').then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'getDeviceConfigurations',
            value: function getDeviceConfigurations() {
                var _this6 = this;

                // api/devices/deviceId/configurations
                if (!this.id) {
                    throw new Error('Provide the device id during instantiation');
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.get('/devices/' + _this6.id + '/configurations').then(function (response) {
                        _this6.configurations = response;
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'setDeviceConfigurations',
            value: function setDeviceConfigurations(schema) {
                var _this7 = this;

                // api/devices/deviceId/configurations
                //POST
                if (!this.id) {
                    throw new Error('Provide the userId during instantiation');
                } else if (!schema) {
                    throw new Error('Provide a schema of parameters to set');
                } else if (!Object.keys(schema).length) {
                    throw new Error('Provide a schema with some parameters to set');
                }
                if (!(schema.path && schema.name && schema.value)) {
                    throw new Error('Provide a schema with path, name, and value');
                }

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.post('/devices/' + _this7.id + '/configurations', schema).then(function (response) {
                        _this7.configurations.push(response);
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'getDeviceCommands',
            value: function getDeviceCommands() {
                var _this8 = this;

                // api/devices/deviceId/commands
                if (!this.id) {
                    throw new Error('Provide the deviceId during instantiation');
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.get('/devices/' + _this8.id + '/commands').then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'setDeviceCommands',
            value: function setDeviceCommands(schema) {
                var _this9 = this;

                // api/devices/deviceId/commands
                //POST
                if (!this.id) {
                    throw new Error('Provide the userId during instantiation');
                } else if (!schema) {
                    throw new Error('Provide a schema of parameters to set');
                } else if (!Object.keys(schema).length) {
                    throw new Error('Provide a schema with some parameters to set');
                }
                if (!(schema.path && schema.name && schema.value)) {
                    throw new Error('Provide a schema with path, name, and value');
                }

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.post('/devices/' + _this9.id + '/commands', schema).then(function (response) {
                        _this9.commands.push(response);
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'getDeviceMetadata',
            value: function getDeviceMetadata() {
                var _this10 = this;

                // api/devices/deviceId/metadata
                if (!this.id) {
                    throw new Error('Provide the deviceId during instantiation');
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.get('/devices/' + _this10.id + '/metadata').then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'setDeviceMetadata',
            value: function setDeviceMetadata(schema) {
                var _this11 = this;

                // api/devices/deviceId/metadata
                //POST
                if (!this.id) {
                    throw new Error('Provide the userId during instantiation');
                } else if (!schema) {
                    throw new Error('Provide a schema of parameters to set');
                } else if (!Object.keys(schema).length) {
                    throw new Error('Provide a schema with some parameters to set');
                }

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.post('/devices/' + _this11.id + '/metadata', schema, { raw: false }).then(function (response) {
                        _this11.metadata = schema;
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'deleteDeviceMetadata',
            value: function deleteDeviceMetadata() {
                var _this12 = this;

                // api/devices/deviceId/metadata
                //DELETE
                if (!this.id) {
                    throw new Error('Provide the userId during instantiation');
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.delete('/devices/' + _this12.id + '/metadata').then(function (response) {
                        //right now the object hangs around, but on the cloud it is gone
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }]);

        return Device;
    }();

    exports.default = Device;
    ;
    module.exports = exports['default'];
});