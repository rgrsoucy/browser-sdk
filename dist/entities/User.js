(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../tools/ajax.js', './Device'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('../tools/ajax.js'), require('./Device'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.ajax, global.Device);
        global.User = mod.exports;
    }
})(this, function (module, exports, _ajax, _Device) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Device2 = _interopRequireDefault(_Device);

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
            key: 'getMyGroups',
            value: function getMyGroups() {
                var _this4 = this;

                return new Promise(function (resolve, reject) {
                    _this4.getUserInfo().then(function () {
                        _ajax.ajax.get('/users/' + _this4.userInfo.id + '/groups').then(function (response) {
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
                var _this5 = this;

                return new Promise(function (resolve, reject) {
                    _this5.getUserInfo().then(function () {
                        _ajax.ajax.get('/users/' + _this5.userInfo.id + '/transmitters').then(function (response) {
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
                var _this6 = this;

                return new Promise(function (resolve, reject) {
                    _this6.getUserInfo().then(function () {
                        _ajax.ajax.get('/users/' + _this6.userInfo.id + '/apps').then(function (response) {
                            resolve(response);
                        }).catch(function (error) {
                            reject(error);
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
                var _this7 = this;

                return new Promise(function (resolve, reject) {
                    if (_this7.devicesCache) {
                        resolve(_this7.devicesCache);
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