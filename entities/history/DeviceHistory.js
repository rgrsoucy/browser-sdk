import Ajax from '../../tools/ajax.js';

export default class DeviceHistory {
    constructor(config) {
        this.deviceId = config.deviceId;
        this.dataUrl = config.ajax.dataUrl;
        this.ajax = new Ajax({
            uri: config.ajax.dataUrl
        });
    }

    getHistoricalData(opts = {}) {
        let { count = 0, limit = 1000, offset = 0, end} = opts;
        let queryParams = {};
        if (end) {
            queryParams.end = end.getTime();
        }
        return this.ajax.get(`${this.dataUrl}/history/devices/${this.deviceId}`, true, queryParams);
    }
};
