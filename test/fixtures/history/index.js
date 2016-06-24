let historyData = {
    count: 5,
    limit: 10000,
    offset: 0,
    results: [{
        deviceId: 'fake-history-device-id',
        points: [{
            timestamp: 1465552800000,
            value: 49.2680925420364
        }, {
            timestamp: 1465563600000,
            value: 0.022372681778039447
        }, {
            timestamp: 1465567200000,
            value: 0.1440922190201729
        }, {
            timestamp: 1465570800000,
            value: 0.015345982142857142
        }, {
            timestamp: 1465574400000,
            value: 0.04199475065616798
        }],
        meaning: 'fake-meaning',
        path: 'fake-path'
    },
    {
        deviceId: 'fake-history-device-id-no-path',
        points: [{
            timestamp: 1465552800000,
            value: -9
        }],
        meaning: 'fake-meaning',
        path: 'null'
    },
    {
        deviceId: 'fake-history-device-id-no-meaning',
        points: [{
            timestamp: 1465552800000,
            value: -9
        }],
        meaning: 'null',
        path: 'fake-path'
    }]
};

export default historyData;
