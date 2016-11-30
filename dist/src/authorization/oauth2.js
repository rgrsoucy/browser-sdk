(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
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