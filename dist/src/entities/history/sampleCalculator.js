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