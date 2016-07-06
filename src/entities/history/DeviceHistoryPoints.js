export default class DeviceHistoryPoints {
    constructor(deviceHistory) {
        if (!deviceHistory) { return {}; }

        this.devicesPoints = {};
        this.addPoints(deviceHistory);
    }

    addPoints(deviceHistory) {
        deviceHistory.forEach((res) => {
            var key = this._getKey(res.meaning, res.path);
            if (this.devicesPoints[key]) {
                this.devicesPoints[key].points = this.devicesPoints[key].points.concat(res.points);
            } else {
                this.devicesPoints[key] = Object.assign({id:res.deviceId}, res);
                delete this.devicesPoints[key].deviceId;
            }
        });
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
