export default class DeviceHistoryPoints {
    constructor(deviceHistory, meaning, path) {
        if (!deviceHistory) { return {}; }

        this.devicesPoints = {};
        this.meaning = meaning;
        this.path = path;
        this.addPoints(deviceHistory);
    }

    addPoints(deviceHistory) {
        Object.keys(deviceHistory).forEach((timestamp) => {
            var res = deviceHistory[timestamp];
            var key = this._getKey(this.meaning, this.path);
            var obj = Object.assign({ timestamp }, res);
            if (!this.devicesPoints[key]) {
                this.devicesPoints[key] = [obj];
            } else {
                this.devicesPoints[key].push(obj);
            }
        });

        Object.keys(this.devicesPoints).forEach((key) => {
            this.devicesPoints[key].sort((a, b) => {
                var keyA = new Date(a.timestamp);
                var keyB = new Date(b.timestamp);

                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
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
