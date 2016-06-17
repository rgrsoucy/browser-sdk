
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Ajax from '../../../tools/ajax';
import DeviceHistory from '../../../entities/history/DeviceHistory.js';

import DeviceHistoryFixture from '../../fixtures/history/history';

var expect = chai.expect;
chai.use(sinonChai);

global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

const fakeConfig = {
    id: 'fakeDeviceId',
    ajax: {
        url: 'fakeURL',
        dataUri: 'http://test-data.example.com',
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

            expect(this.requests[0].url).to.contain('http://test-data.example.com/history/devices/fakeDeviceId');
        });

        it('should request data from the specified device', function() {
            deviceHistoryInstance.getHistoricalData();

            expect(this.requests[0].url).to.contain('fakeDeviceId');
        });

        describe('parameters', function() {
            it('should set end as end UNIX ms', function() {
                deviceHistoryInstance.getHistoricalData({
                    end: new Date(1985, 9, 26)
                });

                expect(this.requests[0].url).to.contain('end=499129200000');
            });

            it('should set start as end UNIX ms', function() {
                deviceHistoryInstance.getHistoricalData({
                    start: new Date(1955, 10, 5)
                });

                expect(this.requests[0].url).to.contain('start=-446778000000');
            });

            it('should pass sample time as query parameter', function() {
                deviceHistoryInstance.getHistoricalData({
                    sample: '1h'
                });

                expect(this.requests[0].url).to.contain('sample=1h');
            });

            it('should pass offset as query parameter', function() {
                deviceHistoryInstance.getHistoricalData({
                    offset: 10
                });

                expect(this.requests[0].url).to.contain('offset=10');
            });

            it('should pass limit as query parameter', function() {
                deviceHistoryInstance.getHistoricalData({
                    limit: 99
                });

                expect(this.requests[0].url).to.contain('limit=99');
            });

            it('should default not to contain sample, start, end as query parames', function() {
                deviceHistoryInstance.getHistoricalData({});

                expect(this.requests[0].url).not.to.contain('sample=');
                expect(this.requests[0].url).not.to.contain('start=');
                expect(this.requests[0].url).not.to.contain('end=');
            });

            it('should default to contain, default, offset and limit', function() {
                deviceHistoryInstance.getHistoricalData({});

                expect(this.requests[0].url).to.contain('offset=0');
                expect(this.requests[0].url).to.contain('limit=1000');
            });

            describe('periode', function() {
                beforeEach(function() {
                    var startTime = new Date(1955, 10, 5, 12);
                    this.clock = sinon.useFakeTimers(startTime.getTime());
                });

                afterEach(function() {
                    this.clock.restore();
                });

                it('one month, it should set start -> end to one month and sampling to 1d', function() {
                    deviceHistoryInstance.getHistoricalData({
                        periode: '1m'
                    });

                    expect(this.requests[0].url).to.contain('start=' + (new Date(1955, 9, 5, 13)).getTime());
                    expect(this.requests[0].url).to.contain('end=' + (new Date(1955, 10, 5, 12)).getTime());
                    expect(this.requests[0].url).to.contain('sample=1h');
                });

                it('1 day, it should set start -> end to 1 day and sampling to 1h', function() {
                    deviceHistoryInstance.getHistoricalData({
                        periode: '1d'
                    });

                    expect(this.requests[0].url).to.contain('start=' + (new Date(1955, 10, 4, 12)).getTime());
                    expect(this.requests[0].url).to.contain('end=' + (new Date(1955, 10, 5, 12)).getTime());
                    expect(this.requests[0].url).to.contain('sample=1m');
                });
            });

            describe('on success', function() {
                describe('points object', function() {
                    let historyResponse;
                    beforeEach(function(done) {
                        deviceHistoryInstance.getHistoricalData({
                            periode: '1m'
                        }).then((obj) => {
                            historyResponse = obj;
                            done();
                        });

                        this.requests[0].respond(204, {
                            'Content-Type': 'application/json'
                        }, JSON.stringify(DeviceHistoryFixture));
                    });

                    it('should keep the original response', function() {
                        expect(historyResponse.response).to.be.deep.equal(DeviceHistoryFixture);
                    });

                    it('should contain the device Id', function() {
                        expect(historyResponse.points.get('fake-meaning', 'fake-path').id).to.be.equal('fake-history-device-id');
                    });


                    it('should have all the points from one reading', function() {
                        expect(historyResponse.points.get('fake-meaning', 'fake-path').points[0]).to.be.an('object');
                        expect(historyResponse.points.get('fake-meaning', 'fake-path').points[0]).to.deep.equal({
                            timestamp: 1465552800000,
                            value: 49.2680925420364
                        });
                    });

                    it('should work when the reading does not have a path', function() {
                        expect(historyResponse.points.get('fake-meaning', null).id).to.be.equal('fake-history-device-id-no-path');
                    });

                    it('should work when the reading does not have a meaning', function() {
                        expect(historyResponse.points.get(null, 'fake-path').id).to.be.equal('fake-history-device-id-no-meaning');
                    });
                });

            });
            describe('on failure', function() {
                it('should reject the promise with error message', function(done) {
                    deviceHistoryInstance.getHistoricalData({
                        periode: '1m'
                    }).then(() => {}, (m) => {
                        var obj = JSON.parse(m.response);
                        expect(obj.message).to.equal('oh noes');
                        done();
                    });

                    this.requests[0].respond(404, {
                        'Content-Type': 'application/json'
                    }, JSON.stringify({
                        message: 'oh noes'
                    }));
                });
            });

        });

    });
});
