export default class DeviceHistoryPoints {
    constructor(deviceHistory, meaning, path) {
        if (!deviceHistory) { return {}; }

        this.devicesPoints = {};
        this.meaning = meaning;
        this.path = path;
        this.addPoints(deviceHistory);
    }

    addPoints(deviceHistory) {
        deviceHistory.forEach((obj) => {
            var key = this._getKey(this.meaning, this.path);
            if (!this.devicesPoints[key]) {
                this.devicesPoints[key] = [obj];
            } else {
                this.devicesPoints[key].push(obj);
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
