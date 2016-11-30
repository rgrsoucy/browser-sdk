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