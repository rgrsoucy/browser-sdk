(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../../tools/ajax.js', './sampleCalculator', './DeviceHistoryPoints'], factory);
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
            var rawDevice = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var config = arguments[1];

            _classCallCheck(this, DeviceHistory);

            this.id = rawDevice.id;
            this.ajax = new _ajax2.default({
                uri: config.ajax.uri,
                token: _ajax.ajax.options.token
            });
        }

        _createClass(DeviceHistory, [{
            key: 'getHistoricalData',
            value: function getHistoricalData() {
                var _this = this;

                var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                var _opts$limit = opts.limit;
                var limit = _opts$limit === undefined ? 1000 : _opts$limit;
                var _opts$offset = opts.offset;
                var offset = _opts$offset === undefined ? 0 : _opts$offset;
                var end = opts.end;
                var start = opts.start;
                var sample = opts.sample;
                var periode = opts.periode;
                var meaning = opts.meaning;
                var path = opts.path;

                var queryParams = {
                    aggregates: 'avg,min,max'
                };

                if (periode && periode.length > 0) {
                    var sampleObj = (0, _sampleCalculator2.default)(periode);
                    sample = sample || sampleObj.sampleSize;
                    start = sampleObj.start;
                    end = sampleObj.end;
                }

                if (sample !== undefined) {
                    queryParams.interval = sample;
                }

                if (end) {
                    queryParams.end = end.toISOString();
                }
                if (start) {
                    queryParams.start = start.toISOString();
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
                    _this.ajax.get('/devices/' + _this.id + '/aggregated-readings', { queryObj: queryParams }).then(function (response) {
                        resolve({
                            points: new _DeviceHistoryPoints2.default(response.data, meaning, path),
                            response: response
                        });
                    }, reject);
                });
            }
        }, {
            key: 'getAllHistoricalData',
            value: function getAllHistoricalData() {
                var _this2 = this;

                var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var points = void 0;

                var onDataReceived = opts.onDataReceived;
                var periode = opts.periode;

                onDataReceived = onDataReceived || function () {};

                var handleResponse = function handleResponse(data) {
                    if (data.points && !points) {
                        points = data.points;
                    } else if (data.response && data.response.results) {
                        points.addPoints(data.response.results);
                    }

                    onDataReceived(points);
                };

                return new Promise(function (resolve, reject) {
                    _this2.getHistoricalData(opts).then(function (data) {
                        handleResponse(data);
                        resolve(data.points);
                    }, reject);
                });
            }
        }]);

        return DeviceHistory;
    }();

    exports.default = DeviceHistory;
    ;
    module.exports = exports['default'];
});