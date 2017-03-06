(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../tools/ajax.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('../tools/ajax.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.ajax);
        global.App = mod.exports;
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

    var App = function () {
        function App() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, App);

            this.config = config;
            this.name = config.name;
            this.appId = config.appId;
            this.publisher = config.publisher;
            this.redirectUri = config.redirectUri;
            this.description = config.description;
        }

        _createClass(App, [{
            key: 'newApp',
            value: function newApp(postBody) {
                var _this = this;

                //POST /apps, (name, publisher, redirectUri, description)
                if (!postBody) {
                    throw new Error('Provide a body of parameters to post');
                } else if (!postBody.hasOwnProperty('name') && !postBody.hasOwnProperty('publisher') && !postBody.hasOwnProperty('redirectUri') && !postBody.hasOwnProperty('description')) {
                    throw new Error('Provide a body with parameters name, description, redirectUri, and publisher for the App');
                }

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.post('/apps', postBody).then(function (response) {
                        _this.appId = response.id;
                        _this.name = response.name;
                        _this.publisher = response.publisher;
                        _this.redirectUri = response.redirectUri;
                        _this.description = response.description;
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'deleteApp',
            value: function deleteApp() {
                var _this2 = this;

                //DELETE /apps/{appId}
                if (!this.appId) {
                    throw new Error('Provide the device id during instantiation');
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.delete('/apps/' + _this2.appId).then(function (response) {
                        //right now the object hangs around, but on the cloud it is gone
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'updateApp',
            value: function updateApp(patchBody) {
                var _this3 = this;

                //POST /apps/{appId}, optional:(name, publisher, redirectUri, description)
                if (!this.appId) {
                    throw new Error('Please provide an appId');
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
                    _ajax.ajax.patch('/apps/' + _this3.appId, patchBody).then(function (response) {
                        _this3.name = response.name;
                        _this3.publisher = response.publisher;
                        _this3.redirectUri = response.redirectUri;
                        _this3.description = response.description;
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }]);

        return App;
    }();

    exports.default = App;
    module.exports = exports['default'];
});