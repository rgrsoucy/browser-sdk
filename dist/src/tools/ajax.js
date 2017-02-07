(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
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

                var opts = arguments.length <= 1 || arguments[1] === undefined ? {
                    contentType: 'application/json'
                } : arguments[1];

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

                var opts = arguments.length <= 2 || arguments[2] === undefined ? {
                    contentType: 'application/json',
                    raw: true
                } : arguments[2];

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

                var opts = arguments.length <= 2 || arguments[2] === undefined ? {
                    contentType: 'application/json'
                } : arguments[2];

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

                var opts = arguments.length <= 1 || arguments[1] === undefined ? {
                    contentType: 'application/json'
                } : arguments[1];

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