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