(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../tools/ajax.js', './Device', './App', './Publisher', './Group', './Transmitter'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('../tools/ajax.js'), require('./Device'), require('./App'), require('./Publisher'), require('./Group'), require('./Transmitter'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.ajax, global.Device, global.App, global.Publisher, global.Group, global.Transmitter);
        global.User = mod.exports;
    }
})(this, function (module, exports, _ajax, _Device, _App, _Publisher, _Group, _Transmitter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Device2 = _interopRequireDefault(_Device);

    var _App2 = _interopRequireDefault(_App);

    var _Publisher2 = _interopRequireDefault(_Publisher);

    var _Group2 = _interopRequireDefault(_Group);

    var _Transmitter2 = _interopRequireDefault(_Transmitter);

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

    var User = function () {
        function User(config) {
            _classCallCheck(this, User);

            this.config = config;
            this.token = _ajax.ajax.options.token;
        }

        _createClass(User, [{
            key: 'getUserInfo',
            value: function getUserInfo() {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    if (_this.userInfo) {
                        resolve(_this.userInfo);
                    } else {
                        _ajax.ajax.get('/oauth2/user-info').then(function (response) {
                            _this.userInfo = Object.assign({}, response, {
                                token: _ajax.ajax.options.token
                            });
                            resolve(_this.userInfo);
                        }).catch(function (error) {
                            reject(error);
                        });
                    }
                });
            }
        }, {
            key: 'getMyDevices',
            value: function getMyDevices() {
                var _this2 = this;

                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return new Promise(function (resolve, reject) {
                    _this2.getUserInfo().then(function () {

                        _ajax.ajax.get('/users/' + _this2.userInfo.id + '/devices').then(function (response) {
                            if (opts.asClasses) {
                                resolve(response.map(function (device) {
                                    return new _Device2.default(device, _this2.config);
                                }));
                            } else {
                                _this2.devicesCache = response;
                                resolve(response);
                            }
                        }).catch(reject);
                    });
                });
            }
        }, {
            key: 'searchForDevices',
            value: function searchForDevices() {
                var _this3 = this;

                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                if (!opts.query) {
                    throw new Error('Please provide a query object');
                }
                var _opts$query = opts.query,
                    device_name = _opts$query.name,
                    device_description = _opts$query.description,
                    device_ids = _opts$query.ids,
                    model_id = _opts$query.modelId,
                    firmware_version = _opts$query.firmwareVersion;

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.get('/devices', {
                        queryObj: {
                            device_name: device_name,
                            device_description: device_description,
                            device_ids: device_ids,
                            model_id: model_id,
                            firmware_version: firmware_version
                        }
                    }).then(function (response) {
                        var devices = response.data;

                        if (opts.asClasses) {
                            resolve(devices.map(function (device) {
                                return new _Device2.default(device, _this3.config);
                            }));
                        } else {
                            resolve(devices);
                        }
                    }, reject);
                });
            }
        }, {
            key: 'searchForDevicesEx',
            value: function searchForDevicesEx() {
                var _this4 = this;

                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var nextPageURL = arguments[1];

                if (!opts.query) {
                    throw new Error('Please provide a query object');
                }

                var _opts$query2 = opts.query,
                    device_name = _opts$query2.name,
                    device_description = _opts$query2.description,
                    device_ids = _opts$query2.ids,
                    model_id = _opts$query2.modelId,
                    firmware_version = _opts$query2.firmwareVersion;


                if (nextPageURL == undefined || nextPageURL.length <= 0) {
                    nextPageURL = "/devices";
                }

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.get(nextPageURL, {
                        queryObj: {
                            device_name: device_name,
                            device_description: device_description,
                            device_ids: device_ids,
                            model_id: model_id,
                            firmware_version: firmware_version
                        }
                    }).then(function (response) {
                        var devices = response.data,
                            links = response.links;


                        var devicesData = {};
                        if (links) {
                            devicesData.links = links;
                        }

                        if (opts.asClasses) {
                            devicesData.devices = devices.map(function (device) {
                                return new _Device2.default(device, _this4.config);
                            });
                        } else {
                            devicesData.devices = devices;
                        }

                        resolve(devicesData);
                    }, reject);
                });
            }
        }, {
            key: 'getMyGroups',
            value: function getMyGroups() {
                var _this5 = this;

                return new Promise(function (resolve, reject) {
                    _this5.getUserInfo().then(function () {
                        _ajax.ajax.get('/users/' + _this5.userInfo.id + '/groups').then(function (response) {
                            resolve(response);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                });
            }
        }, {
            key: 'getMyTransmitters',
            value: function getMyTransmitters() {
                var _this6 = this;

                return new Promise(function (resolve, reject) {
                    _this6.getUserInfo().then(function () {
                        _ajax.ajax.get('/users/' + _this6.userInfo.id + '/transmitters').then(function (response) {
                            resolve(response);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                });
            }
        }, {
            key: 'getMyApps',
            value: function getMyApps() {
                var _this7 = this;

                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return new Promise(function (resolve, reject) {
                    _this7.getMyPublishers().then(function (res) {
                        _this7._getPublisherApps(res).then(function (res2) {
                            if (opts.asClasses) {
                                resolve(res2.map(function (item) {
                                    return new _App2.default(item, _this7.config);
                                }));
                            } else {
                                resolve(res2);
                            }
                        }, function (err) {
                            reject(err);
                        });
                    }, function (err) {
                        reject(err);
                    });
                });
            }
        }, {
            key: 'getMyPublishers',
            value: function getMyPublishers() {
                var _this8 = this;

                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return new Promise(function (resolve, reject) {
                    _this8.getUserInfo().then(function () {
                        _ajax.ajax.get('/users/' + _this8.userInfo.id + '/publishers').then(function (response) {
                            if (opts.asClasses) {
                                resolve(response.map(function (item) {
                                    return new _Publisher2.default(item, _this8.config);
                                }));
                            } else {
                                resolve(response);
                            }
                            resolve(response);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                });
            }
        }, {
            key: '_getPublisherApps',
            value: function _getPublisherApps(pubsArray) {
                return new Promise(function (resolve, reject) {
                    var appsArray = [];
                    pubsArray.forEach(function (element, i) {
                        _ajax.ajax.get('/publishers/' + element.id + '/apps/extended').then(function (response) {
                            var concatResult = appsArray.concat(response);
                            appsArray = concatResult;
                            if (i === pubsArray.length - 1) {
                                resolve(appsArray);
                            }
                        }).catch(function (err) {
                            return err;
                        });
                    });
                });
            }
        }, {
            key: '_getConfig',
            value: function _getConfig() {
                return this.config;
            }
        }, {
            key: 'getCachedDevices',
            value: function getCachedDevices() {
                var _this9 = this;

                return new Promise(function (resolve, reject) {
                    if (_this9.devicesCache) {
                        resolve(_this9.devicesCache);
                    } else {
                        resolve([]);
                    }
                });
            }
        }]);

        return User;
    }();

    exports.default = User;
    module.exports = exports['default'];
});