//Latest build: 11-30-16 18:12
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './authorization/oauth2', './entities/User', './entities/Device', './entities/Group', './entities/Model', './entities/Transmitter', './tools/ajax', './tools/mqtt'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./authorization/oauth2'), require('./entities/User'), require('./entities/Device'), require('./entities/Group'), require('./entities/Model'), require('./entities/Transmitter'), require('./tools/ajax'), require('./tools/mqtt'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.oauth2, global.User, global.Device, global.Group, global.Model, global.Transmitter, global.ajax, global.mqtt);
        global.main = mod.exports;
    }
})(this, function (exports, _oauth, _User, _Device, _Group, _Model, _Transmitter, _ajax, _mqtt) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Transmitter = exports.Model = exports.Group = exports.Device = exports.User = exports.Oauth2 = undefined;

    var _oauth2 = _interopRequireDefault(_oauth);

    var _User2 = _interopRequireDefault(_User);

    var _Device2 = _interopRequireDefault(_Device);

    var _Group2 = _interopRequireDefault(_Group);

    var _Model2 = _interopRequireDefault(_Model);

    var _Transmitter2 = _interopRequireDefault(_Transmitter);

    var _ajax2 = _interopRequireDefault(_ajax);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.Oauth2 = _oauth2.default;
    exports.User = _User2.default;
    exports.Device = _Device2.default;
    exports.Group = _Group2.default;
    exports.Model = _Model2.default;
    exports.Transmitter = _Transmitter2.default;


    var config = {
        persistToken: true,
        mqtt: {
            endpoint: 'mqtt.relayr.io'
        },
        ajax: {
            uri: 'api.relayr.io',
            dataUri: 'data.relayr.io',
            protocol: 'https://'
        }
    };

    var currentUser = void 0;
    var project = void 0;
    var oauth2 = void 0;
    var main = {
        init: function init(p, customConfig) {
            project = p;

            if (customConfig) {
                Object.assign(config, customConfig);
                _ajax.ajax.options = config.ajax;
            }
        },

        authorize: function authorize(optionalToken) {
            return new Promise(function (resolve, reject) {

                if (!oauth2) {
                    oauth2 = new _oauth2.default({
                        protocol: _ajax.ajax.options.protocol,
                        uri: _ajax.ajax.options.uri,
                        appId: project.id,
                        redirectURI: project.redirectURI,
                        persist: config.persistToken
                    });
                }
                var token = void 0;
                if (!optionalToken) {
                    oauth2.login();

                    token = oauth2.token;
                } else {
                    token = optionalToken;
                }

                _ajax.ajax.options.token = token;
                currentUser = new _User2.default(config);

                main._verifyToken(currentUser).then(function () {
                    resolve(currentUser);
                }).catch(function (err) {
                    oauth2.logout();
                    oauth2.login();
                });
            });
        },

        _verifyToken: function _verifyToken(currentUser) {
            return new Promise(function (resolve, reject) {
                currentUser.getUserInfo().then(function (response) {
                    resolve();
                }).catch(function (err) {
                    if (err.status == 401) {
                        console.log('your token is invalid, please log in again');
                    }
                    reject(err);
                });
            });
        },

        logout: function logout() {
            if (!!oauth2) {
                oauth2.logout();
                oauth2 = null;
            } else {
                throw new Error('You must log in before you can log out');
            }
        },

        getConfig: function getConfig() {
            return config;
        },

        getCurrentUser: function getCurrentUser() {
            return currentUser;
        },

        customAjax: function customAjax(ajaxConfiguration) {
            if (ajaxConfiguration) {
                return new _ajax2.default(ajaxConfiguration);
            } else {
                throw new Error('Provide the custom configuration to make a new Ajax instance');
            }
        }
    };

    exports.default = main;
});
