import Ajax from '../../tools/ajax.js';
import sampleCalculator from './sampleCalculator';

class DeviceHistoryPoints {
    constructor(response) {
        if (!response.results) { return {}; }

        let devicesPoints = {};

        response.results.forEach((res) => {
            var key = this._getKey(res.meaning, res.path);
            if (devicesPoints[key]) {
                devicesPoints[key].points = devicesPoints[key].points.concat(res.points);
            } else {
                devicesPoints[key] = res;
            }
        });

        this.devicesPoints = devicesPoints;
    }

    _getKey(meaning, path) {
        if (!path || path === 'null') {
            return meaning;
        }

        if (!meaning || meaning === 'null') {
            return path;
        }
        return `${meaning}-${path}`;
    }

    get(meaning, path) {
        return this.devicesPoints[this._getKey(meaning, path)];
    }
}

export default class DeviceHistory {
    constructor(config) {
        this.deviceId = config.deviceId;
        this.dataUrl = config.ajax.dataUrl;
        this.ajax = new Ajax({
            uri: config.ajax.dataUrl
        });
    }

    getHistoricalData(opts = {}) {
        let { limit = 1000, offset = 0, end, start, sample, periode } = opts;
        let queryParams = {};

        if (periode && periode.length > 0) {
            let sampleObj = sampleCalculator(periode);
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

        queryParams.offset = offset;
        queryParams.limit = limit;

        return new Promise((resolve, reject) => {
            this.ajax.get(`${this.dataUrl}/history/devices/${this.deviceId}`, true, queryParams).then(function(response) {
                resolve({
                    points: new DeviceHistoryPoints(response),
                    response: response
                });
            }, reject);
        });
    }
};
