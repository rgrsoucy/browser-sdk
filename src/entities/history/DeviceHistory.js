import Ajax, { ajax } from '../../tools/ajax.js';
import sampleCalculator from './sampleCalculator';
import DeviceHistoryPoints from './DeviceHistoryPoints';

export default class DeviceHistory {
    constructor(rawDevice = {}, config) {
        this.id = rawDevice.id;
        this.ajax = new Ajax({
            uri: config.ajax.uri,
            token: ajax.options.token
        });
    }

    getHistoricalData(opts = {}) {
        let { limit = 1000, offset = 0, end, start, sample, periode, meaning, path } = opts;
        let queryParams = {
            aggregates: 'avg,min,max'
        };

        if (periode && periode.length > 0) {
            let sampleObj = sampleCalculator(periode);
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

        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.id}/aggregated-readings`, { queryObj: queryParams }).then(function(response) {
                resolve({
                    points: new DeviceHistoryPoints(response.data, meaning, path),
                    response: response
                });
            }, reject);
        });
    }

    getHistoricalRawData(opts = {}) {
        let { end, start, meaning, path } = opts;
        const queryParams = {};
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

        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.id}/raw-readings`, { queryObj: queryParams }).then(function(response) {
                resolve({
                    points: new DeviceHistoryPoints(response.data, meaning, path),
                    response: response
                });
            }, reject);
        });
    }
    getAllHistoricalData(opts = {}) {
        let points;

        let { onDataReceived, periode } = opts;
        onDataReceived = onDataReceived || function() {};

        let handleResponse = (data) => {
            if (data.points && !points) {
                points = data.points;
            } else if (data.response && data.response.results) {
                points.addPoints(data.response.results);
            }

            onDataReceived(points);
        };

        return new Promise((resolve, reject) => {
            this.getHistoricalData(opts).then((data) => {
                handleResponse(data);
                resolve(data.points);
            }, reject);
        });

    }
};
