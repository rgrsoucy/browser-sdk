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