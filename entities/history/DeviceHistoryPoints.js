export default class DeviceHistoryPoints {
    constructor(deviceHistory) {
        if (!deviceHistory) { return {}; }

        let devicesPoints = {};

        deviceHistory.forEach((res) => {
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
