(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["relayr"] = factory();
	else
		root["relayr"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(5), __webpack_require__(14), __webpack_require__(12), __webpack_require__(13), __webpack_require__(4), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module, exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod, mod.exports);
	        global.oauth2 = mod.exports;
	    }
	})(this, function (module, exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

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

	    var TOKEN_KEY = 'relayr_access_token';

	    var Oauth2 = function () {
	        function Oauth2(options) {
	            _classCallCheck(this, Oauth2);

	            this.uri = options.uri || 'api.relayr.io';
	            this.appId = options.appId;
	            this.redirectURI = options.redirectURI;
	            this.shouldPersist = options.persist || false;
	            this.protocol = options.protocol || 'https://';
	        }

	        _createClass(Oauth2, [{
	            key: 'login',
	            value: function login(optUser, ctx) {

	                if (!this.redirectURI) {
	                    throw Error('OAuth2 a valid redirect uri must be provided on login');
	                } else if (!this.appId) {
	                    throw Error('OAuth2 a valid app ID must be provided on login');
	                }

	                var storedToken = localStorage.getItem(TOKEN_KEY);

	                if (this.shouldPersist && storedToken) {
	                    this.token = storedToken;
	                    return;
	                }
	                try {
	                    if (this._parseToken(window.location.href)) return;
	                } catch (e) {}

	                var authURL = {
	                    client_id: this.appId,
	                    redirect_uri: this.redirectURI,
	                    scope: 'access-own-user-info+configure-devices'
	                };

	                var uri = '' + this.protocol + this.uri + '/oauth2/auth?client_id=' + this.appId + '&redirect_uri=' + this.redirectURI + '&response_type=token&scope=access-own-user-info+configure-devices';

	                this._loginRedirect(uri);
	            }
	        }, {
	            key: '_loginRedirect',
	            value: function _loginRedirect(uri) {
	                window.location.assign(uri);
	            }
	        }, {
	            key: '_parseToken',
	            value: function _parseToken(tokenURL) {
	                var parts = tokenURL.split('#');

	                if (parts[0] && parts[0].length === 0 || parts[1] && parts[1].length === 0) {
	                    throw Error('The provided URL is not correctly formatted');
	                }

	                var queryParams = parts[1].split('&');

	                var authParams = queryParams.reduce(function (accumulator, pair) {
	                    var tuple = pair.split('=');
	                    accumulator[tuple[0]] = tuple[1];
	                    return accumulator;
	                }, {});

	                if (!authParams.token_type) {
	                    throw Error('The provided URL does not contain a access token');
	                }

	                this.token = authParams.token_type + ' ' + authParams.access_token;

	                this.setToken(this.token);
	                return this.token;
	            }
	        }, {
	            key: 'setToken',
	            value: function setToken(token) {
	                localStorage.setItem(TOKEN_KEY, this.token);
	            }
	        }, {
	            key: 'logout',
	            value: function logout() {
	                localStorage.removeItem(TOKEN_KEY);
	            }
	        }]);

	        return Oauth2;
	    }();

	    exports.default = Oauth2;
	    module.exports = exports['default'];
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(4), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.ajax = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

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

	    var instance = null;

	    var Ajax = function () {
	        function Ajax(options) {
	            _classCallCheck(this, Ajax);

	            //set options using method below
	            this.options = options;
	        }

	        _createClass(Ajax, [{
	            key: 'get',
	            value: function get(url) {
	                var _this = this;

	                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	                    contentType: 'application/json'
	                };

	                if (!(url.charAt(0) === '/')) {
	                    throw new Error('Please provide a url with a leading /');
	                }

	                if (!url) {
	                    throw new Error('Please provide atleast a url');
	                }
	                if (typeof url !== 'string') {
	                    throw new Error('Please provide a string url');
	                }
	                url += this._serializeQueryStr(opts.queryObj);

	                return new Promise(function (resolve, reject) {
	                    var xhrObject = _this._xhrRequest({
	                        type: 'GET',
	                        url: url,
	                        isObject: opts.raw || true,
	                        contentType: opts.contentType
	                    }).then(function (result) {
	                        resolve(result);
	                    }).catch(function (xhrObject) {
	                        reject(xhrObject);
	                    });
	                });
	            }
	        }, {
	            key: 'post',
	            value: function post(url, body) {
	                var _this2 = this;

	                var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
	                    contentType: 'application/json',
	                    raw: true
	                };

	                if (!url.charAt(0) === '/') {
	                    throw new Error('Please provide a url with a leading /');
	                }
	                if (!url) throw new Error('Please provide atleast a url');
	                if (typeof url !== 'string') throw new Error('Please provide a string url');

	                if (opts.raw === false) opts.raw = false;
	                if (opts.raw === true) opts.raw = true;
	                return new Promise(function (resolve, reject) {
	                    var xhrObject = _this2._xhrRequest({
	                        type: 'POST',
	                        url: url,
	                        body: body,
	                        isObject: opts.raw,
	                        contentType: opts.contentType
	                    }).then(function (result) {
	                        resolve(result);
	                    }).catch(function (xhrObject) {
	                        reject(xhrObject);
	                    });
	                });
	            }
	        }, {
	            key: 'patch',
	            value: function patch(url, body) {
	                var _this3 = this;

	                var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
	                    contentType: 'application/json'
	                };

	                if (!url.charAt(0) === '/') {
	                    throw new Error('Please provide a url with a leading /');
	                }
	                if (!url) throw new Error('Please provide atleast a url');
	                if (typeof url !== 'string') throw new Error('Please provide a string url');

	                return new Promise(function (resolve, reject) {
	                    var xhrObject = _this3._xhrRequest({
	                        type: 'PATCH',
	                        url: url,
	                        body: body,
	                        isObject: opts.raw || true,
	                        contentType: opts.contentType
	                    }).then(function (result) {
	                        resolve(result);
	                    }).catch(function (xhrObject) {
	                        reject(xhrObject);
	                    });
	                });
	            }
	        }, {
	            key: 'delete',
	            value: function _delete(url) {
	                var _this4 = this;

	                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	                    contentType: 'application/json'
	                };

	                if (!url.charAt(0) === '/') {
	                    throw new Error('Please provide a url with a leading /');
	                }
	                if (!url) throw new Error('Please provide atleast a url');
	                if (typeof url !== 'string') throw new Error('Please provide a string url');

	                return new Promise(function (resolve, reject) {
	                    var xhrObject = _this4._xhrRequest({
	                        type: 'DELETE',
	                        url: url,
	                        contentType: opts.contentType
	                    }).then(function (result) {
	                        resolve(result);
	                    }).catch(function (xhrObject) {
	                        reject(xhrObject);
	                    });
	                });
	            }
	        }, {
	            key: '_serializeQueryStr',
	            value: function _serializeQueryStr(obj) {
	                if (!obj || Object.keys(obj).length === 0) {
	                    return '';
	                }

	                var queries = Object.keys(obj).map(function (key) {
	                    if (!obj[key] && typeof obj[key] !== 'number') {
	                        return null;
	                    }
	                    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
	                }).filter(function (item) {
	                    return !!item;
	                });

	                if (queries.length === 0) {
	                    return '';
	                }
	                return '?' + queries.join('&');
	            }
	        }, {
	            key: '_xhrRequest',
	            value: function _xhrRequest(options) {

	                var xhrObject = void 0;

	                xhrObject = new XMLHttpRequest();

	                xhrObject.open(options.type, '' + this.options.protocol + this.options.uri + options.url, true);

	                xhrObject.setRequestHeader('Authorization', this.options.token);
	                xhrObject.setRequestHeader('Content-Type', options.contentType);

	                return new Promise(function (resolve, reject) {

	                    xhrObject.onreadystatechange = function () {
	                        if (xhrObject.readyState === 4) {
	                            if (xhrObject.status > 199 && xhrObject.status < 299) {
	                                //2xx success
	                                if (options.isObject && xhrObject.responseText.trim() !== '') {
	                                    resolve(JSON.parse(xhrObject.responseText));
	                                } else {
	                                    resolve(xhrObject.responseText);
	                                }
	                            } else if (xhrObject.status > 399 && xhrObject.status < 499) {
	                                //4xx client error
	                                console.log('there seems to be a problem on the client side');
	                                reject(xhrObject);
	                            } else if (xhrObject.status > 499) {
	                                //5xx server error
	                                console.log('there seems to be a problem on the server side');
	                                reject(xhrObject);
	                            }
	                        }
	                    };

	                    if (options.body) {
	                        xhrObject.send(JSON.stringify(options.body));
	                    } else {
	                        xhrObject.send();
	                    }
	                });
	            }
	        }, {
	            key: 'options',
	            set: function set(options) {
	                this._options = {
	                    tokenType: 'Bearer',
	                    token: 'notoken',
	                    uri: 'api.relayr.io',
	                    protocol: 'https://'
	                };
	                Object.assign(this._options, options);
	            },
	            get: function get() {
	                return this._options;
	            }
	        }]);

	        return Ajax;
	    }();

	    var ajax = exports.ajax = new Ajax({});

	    exports.default = Ajax;
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(4), __webpack_require__(6), __webpack_require__(7), __webpack_require__(10), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

	    var Device = function () {
	        function Device() {
	            var rawDevice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	            var config = arguments[1];

	            _classCallCheck(this, Device);

	            this.rawDevice = rawDevice;
	            this.config = config;

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

	                    _mqtt.mqtt.subscribe(newChannelCredentials.credentials.topic, connection.event);
	                    connection.unsubscribe = function () {
	                        _mqtt.mqtt.unsubscribe(newChannelCredentials.credentials.topic, connection.event);
	                    };
	                    return _mqtt.mqtt.connect(options);
	                };

	                return new Promise(function (resolve, reject) {
	                    getChannel.then(subscribeMqtt).then(function () {
	                        resolve(connection);
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module, exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod, mod.exports);
	        global.connection = mod.exports;
	    }
	})(this, function (module, exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    exports.default = connection;
	    function connection() {
	        var self = this;
	        this.buffer = [];
	        this.event = function (data) {
	            if (self._dataSubscriber) {
	                self._dataSubscriber(data);
	            } else {
	                self.buffer.push(data);
	            }
	        };

	        this._flush = function () {
	            if (self._dataSubscriber) {
	                for (var i = self.buffer.length - 1; i >= 0; i--) {
	                    self._dataSubscriber(self.buffer[i]) && self.buffer.splice(i, 1);
	                }
	            }
	            return;
	        };

	        this.unsubscribe = function () {};

	        this.on = function (event, _dataSubscriber) {
	            switch (event) {
	                case 'data':
	                    self._dataSubscriber = _dataSubscriber;
	                    this._flush();
	                    break;
	                case 'error':
	                    break;
	                case 'connectionLost':
	                    break;
	                case 'reconnecting':
	                    break;
	            }
	        };
	    }
	    module.exports = exports['default'];
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(4), __webpack_require__(8), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module, exports, require('../../tools/ajax.js'), require('./sampleCalculator'), require('./DeviceHistoryPoints'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod, mod.exports, global.ajax, global.sampleCalculator, global.DeviceHistoryPoints);
	        global.DeviceHistory = mod.exports;
	    }
	})(this, function (module, exports, _ajax, _sampleCalculator, _DeviceHistoryPoints) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _ajax2 = _interopRequireDefault(_ajax);

	    var _sampleCalculator2 = _interopRequireDefault(_sampleCalculator);

	    var _DeviceHistoryPoints2 = _interopRequireDefault(_DeviceHistoryPoints);

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

	    var DeviceHistory = function () {
	        function DeviceHistory() {
	            var rawDevice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	            var config = arguments[1];

	            _classCallCheck(this, DeviceHistory);

	            this.id = rawDevice.id;
	            this.ajax = new _ajax2.default({
	                uri: config.ajax.dataUri,
	                token: _ajax.ajax.options.token
	            });
	        }

	        _createClass(DeviceHistory, [{
	            key: 'getHistoricalData',
	            value: function getHistoricalData() {
	                var _this = this;

	                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	                var _opts$limit = opts.limit,
	                    limit = _opts$limit === undefined ? 1000 : _opts$limit,
	                    _opts$offset = opts.offset,
	                    offset = _opts$offset === undefined ? 0 : _opts$offset,
	                    end = opts.end,
	                    start = opts.start,
	                    sample = opts.sample,
	                    periode = opts.periode,
	                    meaning = opts.meaning,
	                    path = opts.path;

	                var queryParams = {};

	                if (periode && periode.length > 0) {
	                    var sampleObj = (0, _sampleCalculator2.default)(periode);
	                    sample = sampleObj.sampleSize;
	                    start = sampleObj.start;
	                    end = sampleObj.end;
	                }

	                if (sample !== undefined) {
	                    queryParams.sample = sample;
	                }

	                if (end) {
	                    queryParams.end = end.getTime();
	                }
	                if (start) {
	                    queryParams.start = start.getTime();
	                }
	                if (meaning) {
	                    queryParams.meaning = meaning;
	                }
	                if (path) {
	                    queryParams.path = path;
	                }

	                queryParams.offset = offset;
	                queryParams.limit = limit;

	                return new Promise(function (resolve, reject) {
	                    _this.ajax.get('/history/devices/' + _this.id, { queryObj: queryParams }).then(function (response) {
	                        resolve({
	                            points: new _DeviceHistoryPoints2.default(response.results),
	                            response: response
	                        });
	                    }, reject);
	                });
	            }
	        }, {
	            key: 'getAllHistoricalData',
	            value: function getAllHistoricalData() {
	                var _this2 = this;

	                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	                var points = void 0;

	                var onDataReceived = opts.onDataReceived,
	                    periode = opts.periode;

	                onDataReceived = onDataReceived || function () {};

	                var hasMore = function hasMore(data) {
	                    return data.count > data.limit && data.count - data.offset > data.limit;
	                };

	                var handleResponse = function handleResponse(data, resolve, reject) {
	                    if (data.points && !points) {
	                        points = data.points;
	                    } else if (data.response && data.response.results) {
	                        points.addPoints(data.response.results);
	                    }

	                    onDataReceived(points);

	                    if (hasMore(data.response)) {
	                        getData({
	                            offset: data.response.offset + data.response.limit
	                        }, resolve, reject);
	                    } else {
	                        resolve({
	                            points: points
	                        });
	                    }
	                };

	                var getData = function getData(opts, resolve, reject) {
	                    _this2.getHistoricalData(opts).then(function (data) {
	                        handleResponse(data, resolve, reject);
	                    }, reject);
	                };

	                return new Promise(function (resolve, reject) {
	                    getData(opts, resolve, reject);
	                });
	            }
	        }]);

	        return DeviceHistory;
	    }();

	    exports.default = DeviceHistory;
	    ;
	    module.exports = exports['default'];
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module, exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod, mod.exports);
	        global.sampleCalculator = mod.exports;
	    }
	})(this, function (module, exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    var oneHourMs = 1000 * 3600;
	    var daysInMonth = function daysInMonth() {
	        var d = new Date();
	        d.setDate(0);
	        return d.getDate();
	    };

	    function calculateTimeframe(timeframeStr) {
	        var obj = {
	            end: new Date()
	        };
	        var startDate = new Date();
	        var sampleSize = null;
	        switch (timeframeStr) {
	            case '1h':
	                startDate = new Date(obj.end.getTime() - oneHourMs);
	                sampleSize = '1m';
	                break;
	            case '5h':
	                startDate = new Date(obj.end.getTime() - oneHourMs * 5);
	                sampleSize = '1m';
	                break;
	            case '1d':
	                startDate = new Date(obj.end.getTime() - oneHourMs * 24);
	                sampleSize = '1m';
	                break;
	            case '1w':
	                startDate = new Date(obj.end.getTime() - oneHourMs * 24 * 7);
	                sampleSize = '1h';
	                break;
	            case '1m':
	                startDate = new Date(obj.end.getTime() - oneHourMs * 24 * daysInMonth());
	                sampleSize = '1h';
	                break;
	            case '1y':
	                startDate.setFullYear(obj.end.getFullYear() - 1);
	                sampleSize = '1h';
	                break;
	        };
	        obj.start = startDate;
	        obj.sampleSize = sampleSize;

	        return obj;
	    };

	    exports.default = calculateTimeframe;
	    module.exports = exports['default'];
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module, exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod, mod.exports);
	        global.DeviceHistoryPoints = mod.exports;
	    }
	})(this, function (module, exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

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

	    var DeviceHistoryPoints = function () {
	        function DeviceHistoryPoints(deviceHistory) {
	            _classCallCheck(this, DeviceHistoryPoints);

	            if (!deviceHistory) {
	                return {};
	            }

	            this.devicesPoints = {};
	            this.addPoints(deviceHistory);
	        }

	        _createClass(DeviceHistoryPoints, [{
	            key: 'addPoints',
	            value: function addPoints(deviceHistory) {
	                var _this = this;

	                deviceHistory.forEach(function (res) {
	                    var key = _this._getKey(res.meaning, res.path);
	                    if (_this.devicesPoints[key]) {
	                        _this.devicesPoints[key].points = _this.devicesPoints[key].points.concat(res.points);
	                    } else {
	                        _this.devicesPoints[key] = Object.assign({ id: res.deviceId }, res);
	                        delete _this.devicesPoints[key].deviceId;
	                    }
	                });
	            }
	        }, {
	            key: '_getKey',
	            value: function _getKey(meaning, path) {
	                if (!path || path === 'null') {
	                    return meaning;
	                }

	                if (!meaning || meaning === 'null') {
	                    return path;
	                }
	                return meaning + '-' + path;
	            }
	        }, {
	            key: 'get',
	            value: function get(meaning, path) {
	                return this.devicesPoints[this._getKey(meaning, path)];
	            }
	        }]);

	        return DeviceHistoryPoints;
	    }();

	    exports.default = DeviceHistoryPoints;
	    module.exports = exports['default'];
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(11)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(global,factory){if(true){!(__WEBPACK_AMD_DEFINE_ARRAY__ = [module,exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));}else if(typeof exports!=="undefined"){factory(module,exports);}else{var mod={exports:{}};factory(mod,mod.exports);global.mqttws31Min=mod.exports;}})(this,function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Paho=function Paho(){_classCallCheck(this,Paho);//var window = {};
	var _Paho={};_Paho.MQTT=function(global){// Private variables below, these are only visible inside the function closure
	// which is used to define the module.
	var version="@VERSION@";var buildLevel="@BUILDLEVEL@";/**
	             * Unique message type identifiers, with associated
	             * associated integer values.
	             * @private
	             */var MESSAGE_TYPE={CONNECT:1,CONNACK:2,PUBLISH:3,PUBACK:4,PUBREC:5,PUBREL:6,PUBCOMP:7,SUBSCRIBE:8,SUBACK:9,UNSUBSCRIBE:10,UNSUBACK:11,PINGREQ:12,PINGRESP:13,DISCONNECT:14};// Collection of utility methods used to simplify module code
	// and promote the DRY pattern.
	/**
	             * Validate an object's parameter names to ensure they
	             * match a list of expected variables name for this option
	             * type. Used to ensure option object passed into the API don't
	             * contain erroneous parameters.
	             * @param {Object} obj - User options object
	             * @param {Object} keys - valid keys and types that may exist in obj.
	             * @throws {Error} Invalid option parameter found.
	             * @private
	             */var validate=function validate(obj,keys){for(var key in obj){if(obj.hasOwnProperty(key)){if(keys.hasOwnProperty(key)){if(_typeof(obj[key])!==keys[key])throw new Error(format(ERROR.INVALID_TYPE,[_typeof(obj[key]),key]));}else{var errorStr="Unknown property, "+key+". Valid properties are:";for(var key in keys){if(keys.hasOwnProperty(key))errorStr=errorStr+" "+key;}throw new Error(errorStr);}}}};/**
	             * Return a new function which runs the user function bound
	             * to a fixed scope.
	             * @param {function} User function
	             * @param {object} Function scope
	             * @return {function} User function bound to another scope
	             * @private
	             */var scope=function scope(f,_scope){return function(){return f.apply(_scope,arguments);};};/**
	             * Unique message type identifiers, with associated
	             * associated integer values.
	             * @private
	             */var ERROR={OK:{code:0,text:"AMQJSC0000I OK."},CONNECT_TIMEOUT:{code:1,text:"AMQJSC0001E Connect timed out."},SUBSCRIBE_TIMEOUT:{code:2,text:"AMQJS0002E Subscribe timed out."},UNSUBSCRIBE_TIMEOUT:{code:3,text:"AMQJS0003E Unsubscribe timed out."},PING_TIMEOUT:{code:4,text:"AMQJS0004E Ping timed out."},INTERNAL_ERROR:{code:5,text:"AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"},CONNACK_RETURNCODE:{code:6,text:"AMQJS0006E Bad Connack return code:{0} {1}."},SOCKET_ERROR:{code:7,text:"AMQJS0007E Socket error:{0}."},SOCKET_CLOSE:{code:8,text:"AMQJS0008I Socket closed."},MALFORMED_UTF:{code:9,text:"AMQJS0009E Malformed UTF data:{0} {1} {2}."},UNSUPPORTED:{code:10,text:"AMQJS0010E {0} is not supported by this browser."},INVALID_STATE:{code:11,text:"AMQJS0011E Invalid state {0}."},INVALID_TYPE:{code:12,text:"AMQJS0012E Invalid type {0} for {1}."},INVALID_ARGUMENT:{code:13,text:"AMQJS0013E Invalid argument {0} for {1}."},UNSUPPORTED_OPERATION:{code:14,text:"AMQJS0014E Unsupported operation."},INVALID_STORED_DATA:{code:15,text:"AMQJS0015E Invalid data in local storage key={0} value={1}."},INVALID_MQTT_MESSAGE_TYPE:{code:16,text:"AMQJS0016E Invalid MQTT message type {0}."},MALFORMED_UNICODE:{code:17,text:"AMQJS0017E Malformed Unicode string:{0} {1}."}};/** CONNACK RC Meaning. */var CONNACK_RC={0:"Connection Accepted",1:"Connection Refused: unacceptable protocol version",2:"Connection Refused: identifier rejected",3:"Connection Refused: server unavailable",4:"Connection Refused: bad user name or password",5:"Connection Refused: not authorized"};/**
	             * Format an error message text.
	             * @private
	             * @param {error} ERROR.KEY value above.
	             * @param {substitutions} [array] substituted into the text.
	             * @return the text with the substitutions made.
	             */var format=function format(error,substitutions){var text=error.text;if(substitutions){var field,start;for(var i=0;i<substitutions.length;i++){field="{"+i+"}";start=text.indexOf(field);if(start>0){var part1=text.substring(0,start);var part2=text.substring(start+field.length);text=part1+substitutions[i]+part2;}}}return text;};//MQTT protocol and version          6    M    Q    I    s    d    p    3
	var MqttProtoIdentifierv3=[0x00,0x06,0x4d,0x51,0x49,0x73,0x64,0x70,0x03];//MQTT proto/version for 311         4    M    Q    T    T    4
	var MqttProtoIdentifierv4=[0x00,0x04,0x4d,0x51,0x54,0x54,0x04];/**
	             * Construct an MQTT wire protocol message.
	             * @param type MQTT packet type.
	             * @param options optional wire message attributes.
	             *
	             * Optional properties
	             *
	             * messageIdentifier: message ID in the range [0..65535]
	             * payloadMessage:	Application Message - PUBLISH only
	             * connectStrings:	array of 0 or more Strings to be put into the CONNECT payload
	             * topics:			array of strings (SUBSCRIBE, UNSUBSCRIBE)
	             * requestQoS:		array of QoS values [0..2]
	             *
	             * "Flag" properties
	             * cleanSession:	true if present / false if absent (CONNECT)
	             * willMessage:  	true if present / false if absent (CONNECT)
	             * isRetained:		true if present / false if absent (CONNECT)
	             * userName:		true if present / false if absent (CONNECT)
	             * password:		true if present / false if absent (CONNECT)
	             * keepAliveInterval:	integer [0..65535]  (CONNECT)
	             *
	             * @private
	             * @ignore
	             */var WireMessage=function WireMessage(type,options){this.type=type;for(var name in options){if(options.hasOwnProperty(name)){this[name]=options[name];}}};WireMessage.prototype.encode=function(){// Compute the first byte of the fixed header
	var first=(this.type&0x0f)<<4;/*
	                 * Now calculate the length of the variable header + payload by adding up the lengths
	                 * of all the component parts
	                 */var remLength=0;var topicStrLength=new Array();var destinationNameLength=0;// if the message contains a messageIdentifier then we need two bytes for that
	if(this.messageIdentifier!=undefined)remLength+=2;switch(this.type){// If this a Connect then we need to include 12 bytes for its header
	case MESSAGE_TYPE.CONNECT:switch(this.mqttVersion){case 3:remLength+=MqttProtoIdentifierv3.length+3;break;case 4:remLength+=MqttProtoIdentifierv4.length+3;break;}remLength+=UTF8Length(this.clientId)+2;if(this.willMessage!=undefined){remLength+=UTF8Length(this.willMessage.destinationName)+2;// Will message is always a string, sent as UTF-8 characters with a preceding length.
	var willMessagePayloadBytes=this.willMessage.payloadBytes;if(!(willMessagePayloadBytes instanceof Uint8Array))willMessagePayloadBytes=new Uint8Array(payloadBytes);remLength+=willMessagePayloadBytes.byteLength+2;}if(this.userName!=undefined)remLength+=UTF8Length(this.userName)+2;if(this.password!=undefined)remLength+=UTF8Length(this.password)+2;break;// Subscribe, Unsubscribe can both contain topic strings
	case MESSAGE_TYPE.SUBSCRIBE:first|=0x02;// Qos = 1;
	for(var i=0;i<this.topics.length;i++){topicStrLength[i]=UTF8Length(this.topics[i]);remLength+=topicStrLength[i]+2;}remLength+=this.requestedQos.length;// 1 byte for each topic's Qos
	// QoS on Subscribe only
	break;case MESSAGE_TYPE.UNSUBSCRIBE:first|=0x02;// Qos = 1;
	for(var i=0;i<this.topics.length;i++){topicStrLength[i]=UTF8Length(this.topics[i]);remLength+=topicStrLength[i]+2;}break;case MESSAGE_TYPE.PUBREL:first|=0x02;// Qos = 1;
	break;case MESSAGE_TYPE.PUBLISH:if(this.payloadMessage.duplicate)first|=0x08;first=first|=this.payloadMessage.qos<<1;if(this.payloadMessage.retained)first|=0x01;destinationNameLength=UTF8Length(this.payloadMessage.destinationName);remLength+=destinationNameLength+2;var payloadBytes=this.payloadMessage.payloadBytes;remLength+=payloadBytes.byteLength;if(payloadBytes instanceof ArrayBuffer)payloadBytes=new Uint8Array(payloadBytes);else if(!(payloadBytes instanceof Uint8Array))payloadBytes=new Uint8Array(payloadBytes.buffer);break;case MESSAGE_TYPE.DISCONNECT:break;default:;}// Now we can allocate a buffer for the message
	var mbi=encodeMBI(remLength);// Convert the length to MQTT MBI format
	var pos=mbi.length+1;// Offset of start of variable header
	var buffer=new ArrayBuffer(remLength+pos);var byteStream=new Uint8Array(buffer);// view it as a sequence of bytes
	//Write the fixed header into the buffer
	byteStream[0]=first;byteStream.set(mbi,1);// If this is a PUBLISH then the variable header starts with a topic
	if(this.type==MESSAGE_TYPE.PUBLISH)pos=writeString(this.payloadMessage.destinationName,destinationNameLength,byteStream,pos);// If this is a CONNECT then the variable header contains the protocol name/version, flags and keepalive time
	else if(this.type==MESSAGE_TYPE.CONNECT){switch(this.mqttVersion){case 3:byteStream.set(MqttProtoIdentifierv3,pos);pos+=MqttProtoIdentifierv3.length;break;case 4:byteStream.set(MqttProtoIdentifierv4,pos);pos+=MqttProtoIdentifierv4.length;break;}var connectFlags=0;if(this.cleanSession)connectFlags=0x02;if(this.willMessage!=undefined){connectFlags|=0x04;connectFlags|=this.willMessage.qos<<3;if(this.willMessage.retained){connectFlags|=0x20;}}if(this.userName!=undefined)connectFlags|=0x80;if(this.password!=undefined)connectFlags|=0x40;byteStream[pos++]=connectFlags;pos=writeUint16(this.keepAliveInterval,byteStream,pos);}// Output the messageIdentifier - if there is one
	if(this.messageIdentifier!=undefined)pos=writeUint16(this.messageIdentifier,byteStream,pos);switch(this.type){case MESSAGE_TYPE.CONNECT:pos=writeString(this.clientId,UTF8Length(this.clientId),byteStream,pos);if(this.willMessage!=undefined){pos=writeString(this.willMessage.destinationName,UTF8Length(this.willMessage.destinationName),byteStream,pos);pos=writeUint16(willMessagePayloadBytes.byteLength,byteStream,pos);byteStream.set(willMessagePayloadBytes,pos);pos+=willMessagePayloadBytes.byteLength;}if(this.userName!=undefined)pos=writeString(this.userName,UTF8Length(this.userName),byteStream,pos);if(this.password!=undefined)pos=writeString(this.password,UTF8Length(this.password),byteStream,pos);break;case MESSAGE_TYPE.PUBLISH:// PUBLISH has a text or binary payload, if text do not add a 2 byte length field, just the UTF characters.
	byteStream.set(payloadBytes,pos);break;//    	    case MESSAGE_TYPE.PUBREC:
	//    	    case MESSAGE_TYPE.PUBREL:
	//    	    case MESSAGE_TYPE.PUBCOMP:
	//    	    	break;
	case MESSAGE_TYPE.SUBSCRIBE:// SUBSCRIBE has a list of topic strings and request QoS
	for(var i=0;i<this.topics.length;i++){pos=writeString(this.topics[i],topicStrLength[i],byteStream,pos);byteStream[pos++]=this.requestedQos[i];}break;case MESSAGE_TYPE.UNSUBSCRIBE:// UNSUBSCRIBE has a list of topic strings
	for(var i=0;i<this.topics.length;i++){pos=writeString(this.topics[i],topicStrLength[i],byteStream,pos);}break;default:// Do nothing.
	}return buffer;};function decodeMessage(input,pos){var startingPos=pos;var first=input[pos];var type=first>>4;var messageInfo=first&=0x0f;pos+=1;// Decode the remaining length (MBI format)
	var digit;var remLength=0;var multiplier=1;do{if(pos==input.length){return[null,startingPos];}digit=input[pos++];remLength+=(digit&0x7F)*multiplier;multiplier*=128;}while((digit&0x80)!=0);var endPos=pos+remLength;if(endPos>input.length){return[null,startingPos];}var wireMessage=new WireMessage(type);switch(type){case MESSAGE_TYPE.CONNACK:var connectAcknowledgeFlags=input[pos++];if(connectAcknowledgeFlags&0x01)wireMessage.sessionPresent=true;wireMessage.returnCode=input[pos++];break;case MESSAGE_TYPE.PUBLISH:var qos=messageInfo>>1&0x03;var len=readUint16(input,pos);pos+=2;var topicName=parseUTF8(input,pos,len);pos+=len;// If QoS 1 or 2 there will be a messageIdentifier
	if(qos>0){wireMessage.messageIdentifier=readUint16(input,pos);pos+=2;}var message=new _Paho.MQTT.Message(input.subarray(pos,endPos));if((messageInfo&0x01)==0x01)message.retained=true;if((messageInfo&0x08)==0x08)message.duplicate=true;message.qos=qos;message.destinationName=topicName;wireMessage.payloadMessage=message;break;case MESSAGE_TYPE.PUBACK:case MESSAGE_TYPE.PUBREC:case MESSAGE_TYPE.PUBREL:case MESSAGE_TYPE.PUBCOMP:case MESSAGE_TYPE.UNSUBACK:wireMessage.messageIdentifier=readUint16(input,pos);break;case MESSAGE_TYPE.SUBACK:wireMessage.messageIdentifier=readUint16(input,pos);pos+=2;wireMessage.returnCode=input.subarray(pos,endPos);break;default:;}return[wireMessage,endPos];}function writeUint16(input,buffer,offset){buffer[offset++]=input>>8;//MSB
	buffer[offset++]=input%256;//LSB
	return offset;}function writeString(input,utf8Length,buffer,offset){offset=writeUint16(utf8Length,buffer,offset);stringToUTF8(input,buffer,offset);return offset+utf8Length;}function readUint16(buffer,offset){return 256*buffer[offset]+buffer[offset+1];}/**
	             * Encodes an MQTT Multi-Byte Integer
	             * @private
	             */function encodeMBI(number){var output=new Array(1);var numBytes=0;do{var digit=number%128;number=number>>7;if(number>0){digit|=0x80;}output[numBytes++]=digit;}while(number>0&&numBytes<4);return output;}/**
	             * Takes a String and calculates its length in bytes when encoded in UTF8.
	             * @private
	             */function UTF8Length(input){var output=0;for(var i=0;i<input.length;i++){var charCode=input.charCodeAt(i);if(charCode>0x7FF){// Surrogate pair means its a 4 byte character
	if(0xD800<=charCode&&charCode<=0xDBFF){i++;output++;}output+=3;}else if(charCode>0x7F)output+=2;else output++;}return output;}/**
	             * Takes a String and writes it into an array as UTF8 encoded bytes.
	             * @private
	             */function stringToUTF8(input,output,start){var pos=start;for(var i=0;i<input.length;i++){var charCode=input.charCodeAt(i);// Check for a surrogate pair.
	if(0xD800<=charCode&&charCode<=0xDBFF){var lowCharCode=input.charCodeAt(++i);if(isNaN(lowCharCode)){throw new Error(format(ERROR.MALFORMED_UNICODE,[charCode,lowCharCode]));}charCode=(charCode-0xD800<<10)+(lowCharCode-0xDC00)+0x10000;}if(charCode<=0x7F){output[pos++]=charCode;}else if(charCode<=0x7FF){output[pos++]=charCode>>6&0x1F|0xC0;output[pos++]=charCode&0x3F|0x80;}else if(charCode<=0xFFFF){output[pos++]=charCode>>12&0x0F|0xE0;output[pos++]=charCode>>6&0x3F|0x80;output[pos++]=charCode&0x3F|0x80;}else{output[pos++]=charCode>>18&0x07|0xF0;output[pos++]=charCode>>12&0x3F|0x80;output[pos++]=charCode>>6&0x3F|0x80;output[pos++]=charCode&0x3F|0x80;};}return output;}function parseUTF8(input,offset,length){var output="";var utf16;var pos=offset;while(pos<offset+length){var byte1=input[pos++];if(byte1<128)utf16=byte1;else{var byte2=input[pos++]-128;if(byte2<0)throw new Error(format(ERROR.MALFORMED_UTF,[byte1.toString(16),byte2.toString(16),""]));if(byte1<0xE0)// 2 byte character
	utf16=64*(byte1-0xC0)+byte2;else{var byte3=input[pos++]-128;if(byte3<0)throw new Error(format(ERROR.MALFORMED_UTF,[byte1.toString(16),byte2.toString(16),byte3.toString(16)]));if(byte1<0xF0)// 3 byte character
	utf16=4096*(byte1-0xE0)+64*byte2+byte3;else{var byte4=input[pos++]-128;if(byte4<0)throw new Error(format(ERROR.MALFORMED_UTF,[byte1.toString(16),byte2.toString(16),byte3.toString(16),byte4.toString(16)]));if(byte1<0xF8)// 4 byte character
	utf16=262144*(byte1-0xF0)+4096*byte2+64*byte3+byte4;else// longer encodings are not supported
	throw new Error(format(ERROR.MALFORMED_UTF,[byte1.toString(16),byte2.toString(16),byte3.toString(16),byte4.toString(16)]));}}}if(utf16>0xFFFF)// 4 byte character - express as a surrogate pair
	{utf16-=0x10000;output+=String.fromCharCode(0xD800+(utf16>>10));// lead character
	utf16=0xDC00+(utf16&0x3FF);// trail character
	}output+=String.fromCharCode(utf16);}return output;}/**
	             * Repeat keepalive requests, monitor responses.
	             * @ignore
	             */var Pinger=function Pinger(client,window,keepAliveInterval){this._client=client;this._window=window;this._keepAliveInterval=keepAliveInterval*1000;this.isReset=false;var pingReq=new WireMessage(MESSAGE_TYPE.PINGREQ).encode();var doTimeout=function doTimeout(pinger){return function(){return doPing.apply(pinger);};};/** @ignore */var doPing=function doPing(){if(!this.isReset){this._client._trace("Pinger.doPing","Timed out");this._client._disconnected(ERROR.PING_TIMEOUT.code,format(ERROR.PING_TIMEOUT));}else{this.isReset=false;this._client._trace("Pinger.doPing","send PINGREQ");this._client.socket.send(pingReq);this.timeout=this._window.setTimeout(doTimeout(this),this._keepAliveInterval);}};this.reset=function(){this.isReset=true;this._window.clearTimeout(this.timeout);if(this._keepAliveInterval>0)this.timeout=setTimeout(doTimeout(this),this._keepAliveInterval);};this.cancel=function(){this._window.clearTimeout(this.timeout);};};/**
	             * Monitor request completion.
	             * @ignore
	             */var Timeout=function Timeout(client,window,timeoutSeconds,action,args){this._window=window;if(!timeoutSeconds)timeoutSeconds=30;var doTimeout=function doTimeout(action,client,args){return function(){return action.apply(client,args);};};this.timeout=setTimeout(doTimeout(action,client,args),timeoutSeconds*1000);this.cancel=function(){this._window.clearTimeout(this.timeout);};};/*
	             * Internal implementation of the Websockets MQTT V3.1 client.
	             *
	             * @name Paho.MQTT.ClientImpl @constructor
	             * @param {String} host the DNS nameof the webSocket host.
	             * @param {Number} port the port number for that host.
	             * @param {String} clientId the MQ client identifier.
	             */var ClientImpl=function ClientImpl(uri,host,port,path,clientId){// Check dependencies are satisfied in this browser.
	if(!("WebSocket"in global&&global["WebSocket"]!==null)){throw new Error(format(ERROR.UNSUPPORTED,["WebSocket"]));}if(!("localStorage"in global&&global["localStorage"]!==null)){throw new Error(format(ERROR.UNSUPPORTED,["localStorage"]));}if(!("ArrayBuffer"in global&&global["ArrayBuffer"]!==null)){throw new Error(format(ERROR.UNSUPPORTED,["ArrayBuffer"]));}this._trace("Paho.MQTT.Client",uri,host,port,path,clientId);this.host=host;this.port=port;this.path=path;this.uri=uri;this.clientId=clientId;// Local storagekeys are qualified with the following string.
	// The conditional inclusion of path in the key is for backward
	// compatibility to when the path was not configurable and assumed to
	// be /mqtt
	this._localKey=host+":"+port+(path!="/mqtt"?":"+path:"")+":"+clientId+":";// Create private instance-only message queue
	// Internal queue of messages to be sent, in sending order.
	this._msg_queue=[];// Messages we have sent and are expecting a response for, indexed by their respective message ids.
	this._sentMessages={};// Messages we have received and acknowleged and are expecting a confirm message for
	// indexed by their respective message ids.
	this._receivedMessages={};// Internal list of callbacks to be executed when messages
	// have been successfully sent over web socket, e.g. disconnect
	// when it doesn't have to wait for ACK, just message is dispatched.
	this._notify_msg_sent={};// Unique identifier for SEND messages, incrementing
	// counter as messages are sent.
	this._message_identifier=1;// Used to determine the transmission sequence of stored sent messages.
	this._sequence=0;// Load the local state, if any, from the saved version, only restore state relevant to this client.
	for(var key in localStorage){if(key.indexOf("Sent:"+this._localKey)==0||key.indexOf("Received:"+this._localKey)==0)this.restore(key);}};// Messaging Client public instance members.
	ClientImpl.prototype.host;ClientImpl.prototype.port;ClientImpl.prototype.path;ClientImpl.prototype.uri;ClientImpl.prototype.clientId;// Messaging Client private instance members.
	ClientImpl.prototype.socket;/* true once we have received an acknowledgement to a CONNECT packet. */ClientImpl.prototype.connected=false;/* The largest message identifier allowed, may not be larger than 2**16 but
	             * if set smaller reduces the maximum number of outbound messages allowed.
	             */ClientImpl.prototype.maxMessageIdentifier=65536;ClientImpl.prototype.connectOptions;ClientImpl.prototype.hostIndex;ClientImpl.prototype.onConnectionLost;ClientImpl.prototype.onMessageDelivered;ClientImpl.prototype.onMessageArrived;ClientImpl.prototype.traceFunction;ClientImpl.prototype._msg_queue=null;ClientImpl.prototype._connectTimeout;/* The sendPinger monitors how long we allow before we send data to prove to the server that we are alive. */ClientImpl.prototype.sendPinger=null;/* The receivePinger monitors how long we allow before we require evidence that the server is alive. */ClientImpl.prototype.receivePinger=null;ClientImpl.prototype.receiveBuffer=null;ClientImpl.prototype._traceBuffer=null;ClientImpl.prototype._MAX_TRACE_ENTRIES=100;ClientImpl.prototype.connect=function(connectOptions){var connectOptionsMasked=this._traceMask(connectOptions,"password");this._trace("Client.connect",connectOptionsMasked,this.socket,this.connected);if(this.connected)throw new Error(format(ERROR.INVALID_STATE,["already connected"]));if(this.socket)throw new Error(format(ERROR.INVALID_STATE,["already connected"]));this.connectOptions=connectOptions;if(connectOptions.uris){this.hostIndex=0;this._doConnect(connectOptions.uris[0]);}else{this._doConnect(this.uri);}};ClientImpl.prototype.subscribe=function(filter,subscribeOptions){this._trace("Client.subscribe",filter,subscribeOptions);if(!this.connected)throw new Error(format(ERROR.INVALID_STATE,["not connected"]));var wireMessage=new WireMessage(MESSAGE_TYPE.SUBSCRIBE);wireMessage.topics=[filter];if(subscribeOptions.qos!=undefined)wireMessage.requestedQos=[subscribeOptions.qos];else wireMessage.requestedQos=[0];if(subscribeOptions.onSuccess){wireMessage.onSuccess=function(grantedQos){subscribeOptions.onSuccess({invocationContext:subscribeOptions.invocationContext,grantedQos:grantedQos});};}if(subscribeOptions.onFailure){wireMessage.onFailure=function(errorCode){subscribeOptions.onFailure({invocationContext:subscribeOptions.invocationContext,errorCode:errorCode});};}if(subscribeOptions.timeout){wireMessage.timeOut=new Timeout(this,window,subscribeOptions.timeout,subscribeOptions.onFailure,[{invocationContext:subscribeOptions.invocationContext,errorCode:ERROR.SUBSCRIBE_TIMEOUT.code,errorMessage:format(ERROR.SUBSCRIBE_TIMEOUT)}]);}// All subscriptions return a SUBACK.
	this._requires_ack(wireMessage);this._schedule_message(wireMessage);};/** @ignore */ClientImpl.prototype.unsubscribe=function(filter,unsubscribeOptions){this._trace("Client.unsubscribe",filter,unsubscribeOptions);if(!this.connected)throw new Error(format(ERROR.INVALID_STATE,["not connected"]));var wireMessage=new WireMessage(MESSAGE_TYPE.UNSUBSCRIBE);wireMessage.topics=[filter];if(unsubscribeOptions.onSuccess){wireMessage.callback=function(){unsubscribeOptions.onSuccess({invocationContext:unsubscribeOptions.invocationContext});};}if(unsubscribeOptions.timeout){wireMessage.timeOut=new Timeout(this,window,unsubscribeOptions.timeout,unsubscribeOptions.onFailure,[{invocationContext:unsubscribeOptions.invocationContext,errorCode:ERROR.UNSUBSCRIBE_TIMEOUT.code,errorMessage:format(ERROR.UNSUBSCRIBE_TIMEOUT)}]);}// All unsubscribes return a SUBACK.
	this._requires_ack(wireMessage);this._schedule_message(wireMessage);};ClientImpl.prototype.send=function(message){this._trace("Client.send",message);if(!this.connected)throw new Error(format(ERROR.INVALID_STATE,["not connected"]));wireMessage=new WireMessage(MESSAGE_TYPE.PUBLISH);wireMessage.payloadMessage=message;if(message.qos>0)this._requires_ack(wireMessage);else if(this.onMessageDelivered)this._notify_msg_sent[wireMessage]=this.onMessageDelivered(wireMessage.payloadMessage);this._schedule_message(wireMessage);};ClientImpl.prototype.disconnect=function(){this._trace("Client.disconnect");if(!this.socket)throw new Error(format(ERROR.INVALID_STATE,["not connecting or connected"]));wireMessage=new WireMessage(MESSAGE_TYPE.DISCONNECT);// Run the disconnected call back as soon as the message has been sent,
	// in case of a failure later on in the disconnect processing.
	// as a consequence, the _disconected call back may be run several times.
	this._notify_msg_sent[wireMessage]=scope(this._disconnected,this);this._schedule_message(wireMessage);};ClientImpl.prototype.getTraceLog=function(){if(this._traceBuffer!==null){this._trace("Client.getTraceLog",new Date());this._trace("Client.getTraceLog in flight messages",this._sentMessages.length);for(var key in this._sentMessages){this._trace("_sentMessages ",key,this._sentMessages[key]);}for(var key in this._receivedMessages){this._trace("_receivedMessages ",key,this._receivedMessages[key]);}return this._traceBuffer;}};ClientImpl.prototype.startTrace=function(){if(this._traceBuffer===null){this._traceBuffer=[];}this._trace("Client.startTrace",new Date(),version);};ClientImpl.prototype.stopTrace=function(){delete this._traceBuffer;};ClientImpl.prototype._doConnect=function(wsurl){// When the socket is open, this client will send the CONNECT WireMessage using the saved parameters.
	if(this.connectOptions.useSSL){var uriParts=wsurl.split(":");uriParts[0]="wss";wsurl=uriParts.join(":");}this.connected=false;if(this.connectOptions.mqttVersion<4){this.socket=new WebSocket(wsurl,["mqttv3.1"]);}else{this.socket=new WebSocket(wsurl,["mqtt"]);}this.socket.binaryType='arraybuffer';this.socket.onopen=scope(this._on_socket_open,this);this.socket.onmessage=scope(this._on_socket_message,this);this.socket.onerror=scope(this._on_socket_error,this);this.socket.onclose=scope(this._on_socket_close,this);this.sendPinger=new Pinger(this,window,this.connectOptions.keepAliveInterval);this.receivePinger=new Pinger(this,window,this.connectOptions.keepAliveInterval);this._connectTimeout=new Timeout(this,window,this.connectOptions.timeout,this._disconnected,[ERROR.CONNECT_TIMEOUT.code,format(ERROR.CONNECT_TIMEOUT)]);};// Schedule a new message to be sent over the WebSockets
	// connection. CONNECT messages cause WebSocket connection
	// to be started. All other messages are queued internally
	// until this has happened. When WS connection starts, process
	// all outstanding messages.
	ClientImpl.prototype._schedule_message=function(message){this._msg_queue.push(message);// Process outstanding messages in the queue if we have an  open socket, and have received CONNACK.
	if(this.connected){this._process_queue();}};ClientImpl.prototype.store=function(prefix,wireMessage){var storedMessage={type:wireMessage.type,messageIdentifier:wireMessage.messageIdentifier,version:1};switch(wireMessage.type){case MESSAGE_TYPE.PUBLISH:if(wireMessage.pubRecReceived)storedMessage.pubRecReceived=true;// Convert the payload to a hex string.
	storedMessage.payloadMessage={};var hex="";var messageBytes=wireMessage.payloadMessage.payloadBytes;for(var i=0;i<messageBytes.length;i++){if(messageBytes[i]<=0xF)hex=hex+"0"+messageBytes[i].toString(16);else hex=hex+messageBytes[i].toString(16);}storedMessage.payloadMessage.payloadHex=hex;storedMessage.payloadMessage.qos=wireMessage.payloadMessage.qos;storedMessage.payloadMessage.destinationName=wireMessage.payloadMessage.destinationName;if(wireMessage.payloadMessage.duplicate)storedMessage.payloadMessage.duplicate=true;if(wireMessage.payloadMessage.retained)storedMessage.payloadMessage.retained=true;// Add a sequence number to sent messages.
	if(prefix.indexOf("Sent:")==0){if(wireMessage.sequence===undefined)wireMessage.sequence=++this._sequence;storedMessage.sequence=wireMessage.sequence;}break;default:throw Error(format(ERROR.INVALID_STORED_DATA,[key,storedMessage]));}localStorage.setItem(prefix+this._localKey+wireMessage.messageIdentifier,JSON.stringify(storedMessage));};ClientImpl.prototype.restore=function(key){var value=localStorage.getItem(key);var storedMessage=JSON.parse(value);var wireMessage=new WireMessage(storedMessage.type,storedMessage);switch(storedMessage.type){case MESSAGE_TYPE.PUBLISH:// Replace the payload message with a Message object.
	var hex=storedMessage.payloadMessage.payloadHex;var buffer=new ArrayBuffer(hex.length/2);var byteStream=new Uint8Array(buffer);var i=0;while(hex.length>=2){var x=parseInt(hex.substring(0,2),16);hex=hex.substring(2,hex.length);byteStream[i++]=x;}var payloadMessage=new _Paho.MQTT.Message(byteStream);payloadMessage.qos=storedMessage.payloadMessage.qos;payloadMessage.destinationName=storedMessage.payloadMessage.destinationName;if(storedMessage.payloadMessage.duplicate)payloadMessage.duplicate=true;if(storedMessage.payloadMessage.retained)payloadMessage.retained=true;wireMessage.payloadMessage=payloadMessage;break;default:throw Error(format(ERROR.INVALID_STORED_DATA,[key,value]));}if(key.indexOf("Sent:"+this._localKey)==0){wireMessage.payloadMessage.duplicate=true;this._sentMessages[wireMessage.messageIdentifier]=wireMessage;}else if(key.indexOf("Received:"+this._localKey)==0){this._receivedMessages[wireMessage.messageIdentifier]=wireMessage;}};ClientImpl.prototype._process_queue=function(){var message=null;// Process messages in order they were added
	var fifo=this._msg_queue.reverse();// Send all queued messages down socket connection
	while(message=fifo.pop()){this._socket_send(message);// Notify listeners that message was successfully sent
	if(this._notify_msg_sent[message]){this._notify_msg_sent[message]();delete this._notify_msg_sent[message];}}};/**
	             * Expect an ACK response for this message. Add message to the set of in progress
	             * messages and set an unused identifier in this message.
	             * @ignore
	             */ClientImpl.prototype._requires_ack=function(wireMessage){var messageCount=Object.keys(this._sentMessages).length;if(messageCount>this.maxMessageIdentifier)throw Error("Too many messages:"+messageCount);while(this._sentMessages[this._message_identifier]!==undefined){this._message_identifier++;}wireMessage.messageIdentifier=this._message_identifier;this._sentMessages[wireMessage.messageIdentifier]=wireMessage;if(wireMessage.type===MESSAGE_TYPE.PUBLISH){this.store("Sent:",wireMessage);}if(this._message_identifier===this.maxMessageIdentifier){this._message_identifier=1;}};/**
	             * Called when the underlying websocket has been opened.
	             * @ignore
	             */ClientImpl.prototype._on_socket_open=function(){// Create the CONNECT message object.
	var wireMessage=new WireMessage(MESSAGE_TYPE.CONNECT,this.connectOptions);wireMessage.clientId=this.clientId;this._socket_send(wireMessage);};/**
	             * Called when the underlying websocket has received a complete packet.
	             * @ignore
	             */ClientImpl.prototype._on_socket_message=function(event){this._trace("Client._on_socket_message",event.data);// Reset the receive ping timer, we now have evidence the server is alive.
	this.receivePinger.reset();var messages=this._deframeMessages(event.data);for(var i=0;i<messages.length;i+=1){this._handleMessage(messages[i]);}};ClientImpl.prototype._deframeMessages=function(data){var byteArray=new Uint8Array(data);if(this.receiveBuffer){var newData=new Uint8Array(this.receiveBuffer.length+byteArray.length);newData.set(this.receiveBuffer);newData.set(byteArray,this.receiveBuffer.length);byteArray=newData;delete this.receiveBuffer;}try{var offset=0;var messages=[];while(offset<byteArray.length){var result=decodeMessage(byteArray,offset);var wireMessage=result[0];offset=result[1];if(wireMessage!==null){messages.push(wireMessage);}else{break;}}if(offset<byteArray.length){this.receiveBuffer=byteArray.subarray(offset);}}catch(error){this._disconnected(ERROR.INTERNAL_ERROR.code,format(ERROR.INTERNAL_ERROR,[error.message,error.stack.toString()]));return;}return messages;};ClientImpl.prototype._handleMessage=function(wireMessage){this._trace("Client._handleMessage",wireMessage);switch(wireMessage.type){case MESSAGE_TYPE.CONNACK:this._connectTimeout.cancel();// If we have started using clean session then clear up the local state.
	if(this.connectOptions.cleanSession){for(var key in this._sentMessages){var sentMessage=this._sentMessages[key];localStorage.removeItem("Sent:"+this._localKey+sentMessage.messageIdentifier);}this._sentMessages={};for(var key in this._receivedMessages){var receivedMessage=this._receivedMessages[key];localStorage.removeItem("Received:"+this._localKey+receivedMessage.messageIdentifier);}this._receivedMessages={};}// Client connected and ready for business.
	if(wireMessage.returnCode===0){this.connected=true;// Jump to the end of the list of uris and stop looking for a good host.
	if(this.connectOptions.uris)this.hostIndex=this.connectOptions.uris.length;}else{this._disconnected(ERROR.CONNACK_RETURNCODE.code,format(ERROR.CONNACK_RETURNCODE,[wireMessage.returnCode,CONNACK_RC[wireMessage.returnCode]]));break;}// Resend messages.
	var sequencedMessages=new Array();for(var msgId in this._sentMessages){if(this._sentMessages.hasOwnProperty(msgId))sequencedMessages.push(this._sentMessages[msgId]);}// Sort sentMessages into the original sent order.
	var sequencedMessages=sequencedMessages.sort(function(a,b){return a.sequence-b.sequence;});for(var i=0,len=sequencedMessages.length;i<len;i++){var sentMessage=sequencedMessages[i];if(sentMessage.type==MESSAGE_TYPE.PUBLISH&&sentMessage.pubRecReceived){var pubRelMessage=new WireMessage(MESSAGE_TYPE.PUBREL,{messageIdentifier:sentMessage.messageIdentifier});this._schedule_message(pubRelMessage);}else{this._schedule_message(sentMessage);};}// Execute the connectOptions.onSuccess callback if there is one.
	if(this.connectOptions.onSuccess){this.connectOptions.onSuccess({invocationContext:this.connectOptions.invocationContext});}// Process all queued messages now that the connection is established.
	this._process_queue();break;case MESSAGE_TYPE.PUBLISH:this._receivePublish(wireMessage);break;case MESSAGE_TYPE.PUBACK:var sentMessage=this._sentMessages[wireMessage.messageIdentifier];// If this is a re flow of a PUBACK after we have restarted receivedMessage will not exist.
	if(sentMessage){delete this._sentMessages[wireMessage.messageIdentifier];localStorage.removeItem("Sent:"+this._localKey+wireMessage.messageIdentifier);if(this.onMessageDelivered)this.onMessageDelivered(sentMessage.payloadMessage);}break;case MESSAGE_TYPE.PUBREC:var sentMessage=this._sentMessages[wireMessage.messageIdentifier];// If this is a re flow of a PUBREC after we have restarted receivedMessage will not exist.
	if(sentMessage){sentMessage.pubRecReceived=true;var pubRelMessage=new WireMessage(MESSAGE_TYPE.PUBREL,{messageIdentifier:wireMessage.messageIdentifier});this.store("Sent:",sentMessage);this._schedule_message(pubRelMessage);}break;case MESSAGE_TYPE.PUBREL:var receivedMessage=this._receivedMessages[wireMessage.messageIdentifier];localStorage.removeItem("Received:"+this._localKey+wireMessage.messageIdentifier);// If this is a re flow of a PUBREL after we have restarted receivedMessage will not exist.
	if(receivedMessage){this._receiveMessage(receivedMessage);delete this._receivedMessages[wireMessage.messageIdentifier];}// Always flow PubComp, we may have previously flowed PubComp but the server lost it and restarted.
	var pubCompMessage=new WireMessage(MESSAGE_TYPE.PUBCOMP,{messageIdentifier:wireMessage.messageIdentifier});this._schedule_message(pubCompMessage);break;case MESSAGE_TYPE.PUBCOMP:var sentMessage=this._sentMessages[wireMessage.messageIdentifier];delete this._sentMessages[wireMessage.messageIdentifier];localStorage.removeItem("Sent:"+this._localKey+wireMessage.messageIdentifier);if(this.onMessageDelivered)this.onMessageDelivered(sentMessage.payloadMessage);break;case MESSAGE_TYPE.SUBACK:var sentMessage=this._sentMessages[wireMessage.messageIdentifier];if(sentMessage){if(sentMessage.timeOut)sentMessage.timeOut.cancel();wireMessage.returnCode.indexOf=Array.prototype.indexOf;if(wireMessage.returnCode.indexOf(0x80)!==-1){if(sentMessage.onFailure){sentMessage.onFailure(wireMessage.returnCode);}}else if(sentMessage.onSuccess){sentMessage.onSuccess(wireMessage.returnCode);}delete this._sentMessages[wireMessage.messageIdentifier];}break;case MESSAGE_TYPE.UNSUBACK:var sentMessage=this._sentMessages[wireMessage.messageIdentifier];if(sentMessage){if(sentMessage.timeOut)sentMessage.timeOut.cancel();if(sentMessage.callback){sentMessage.callback();}delete this._sentMessages[wireMessage.messageIdentifier];}break;case MESSAGE_TYPE.PINGRESP:/* The sendPinger or receivePinger may have sent a ping, the receivePinger has already been reset. */this.sendPinger.reset();break;case MESSAGE_TYPE.DISCONNECT:// Clients do not expect to receive disconnect packets.
	this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code,format(ERROR.INVALID_MQTT_MESSAGE_TYPE,[wireMessage.type]));break;default:this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code,format(ERROR.INVALID_MQTT_MESSAGE_TYPE,[wireMessage.type]));};};/** @ignore */ClientImpl.prototype._on_socket_error=function(error){this._disconnected(ERROR.SOCKET_ERROR.code,format(ERROR.SOCKET_ERROR,[error.data]));};/** @ignore */ClientImpl.prototype._on_socket_close=function(){this._disconnected(ERROR.SOCKET_CLOSE.code,format(ERROR.SOCKET_CLOSE));};/** @ignore */ClientImpl.prototype._socket_send=function(wireMessage){if(wireMessage.type==1){var wireMessageMasked=this._traceMask(wireMessage,"password");this._trace("Client._socket_send",wireMessageMasked);}else this._trace("Client._socket_send",wireMessage);this.socket.send(wireMessage.encode());/* We have proved to the server we are alive. */this.sendPinger.reset();};/** @ignore */ClientImpl.prototype._receivePublish=function(wireMessage){switch(wireMessage.payloadMessage.qos){case"undefined":case 0:this._receiveMessage(wireMessage);break;case 1:var pubAckMessage=new WireMessage(MESSAGE_TYPE.PUBACK,{messageIdentifier:wireMessage.messageIdentifier});this._schedule_message(pubAckMessage);this._receiveMessage(wireMessage);break;case 2:this._receivedMessages[wireMessage.messageIdentifier]=wireMessage;this.store("Received:",wireMessage);var pubRecMessage=new WireMessage(MESSAGE_TYPE.PUBREC,{messageIdentifier:wireMessage.messageIdentifier});this._schedule_message(pubRecMessage);break;default:throw Error("Invaild qos="+wireMmessage.payloadMessage.qos);};};/** @ignore */ClientImpl.prototype._receiveMessage=function(wireMessage){if(this.onMessageArrived){this.onMessageArrived(wireMessage.payloadMessage);}};/**
	             * Client has disconnected either at its own request or because the server
	             * or network disconnected it. Remove all non-durable state.
	             * @param {errorCode} [number] the error number.
	             * @param {errorText} [string] the error text.
	             * @ignore
	             */ClientImpl.prototype._disconnected=function(errorCode,errorText){this._trace("Client._disconnected",errorCode,errorText);this.sendPinger.cancel();this.receivePinger.cancel();if(this._connectTimeout)this._connectTimeout.cancel();// Clear message buffers.
	this._msg_queue=[];this._notify_msg_sent={};if(this.socket){// Cancel all socket callbacks so that they cannot be driven again by this socket.
	this.socket.onopen=null;this.socket.onmessage=null;this.socket.onerror=null;this.socket.onclose=null;if(this.socket.readyState===1)this.socket.close();delete this.socket;}if(this.connectOptions.uris&&this.hostIndex<this.connectOptions.uris.length-1){// Try the next host.
	this.hostIndex++;this._doConnect(this.connectOptions.uris[this.hostIndex]);}else{if(errorCode===undefined){errorCode=ERROR.OK.code;errorText=format(ERROR.OK);}// Run any application callbacks last as they may attempt to reconnect and hence create a new socket.
	if(this.connected){this.connected=false;// Execute the connectionLostCallback if there is one, and we were connected.
	if(this.onConnectionLost)this.onConnectionLost({errorCode:errorCode,errorMessage:errorText});}else{// Otherwise we never had a connection, so indicate that the connect has failed.
	if(this.connectOptions.mqttVersion===4&&this.connectOptions.mqttVersionExplicit===false){this._trace("Failed to connect V4, dropping back to V3");this.connectOptions.mqttVersion=3;if(this.connectOptions.uris){this.hostIndex=0;this._doConnect(this.connectOptions.uris[0]);}else{this._doConnect(this.uri);}}else if(this.connectOptions.onFailure){this.connectOptions.onFailure({invocationContext:this.connectOptions.invocationContext,errorCode:errorCode,errorMessage:errorText});}}}};/** @ignore */ClientImpl.prototype._trace=function(){// Pass trace message back to client's callback function
	if(this.traceFunction){for(var i in arguments){if(typeof arguments[i]!=="undefined")arguments[i]=JSON.stringify(arguments[i]);}var record=Array.prototype.slice.call(arguments).join("");this.traceFunction({severity:"Debug",message:record});}//buffer style trace
	if(this._traceBuffer!==null){for(var i=0,max=arguments.length;i<max;i++){if(this._traceBuffer.length==this._MAX_TRACE_ENTRIES){this._traceBuffer.shift();}if(i===0)this._traceBuffer.push(arguments[i]);else if(typeof arguments[i]==="undefined")this._traceBuffer.push(arguments[i]);else this._traceBuffer.push("  "+JSON.stringify(arguments[i]));};};};/** @ignore */ClientImpl.prototype._traceMask=function(traceObject,masked){var traceObjectMasked={};for(var attr in traceObject){if(traceObject.hasOwnProperty(attr)){if(attr==masked)traceObjectMasked[attr]="******";else traceObjectMasked[attr]=traceObject[attr];}}return traceObjectMasked;};// ------------------------------------------------------------------------
	// Public Programming interface.
	// ------------------------------------------------------------------------
	/**
	             * The JavaScript application communicates to the server using a {@link Paho.MQTT.Client} object.
	             * <p>
	             * Most applications will create just one Client object and then call its connect() method,
	             * however applications can create more than one Client object if they wish.
	             * In this case the combination of host, port and clientId attributes must be different for each Client object.
	             * <p>
	             * The send, subscribe and unsubscribe methods are implemented as asynchronous JavaScript methods
	             * (even though the underlying protocol exchange might be synchronous in nature).
	             * This means they signal their completion by calling back to the application,
	             * via Success or Failure callback functions provided by the application on the method in question.
	             * Such callbacks are called at most once per method invocation and do not persist beyond the lifetime
	             * of the script that made the invocation.
	             * <p>
	             * In contrast there are some callback functions, most notably <i>onMessageArrived</i>,
	             * that are defined on the {@link Paho.MQTT.Client} object.
	             * These may get called multiple times, and aren't directly related to specific method invocations made by the client.
	             *
	             * @name Paho.MQTT.Client
	             *
	             * @constructor
	             *
	             * @param {string} host - the address of the messaging server, as a fully qualified WebSocket URI, as a DNS name or dotted decimal IP address.
	             * @param {number} port - the port number to connect to - only required if host is not a URI
	             * @param {string} path - the path on the host to connect to - only used if host is not a URI. Default: '/mqtt'.
	             * @param {string} clientId - the Messaging client identifier, between 1 and 23 characters in length.
	             *
	             * @property {string} host - <i>read only</i> the server's DNS hostname or dotted decimal IP address.
	             * @property {number} port - <i>read only</i> the server's port.
	             * @property {string} path - <i>read only</i> the server's path.
	             * @property {string} clientId - <i>read only</i> used when connecting to the server.
	             * @property {function} onConnectionLost - called when a connection has been lost.
	             *                            after a connect() method has succeeded.
	             *                            Establish the call back used when a connection has been lost. The connection may be
	             *                            lost because the client initiates a disconnect or because the server or network
	             *                            cause the client to be disconnected. The disconnect call back may be called without
	             *                            the connectionComplete call back being invoked if, for example the client fails to
	             *                            connect.
	             *                            A single response object parameter is passed to the onConnectionLost callback containing the following fields:
	             *                            <ol>
	             *                            <li>errorCode
	             *                            <li>errorMessage
	             *                            </ol>
	             * @property {function} onMessageDelivered called when a message has been delivered.
	             *                            All processing that this Client will ever do has been completed. So, for example,
	             *                            in the case of a Qos=2 message sent by this client, the PubComp flow has been received from the server
	             *                            and the message has been removed from persistent storage before this callback is invoked.
	             *                            Parameters passed to the onMessageDelivered callback are:
	             *                            <ol>
	             *                            <li>{@link Paho.MQTT.Message} that was delivered.
	             *                            </ol>
	             * @property {function} onMessageArrived called when a message has arrived in this Paho.MQTT.client.
	             *                            Parameters passed to the onMessageArrived callback are:
	             *                            <ol>
	             *                            <li>{@link Paho.MQTT.Message} that has arrived.
	             *                            </ol>
	             */var Client=function Client(host,port,path,clientId){var uri;if(typeof host!=="string")throw new Error(format(ERROR.INVALID_TYPE,[typeof host==="undefined"?"undefined":_typeof(host),"host"]));if(arguments.length==2){// host: must be full ws:// uri
	// port: clientId
	clientId=port;uri=host;var match=uri.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);if(match){host=match[4]||match[2];port=parseInt(match[7]);path=match[8];}else{throw new Error(format(ERROR.INVALID_ARGUMENT,[host,"host"]));}}else{if(arguments.length==3){clientId=path;path="/mqtt";}if(typeof port!=="number"||port<0)throw new Error(format(ERROR.INVALID_TYPE,[typeof port==="undefined"?"undefined":_typeof(port),"port"]));if(typeof path!=="string")throw new Error(format(ERROR.INVALID_TYPE,[typeof path==="undefined"?"undefined":_typeof(path),"path"]));var ipv6AddSBracket=host.indexOf(":")!=-1&&host.slice(0,1)!="["&&host.slice(-1)!="]";uri="ws://"+(ipv6AddSBracket?"["+host+"]":host)+":"+port+path;}var clientIdLength=0;for(var i=0;i<clientId.length;i++){var charCode=clientId.charCodeAt(i);if(0xD800<=charCode&&charCode<=0xDBFF){i++;// Surrogate pair.
	}clientIdLength++;}if(typeof clientId!=="string"||clientIdLength>65535)throw new Error(format(ERROR.INVALID_ARGUMENT,[clientId,"clientId"]));var client=new ClientImpl(uri,host,port,path,clientId);this._getHost=function(){return host;};this._setHost=function(){throw new Error(format(ERROR.UNSUPPORTED_OPERATION));};this._getPort=function(){return port;};this._setPort=function(){throw new Error(format(ERROR.UNSUPPORTED_OPERATION));};this._getPath=function(){return path;};this._setPath=function(){throw new Error(format(ERROR.UNSUPPORTED_OPERATION));};this._getURI=function(){return uri;};this._setURI=function(){throw new Error(format(ERROR.UNSUPPORTED_OPERATION));};this._getClientId=function(){return client.clientId;};this._setClientId=function(){throw new Error(format(ERROR.UNSUPPORTED_OPERATION));};this._getOnConnectionLost=function(){return client.onConnectionLost;};this._setOnConnectionLost=function(newOnConnectionLost){if(typeof newOnConnectionLost==="function")client.onConnectionLost=newOnConnectionLost;else throw new Error(format(ERROR.INVALID_TYPE,[typeof newOnConnectionLost==="undefined"?"undefined":_typeof(newOnConnectionLost),"onConnectionLost"]));};this._getOnMessageDelivered=function(){return client.onMessageDelivered;};this._setOnMessageDelivered=function(newOnMessageDelivered){if(typeof newOnMessageDelivered==="function")client.onMessageDelivered=newOnMessageDelivered;else throw new Error(format(ERROR.INVALID_TYPE,[typeof newOnMessageDelivered==="undefined"?"undefined":_typeof(newOnMessageDelivered),"onMessageDelivered"]));};this._getOnMessageArrived=function(){return client.onMessageArrived;};this._setOnMessageArrived=function(newOnMessageArrived){if(typeof newOnMessageArrived==="function")client.onMessageArrived=newOnMessageArrived;else throw new Error(format(ERROR.INVALID_TYPE,[typeof newOnMessageArrived==="undefined"?"undefined":_typeof(newOnMessageArrived),"onMessageArrived"]));};this._getTrace=function(){return client.traceFunction;};this._setTrace=function(trace){if(typeof trace==="function"){client.traceFunction=trace;}else{throw new Error(format(ERROR.INVALID_TYPE,[typeof trace==="undefined"?"undefined":_typeof(trace),"onTrace"]));}};/**
	                 * Connect this Messaging client to its server.
	                 *
	                 * @name Paho.MQTT.Client#connect
	                 * @function
	                 * @param {Object} connectOptions - attributes used with the connection.
	                 * @param {number} connectOptions.timeout - If the connect has not succeeded within this
	                 *                    number of seconds, it is deemed to have failed.
	                 *                    The default is 30 seconds.
	                 * @param {string} connectOptions.userName - Authentication username for this connection.
	                 * @param {string} connectOptions.password - Authentication password for this connection.
	                 * @param {Paho.MQTT.Message} connectOptions.willMessage - sent by the server when the client
	                 *                    disconnects abnormally.
	                 * @param {Number} connectOptions.keepAliveInterval - the server disconnects this client if
	                 *                    there is no activity for this number of seconds.
	                 *                    The default value of 60 seconds is assumed if not set.
	                 * @param {boolean} connectOptions.cleanSession - if true(default) the client and server
	                 *                    persistent state is deleted on successful connect.
	                 * @param {boolean} connectOptions.useSSL - if present and true, use an SSL Websocket connection.
	                 * @param {object} connectOptions.invocationContext - passed to the onSuccess callback or onFailure callback.
	                 * @param {function} connectOptions.onSuccess - called when the connect acknowledgement
	                 *                    has been received from the server.
	                 * A single response object parameter is passed to the onSuccess callback containing the following fields:
	                 * <ol>
	                 * <li>invocationContext as passed in to the onSuccess method in the connectOptions.
	                 * </ol>
	                 * @config {function} [onFailure] called when the connect request has failed or timed out.
	                 * A single response object parameter is passed to the onFailure callback containing the following fields:
	                 * <ol>
	                 * <li>invocationContext as passed in to the onFailure method in the connectOptions.
	                 * <li>errorCode a number indicating the nature of the error.
	                 * <li>errorMessage text describing the error.
	                 * </ol>
	                 * @config {Array} [hosts] If present this contains either a set of hostnames or fully qualified
	                 * WebSocket URIs (ws://example.com:1883/mqtt), that are tried in order in place
	                 * of the host and port paramater on the construtor. The hosts are tried one at at time in order until
	                 * one of then succeeds.
	                 * @config {Array} [ports] If present the set of ports matching the hosts. If hosts contains URIs, this property
	                 * is not used.
	                 * @throws {InvalidState} if the client is not in disconnected state. The client must have received connectionLost
	                 * or disconnected before calling connect for a second or subsequent time.
	                 */this.connect=function(connectOptions){connectOptions=connectOptions||{};validate(connectOptions,{timeout:"number",userName:"string",password:"string",willMessage:"object",keepAliveInterval:"number",cleanSession:"boolean",useSSL:"boolean",invocationContext:"object",onSuccess:"function",onFailure:"function",hosts:"object",ports:"object",mqttVersion:"number"});// If no keep alive interval is set, assume 60 seconds.
	if(connectOptions.keepAliveInterval===undefined)connectOptions.keepAliveInterval=60;if(connectOptions.mqttVersion>4||connectOptions.mqttVersion<3){throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.mqttVersion,"connectOptions.mqttVersion"]));}if(connectOptions.mqttVersion===undefined){connectOptions.mqttVersionExplicit=false;connectOptions.mqttVersion=4;}else{connectOptions.mqttVersionExplicit=true;}//Check that if password is set, so is username
	if(connectOptions.password===undefined&&connectOptions.userName!==undefined)throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.password,"connectOptions.password"]));if(connectOptions.willMessage){if(!(connectOptions.willMessage instanceof Message))throw new Error(format(ERROR.INVALID_TYPE,[connectOptions.willMessage,"connectOptions.willMessage"]));// The will message must have a payload that can be represented as a string.
	// Cause the willMessage to throw an exception if this is not the case.
	connectOptions.willMessage.stringPayload;if(typeof connectOptions.willMessage.destinationName==="undefined")throw new Error(format(ERROR.INVALID_TYPE,[_typeof(connectOptions.willMessage.destinationName),"connectOptions.willMessage.destinationName"]));}if(typeof connectOptions.cleanSession==="undefined")connectOptions.cleanSession=true;if(connectOptions.hosts){if(!(connectOptions.hosts instanceof Array))throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.hosts,"connectOptions.hosts"]));if(connectOptions.hosts.length<1)throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.hosts,"connectOptions.hosts"]));var usingURIs=false;for(var i=0;i<connectOptions.hosts.length;i++){if(typeof connectOptions.hosts[i]!=="string")throw new Error(format(ERROR.INVALID_TYPE,[_typeof(connectOptions.hosts[i]),"connectOptions.hosts["+i+"]"]));if(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(connectOptions.hosts[i])){if(i==0){usingURIs=true;}else if(!usingURIs){throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.hosts[i],"connectOptions.hosts["+i+"]"]));}}else if(usingURIs){throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.hosts[i],"connectOptions.hosts["+i+"]"]));}}if(!usingURIs){if(!connectOptions.ports)throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.ports,"connectOptions.ports"]));if(!(connectOptions.ports instanceof Array))throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.ports,"connectOptions.ports"]));if(connectOptions.hosts.length!=connectOptions.ports.length)throw new Error(format(ERROR.INVALID_ARGUMENT,[connectOptions.ports,"connectOptions.ports"]));connectOptions.uris=[];for(var i=0;i<connectOptions.hosts.length;i++){if(typeof connectOptions.ports[i]!=="number"||connectOptions.ports[i]<0)throw new Error(format(ERROR.INVALID_TYPE,[_typeof(connectOptions.ports[i]),"connectOptions.ports["+i+"]"]));var host=connectOptions.hosts[i];var port=connectOptions.ports[i];var ipv6=host.indexOf(":")!=-1;uri="ws://"+(ipv6?"["+host+"]":host)+":"+port+path;connectOptions.uris.push(uri);}}else{connectOptions.uris=connectOptions.hosts;}}client.connect(connectOptions);};/**
	                 * Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
	                 *
	                 * @name Paho.MQTT.Client#subscribe
	                 * @function
	                 * @param {string} filter describing the destinations to receive messages from.
	                 * <br>
	                 * @param {object} subscribeOptions - used to control the subscription
	                 *
	                 * @param {number} subscribeOptions.qos - the maiximum qos of any publications sent
	                 *                                  as a result of making this subscription.
	                 * @param {object} subscribeOptions.invocationContext - passed to the onSuccess callback
	                 *                                  or onFailure callback.
	                 * @param {function} subscribeOptions.onSuccess - called when the subscribe acknowledgement
	                 *                                  has been received from the server.
	                 *                                  A single response object parameter is passed to the onSuccess callback containing the following fields:
	                 *                                  <ol>
	                 *                                  <li>invocationContext if set in the subscribeOptions.
	                 *                                  </ol>
	                 * @param {function} subscribeOptions.onFailure - called when the subscribe request has failed or timed out.
	                 *                                  A single response object parameter is passed to the onFailure callback containing the following fields:
	                 *                                  <ol>
	                 *                                  <li>invocationContext - if set in the subscribeOptions.
	                 *                                  <li>errorCode - a number indicating the nature of the error.
	                 *                                  <li>errorMessage - text describing the error.
	                 *                                  </ol>
	                 * @param {number} subscribeOptions.timeout - which, if present, determines the number of
	                 *                                  seconds after which the onFailure calback is called.
	                 *                                  The presence of a timeout does not prevent the onSuccess
	                 *                                  callback from being called when the subscribe completes.
	                 * @throws {InvalidState} if the client is not in connected state.
	                 */this.subscribe=function(filter,subscribeOptions){if(typeof filter!=="string")throw new Error("Invalid argument:"+filter);subscribeOptions=subscribeOptions||{};validate(subscribeOptions,{qos:"number",invocationContext:"object",onSuccess:"function",onFailure:"function",timeout:"number"});if(subscribeOptions.timeout&&!subscribeOptions.onFailure)throw new Error("subscribeOptions.timeout specified with no onFailure callback.");if(typeof subscribeOptions.qos!=="undefined"&&!(subscribeOptions.qos===0||subscribeOptions.qos===1||subscribeOptions.qos===2))throw new Error(format(ERROR.INVALID_ARGUMENT,[subscribeOptions.qos,"subscribeOptions.qos"]));client.subscribe(filter,subscribeOptions);};/**
			 * Unsubscribe for messages, stop receiving messages sent to destinations described by the filter.
			 *
			 * @name Paho.MQTT.Client#unsubscribe
			 * @function
			 * @param {string} filter - describing the destinations to receive messages from.
			 * @param {object} unsubscribeOptions - used to control the subscription
			 * @param {object} unsubscribeOptions.invocationContext - passed to the onSuccess callback
			                                      or onFailure callback.
			 * @param {function} unsubscribeOptions.onSuccess - called when the unsubscribe acknowledgement has been received from the server.
			 *                                    A single response object parameter is passed to the
			 *                                    onSuccess callback containing the following fields:
			 *                                    <ol>
			 *                                    <li>invocationContext - if set in the unsubscribeOptions.
			 *                                    </ol>
			 * @param {function} unsubscribeOptions.onFailure called when the unsubscribe request has failed or timed out.
			 *                                    A single response object parameter is passed to the onFailure callback containing the following fields:
			 *                                    <ol>
			 *                                    <li>invocationContext - if set in the unsubscribeOptions.
			 *                                    <li>errorCode - a number indicating the nature of the error.
			 *                                    <li>errorMessage - text describing the error.
			 *                                    </ol>
			 * @param {number} unsubscribeOptions.timeout - which, if present, determines the number of seconds
			 *                                    after which the onFailure callback is called. The presence of
			 *                                    a timeout does not prevent the onSuccess callback from being
			 *                                    called when the unsubscribe completes
			 * @throws {InvalidState} if the client is not in connected state.
			 */this.unsubscribe=function(filter,unsubscribeOptions){if(typeof filter!=="string")throw new Error("Invalid argument:"+filter);unsubscribeOptions=unsubscribeOptions||{};validate(unsubscribeOptions,{invocationContext:"object",onSuccess:"function",onFailure:"function",timeout:"number"});if(unsubscribeOptions.timeout&&!unsubscribeOptions.onFailure)throw new Error("unsubscribeOptions.timeout specified with no onFailure callback.");client.unsubscribe(filter,unsubscribeOptions);};/**
	                 * Send a message to the consumers of the destination in the Message.
	                 *
	                 * @name Paho.MQTT.Client#send
	                 * @function
	                 * @param {string|Paho.MQTT.Message} topic - <b>mandatory</b> The name of the destination to which the message is to be sent.
	                 * 					   - If it is the only parameter, used as Paho.MQTT.Message object.
	                 * @param {String|ArrayBuffer} payload - The message data to be sent.
	                 * @param {number} qos The Quality of Service used to deliver the message.
	                 * 		<dl>
	                 * 			<dt>0 Best effort (default).
	                 *     			<dt>1 At least once.
	                 *     			<dt>2 Exactly once.
	                 * 		</dl>
	                 * @param {Boolean} retained If true, the message is to be retained by the server and delivered
	                 *                     to both current and future subscriptions.
	                 *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
	                 *                     A received message has the retained boolean set to true if the message was published
	                 *                     with the retained boolean set to true
	                 *                     and the subscrption was made after the message has been published.
	                 * @throws {InvalidState} if the client is not connected.
	                 */this.send=function(topic,payload,qos,retained){var message;if(arguments.length==0){throw new Error("Invalid argument."+"length");}else if(arguments.length==1){if(!(topic instanceof Message)&&typeof topic!=="string")throw new Error("Invalid argument:"+(typeof topic==="undefined"?"undefined":_typeof(topic)));message=topic;if(typeof message.destinationName==="undefined")throw new Error(format(ERROR.INVALID_ARGUMENT,[message.destinationName,"Message.destinationName"]));client.send(message);}else{//parameter checking in Message object
	message=new Message(payload);message.destinationName=topic;if(arguments.length>=3)message.qos=qos;if(arguments.length>=4)message.retained=retained;client.send(message);}};/**
	                 * Normal disconnect of this Messaging client from its server.
	                 *
	                 * @name Paho.MQTT.Client#disconnect
	                 * @function
	                 * @throws {InvalidState} if the client is already disconnected.
	                 */this.disconnect=function(){client.disconnect();};/**
	                 * Get the contents of the trace log.
	                 *
	                 * @name Paho.MQTT.Client#getTraceLog
	                 * @function
	                 * @return {Object[]} tracebuffer containing the time ordered trace records.
	                 */this.getTraceLog=function(){return client.getTraceLog();};/**
	                 * Start tracing.
	                 *
	                 * @name Paho.MQTT.Client#startTrace
	                 * @function
	                 */this.startTrace=function(){client.startTrace();};/**
	                 * Stop tracing.
	                 *
	                 * @name Paho.MQTT.Client#stopTrace
	                 * @function
	                 */this.stopTrace=function(){client.stopTrace();};this.isConnected=function(){return client.connected;};};Client.prototype={get host(){return this._getHost();},set host(newHost){this._setHost(newHost);},get port(){return this._getPort();},set port(newPort){this._setPort(newPort);},get path(){return this._getPath();},set path(newPath){this._setPath(newPath);},get clientId(){return this._getClientId();},set clientId(newClientId){this._setClientId(newClientId);},get onConnectionLost(){return this._getOnConnectionLost();},set onConnectionLost(newOnConnectionLost){this._setOnConnectionLost(newOnConnectionLost);},get onMessageDelivered(){return this._getOnMessageDelivered();},set onMessageDelivered(newOnMessageDelivered){this._setOnMessageDelivered(newOnMessageDelivered);},get onMessageArrived(){return this._getOnMessageArrived();},set onMessageArrived(newOnMessageArrived){this._setOnMessageArrived(newOnMessageArrived);},get trace(){return this._getTrace();},set trace(newTraceFunction){this._setTrace(newTraceFunction);}};/**
	             * An application message, sent or received.
	             * <p>
	             * All attributes may be null, which implies the default values.
	             *
	             * @name Paho.MQTT.Message
	             * @constructor
	             * @param {String|ArrayBuffer} payload The message data to be sent.
	             * <p>
	             * @property {string} payloadString <i>read only</i> The payload as a string if the payload consists of valid UTF-8 characters.
	             * @property {ArrayBuffer} payloadBytes <i>read only</i> The payload as an ArrayBuffer.
	             * <p>
	             * @property {string} destinationName <b>mandatory</b> The name of the destination to which the message is to be sent
	             *                    (for messages about to be sent) or the name of the destination from which the message has been received.
	             *                    (for messages received by the onMessage function).
	             * <p>
	             * @property {number} qos The Quality of Service used to deliver the message.
	             * <dl>
	             *     <dt>0 Best effort (default).
	             *     <dt>1 At least once.
	             *     <dt>2 Exactly once.
	             * </dl>
	             * <p>
	             * @property {Boolean} retained If true, the message is to be retained by the server and delivered
	             *                     to both current and future subscriptions.
	             *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
	             *                     A received message has the retained boolean set to true if the message was published
	             *                     with the retained boolean set to true
	             *                     and the subscrption was made after the message has been published.
	             * <p>
	             * @property {Boolean} duplicate <i>read only</i> If true, this message might be a duplicate of one which has already been received.
	             *                     This is only set on messages received from the server.
	             *
	             */var Message=function Message(newPayload){var payload;if(typeof newPayload==="string"||newPayload instanceof ArrayBuffer||newPayload instanceof Int8Array||newPayload instanceof Uint8Array||newPayload instanceof Int16Array||newPayload instanceof Uint16Array||newPayload instanceof Int32Array||newPayload instanceof Uint32Array||newPayload instanceof Float32Array||newPayload instanceof Float64Array){payload=newPayload;}else{throw format(ERROR.INVALID_ARGUMENT,[newPayload,"newPayload"]);}this._getPayloadString=function(){if(typeof payload==="string")return payload;else return parseUTF8(payload,0,payload.length);};this._getPayloadBytes=function(){if(typeof payload==="string"){var buffer=new ArrayBuffer(UTF8Length(payload));var byteStream=new Uint8Array(buffer);stringToUTF8(payload,byteStream,0);return byteStream;}else{return payload;};};var destinationName=undefined;this._getDestinationName=function(){return destinationName;};this._setDestinationName=function(newDestinationName){if(typeof newDestinationName==="string")destinationName=newDestinationName;else throw new Error(format(ERROR.INVALID_ARGUMENT,[newDestinationName,"newDestinationName"]));};var qos=0;this._getQos=function(){return qos;};this._setQos=function(newQos){if(newQos===0||newQos===1||newQos===2)qos=newQos;else throw new Error("Invalid argument:"+newQos);};var retained=false;this._getRetained=function(){return retained;};this._setRetained=function(newRetained){if(typeof newRetained==="boolean")retained=newRetained;else throw new Error(format(ERROR.INVALID_ARGUMENT,[newRetained,"newRetained"]));};var duplicate=false;this._getDuplicate=function(){return duplicate;};this._setDuplicate=function(newDuplicate){duplicate=newDuplicate;};};Message.prototype={get payloadString(){return this._getPayloadString();},get payloadBytes(){return this._getPayloadBytes();},get destinationName(){return this._getDestinationName();},set destinationName(newDestinationName){this._setDestinationName(newDestinationName);},get qos(){return this._getQos();},set qos(newQos){this._setQos(newQos);},get retained(){return this._getRetained();},set retained(newRetained){this._setRetained(newRetained);},get duplicate(){return this._getDuplicate();},set duplicate(newDuplicate){this._setDuplicate(newDuplicate);}};// Module contents.
	return{Client:Client,Message:Message};}(window);return _Paho;};exports.default=Paho;module.exports=exports["default"];});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('../tools/ajax.js'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.ajax);
	        global.Model = mod.exports;
	    }
	})(this, function (exports, _ajax) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    exports.prototypeCache = exports.cache = undefined;

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

	    function createCache() {
	        var cache = {
	            init: function init() {},
	            public: {
	                toArray: [],
	                toDictionary: {}
	            },
	            clear: function clear() {
	                cache.public.toArray = [];
	                cache.public.toDictionary = [];
	            }
	        };

	        return cache;
	    }

	    var cache = exports.cache = createCache();

	    var prototypeCache = exports.prototypeCache = createCache();

	    var Model = function () {
	        function Model() {
	            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	            var config = arguments[1];

	            _classCallCheck(this, Model);

	            this.config = config;
	            if (id) {
	                this.id = id;
	            }
	        }

	        _createClass(Model, [{
	            key: 'getAllModels',
	            value: function getAllModels() {
	                var _this = this;

	                return new Promise(function (resolve, reject) {
	                    if (cache.public.toArray.length > 0) {
	                        resolve(cache.public.toArray);
	                    } else {
	                        _ajax.ajax.get('/device-models', {
	                            queryObj: 'limit=100000',
	                            contentType: 'application/hal+json'
	                        }).then(function (response) {
	                            cache.public.toArray = response.models;
	                            _this._makeDictionary(cache.public.toArray);
	                            resolve(cache.public.toArray);
	                        }).catch(function (error) {
	                            reject(error);
	                        });
	                    }
	                });
	            }
	        }, {
	            key: 'getAllPrototypes',
	            value: function getAllPrototypes() {
	                var _this2 = this;

	                return new Promise(function (resolve, reject) {
	                    if (prototypeCache.public.toArray.length > 0) {
	                        resolve(prototypeCache.public.toArray);
	                    } else {
	                        _ajax.ajax.get('/device-models/prototypes', {
	                            queryObj: 'limit=100000',
	                            contentType: 'application/hal+json'
	                        }).then(function (response) {
	                            prototypeCache.public.toArray = response.prototypes;
	                            _this2._makeDictionary(prototypeCache.public.toArray);
	                            resolve(prototypeCache.public.toArray);
	                        }).catch(function (error) {
	                            reject(error);
	                        });
	                    }
	                });
	            }
	        }, {
	            key: 'getModel',
	            value: function getModel(id) {
	                if (this.id && !id) {
	                    id = this.id;
	                }

	                if (cache.public.toDictionary[id]) {
	                    return new Promise(function (resolve, reject) {
	                        resolve(cache.public.toDictionary[id]);
	                    });
	                } else {
	                    return new Promise(function (resolve, reject) {
	                        _ajax.ajax.get('/device-models/' + id, {
	                            contentType: 'application/hal+json'
	                        }).then(function (model) {
	                            cache.public.toArray.push(model);
	                            cache.public.toDictionary[id] = model;
	                            resolve(model);
	                        }).catch(function (error) {
	                            reject(error);
	                        });
	                    });
	                }
	            }
	        }, {
	            key: '_getModelById',
	            value: function _getModelById(id) {
	                if (cache.public.toArray.length > 0) {
	                    return cache.public.toDictionary[id] || null;
	                } else {
	                    return null;
	                }
	            }
	        }, {
	            key: '_getPublicModelsFromArray',
	            value: function _getPublicModelsFromArray() {
	                return cache.public.toArray || [];
	            }
	        }, {
	            key: '_getPublicModelsFromDictionary',
	            value: function _getPublicModelsFromDictionary() {
	                return cache.public.toDictionary || [];
	            }
	        }, {
	            key: '_makeDictionary',
	            value: function _makeDictionary(modelsArray) {
	                if (!modelsArray) {
	                    return;
	                }
	                if (!cache.public.toDictionary) cache.public.toDictionary = {};
	                var len = modelsArray.length;
	                var i = 0;
	                while (len--) {
	                    var model = modelsArray[i];
	                    cache.public.toDictionary[model.id] = model;
	                    i++;
	                }
	                return cache.public.toDictionary;
	            }
	        }]);

	        return Model;
	    }();

	    exports.default = Model;
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module, exports, require('../tools/ajax.js'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod, mod.exports, global.ajax);
	        global.Transmitter = mod.exports;
	    }
	})(this, function (module, exports, _ajax) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

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

	    var Transmitter = function () {
	        function Transmitter(config) {
	            _classCallCheck(this, Transmitter);

	            this.id = config.id;
	            this.secret = config.secret;
	            this.name = config.name;
	            this.topic = config.topic;
	            this.owner = config.owner;
	            this.integrationType = config.integrationType;
	        }

	        _createClass(Transmitter, [{
	            key: 'deleteTransmitter',
	            value: function deleteTransmitter(opts) {
	                var _this = this;

	                if (!this.id) {
	                    throw new Error('Provide the id during instantiation');
	                }
	                return new Promise(function (resolve, reject) {
	                    _ajax.ajax.delete('/transmitters/' + _this.id, opts).then(function (response) {
	                        //right now the object hangs around, but on the cloud it is gone
	                        resolve(response);
	                    }).catch(function (error) {
	                        reject(error);
	                    });
	                });
	            }
	        }, {
	            key: 'updateTransmitter',
	            value: function updateTransmitter(patchBody, opts) {
	                var _this2 = this;

	                if (!this.id) {
	                    throw new Error('Provide the id during instantiation');
	                } else if (!patchBody) {
	                    throw new Error('Provide a patch of parameters to update');
	                } else if (!Object.keys(patchBody).length) {
	                    throw new Error('Provide a patch with some parameters to update');
	                }

	                for (var x in patchBody) {
	                    if (!this.hasOwnProperty(x)) {
	                        throw new Error('Provide a patch with relevant parameters to update');
	                    }
	                }

	                return new Promise(function (resolve, reject) {
	                    _ajax.ajax.patch('/transmitters/' + _this2.id, patchBody, opts).then(function (response) {
	                        _this2.id = response.id, _this2.secret = response.secret, _this2.name = response.name, _this2.topic = response.topic, _this2.owner = response.owner, _this2.integrationType = response.integrationType, resolve(response);
	                    }).catch(function (error) {
	                        reject(error);
	                    });
	                });
	            }
	        }]);

	        return Transmitter;
	    }();

	    exports.default = Transmitter;
	    ;
	    module.exports = exports['default'];
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module, exports, require('../tools/ajax.js'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod, mod.exports, global.ajax);
	        global.Group = mod.exports;
	    }
	})(this, function (module, exports, _ajax) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

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

	    var Group = function () {
	        function Group(config) {
	            _classCallCheck(this, Group);

	            this.owner = config.owner;
	            this.position = config.position;
	            this.id = config.id;
	            this.devices = config.devices;
	            this.name = config.name;
	        }

	        // A group has the structure:
	        // {
	        //   "owner": "...",
	        //   "position": ...,
	        //   "id": "...",
	        //   "devices": [...],
	        //   "name": "..."
	        // }

	        _createClass(Group, [{
	            key: 'getGroup',
	            value: function getGroup() {
	                var _this = this;

	                if (!this.id) {
	                    throw new Error('Provide the group id during instantiation');
	                }
	                return new Promise(function (resolve, reject) {
	                    _ajax.ajax.get('/groups/' + _this.id).then(function (response) {
	                        resolve(response);
	                    }).catch(function (error) {
	                        reject(error);
	                    });
	                });
	            }
	        }, {
	            key: 'getGroupDevices',
	            value: function getGroupDevices() {
	                var _this2 = this;

	                if (!this.id) {
	                    throw new Error('Provide the group id during instantiation');
	                }
	                return new Promise(function (resolve, reject) {
	                    _ajax.ajax.get('/groups/' + _this2.id).then(function (response) {
	                        resolve(response.devices);
	                    }).catch(function (error) {
	                        reject(error);
	                    });
	                });
	            }
	        }, {
	            key: 'deleteGroup',
	            value: function deleteGroup(opts) {
	                var _this3 = this;

	                if (!this.id) {
	                    throw new Error('Provide the group id during instantiation');
	                }
	                return new Promise(function (resolve, reject) {
	                    _ajax.ajax.delete('/groups/' + _this3.id, opts).then(function (response) {
	                        //right now the object hangs around, but on the cloud it is gone
	                        resolve(response);
	                    }).catch(function (error) {
	                        reject(error);
	                    });
	                });
	            }
	        }, {
	            key: 'updateGroup',
	            value: function updateGroup(patch, opts) {
	                var _this4 = this;

	                if (!this.id) {
	                    throw new Error('Provide the group id during instantiation');
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
	                    _ajax.ajax.patch('/groups/' + _this4.id, patch, opts).then(function (response) {
	                        _this4.owner = response.owner;
	                        _this4.position = response.position;
	                        _this4.id = response.id;
	                        _this4.devices = response.devices;
	                        _this4.name = response.name;
	                        resolve(response);
	                    }).catch(function (error) {
	                        reject(error);
	                    });
	                });
	            }
	        }]);

	        return Group;
	    }();

	    exports.default = Group;
	    ;
	    module.exports = exports['default'];
	});

/***/ }
/******/ ])
});
;