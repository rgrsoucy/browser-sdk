import Ajax from '../../tools/ajax.js';
import sampleCalculator from './sampleCalculator';
import DeviceHistoryPoints from './DeviceHistoryPoints';

export default class DeviceHistory {
    constructor(rawDevice = {}, config) {
        this.id = rawDevice.id;
        this.dataUri = config.ajax.dataUri;
        this.ajax = new Ajax({
            uri: config.ajax.dataUri,
            token: config.ajax.token
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
            this.ajax.get(`/history/devices/${this.id}`, { queryObj: queryParams }).then(function(response) {
                resolve({
                    points: new DeviceHistoryPoints(response.results),
                    response: response
                });
            }, reject);
        });
    }

    getAllHistoricalData(opts = {}) {
        let points;

        let { onDataReceived, periode } = opts;
        onDataReceived = onDataReceived || function() {};

        let hasMore = function(data) {
            return data.count > data.limit && (data.count - data.offset) > data.limit;
        };

        let handleResponse = (data, resolve, reject) => {
            if(data.points && !points) {
                points = data.points;
            } else if (data.response && data.response.results) {
                points.addPoints(data.response.results);
            }

            onDataReceived(points);

            if (hasMore(data.response)) {
                getData({
                    offset: data.response.offset + data.response.limit
                }, resolve, reject);
            } else {
                resolve(points);
            }
        };

        let getData = (opts, resolve, reject) => {
            this.getHistoricalData(opts).then((data) => {
                handleResponse(data, resolve, reject);
            }, reject);
        };

        return new Promise((resolve, reject) => {
            getData(opts, resolve, reject);
        });
    }
};
