
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Ajax from '../../../tools/ajax';
import DeviceHistory from '../../../entities/history/DeviceHistory.js';

var expect = chai.expect;
chai.use(sinonChai);

global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

const fakeConfig = {
    deviceId: 'fakeDeviceId',
    ajax: {
        url: 'fakeURL',
        dataUrl: 'http://test-data.example.com',
        token: '12345',
        tokenType: 'Bearer'
    }
};

let deviceHistoryInstance;

describe('DeviceHistory', function() {
    beforeEach(function() {

        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

        deviceHistoryInstance = new DeviceHistory(fakeConfig);
    });

    describe('#getHistoricalData', function() {
        it('should get data from the data url', function() {
            deviceHistoryInstance.getHistoricalData();

            expect(this.requests[0].url).to.be.equal('http://test-data.example.com/history/devices/fakeDeviceId');
        });

        it('should request data from the specified device', function() {
            deviceHistoryInstance.getHistoricalData();

            expect(this.requests[0].url).to.contain('fakeDeviceId');
        });

        describe('parameters', function() {
            it('should set end as end UNIX ms', function() {
                deviceHistoryInstance.getHistoricalData({
                    end: new Date(1985, 10, 9)
                });

                expect(this.requests[0].url).to.contain('end=500338800000');
            });
        });

    });
});
