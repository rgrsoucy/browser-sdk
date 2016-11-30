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