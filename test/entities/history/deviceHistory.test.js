import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import DeviceHistory from '../../../src/entities/history/DeviceHistory.js';
import DeviceHistoryFixture from '../../fixtures/history';

const expect = chai.expect;
chai.use(sinonChai);

global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

const fakeConfig = {
    ajax: {
        protocol: 'http://',
        uri: 'test-api.example.com',
        token: '12345',
        tokenType: 'Bearer'
    }
};

let deviceHistoryInstance;

describe('DeviceHistory', function() {
    let requestCb = function() {
    };
    beforeEach(function() {

        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];

        this.xhr.onCreate = (xhr) => {
            this.requests.push(xhr);
            requestCb(xhr);
        };

        deviceHistoryInstance = new DeviceHistory({
            id: 'fakeDeviceId'
        }, fakeConfig);
    });

    describe('#getHistoricalRawData', function() {
        it('should get data from the url', function() {
            deviceHistoryInstance.getHistoricalRawData();

            expect(this.requests[0].url).to.contain('https://test-api.example.com/devices/fakeDeviceId/raw-readings');
        });

        it('should request data from the specified device ID', function() {
            deviceHistoryInstance.getHistoricalRawData();

            expect(this.requests[0].url).to.contain('fakeDeviceId');
        });

        describe('parameters', function() {
            it('should set end as end ISO', function() {
                deviceHistoryInstance.getHistoricalRawData({
                    end: new Date('1985-10-25T13:30:00.000Z')
                });

                expect(this.requests[0].url).to.contain('end=1985-10-25T13%3A30%3A00.000Z');
            });

            it('should set start as start ISO', function() {
                deviceHistoryInstance.getHistoricalRawData({
                    start: new Date('1955-11-04T13:30:00.000Z')
                });

                expect(this.requests[0].url).to.contain('start=1955-11-04T13%3A30%3A00.000Z');
            });

            it('should pass meaning query parameter', function() {
                deviceHistoryInstance.getHistoricalRawData({
                    meaning: 'something'
                });

                expect(this.requests[0].url).to.contain('meaning=something');
            });

            it('should pass path query parameter', function() {
                deviceHistoryInstance.getHistoricalRawData({
                    path: 'some-path'
                });

                expect(this.requests[0].url).to.contain('path=some-path');
            });

            describe('on success', function() {
                describe('points object', function() {
                    let historyResponse;
                    beforeEach(function(done) {
                        deviceHistoryInstance.getHistoricalRawData({
                            meaning: 'fake-meaning',
                            path: 'fake-path',
                            start: new Date('1955-11-04T13:30:00.000Z'),
                            end: new Date('1985-10-25T13:30:00.000Z')
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
                });
            });
            describe('on failure', function() {
                it('should reject the promise with error message', function(done) {
                    deviceHistoryInstance.getHistoricalRawData({
                        meaning: 'fake-meaning'
                    }).then(() => {}, (m) => {
                        const obj = JSON.parse(m.response);
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

    describe('#getHistoricalData', function() {
        it('should get data from the url', function() {
            deviceHistoryInstance.getHistoricalData();

            expect(this.requests[0].url).to.contain('https://test-api.example.com/devices/fakeDeviceId/aggregated-readings');
        });

        it('should request data from the specified device', function() {
            deviceHistoryInstance.getHistoricalData();

            expect(this.requests[0].url).to.contain('fakeDeviceId');
        });

        describe('parameters', function() {
            it('should set end as end ISO', function() {
                deviceHistoryInstance.getHistoricalData({
                    end: new Date('1985-10-25T13:30:00.000Z')
                });

                expect(this.requests[0].url).to.contain('end=1985-10-25T13%3A30%3A00.000Z');
            });

            it('should set start as start ISO', function() {
                deviceHistoryInstance.getHistoricalData({
                    start: new Date('1955-11-04T13:30:00.000Z')
                });

                expect(this.requests[0].url).to.contain('start=1955-11-04T13%3A30%3A00.000Z');
            });

            it('should pass sample time as interval query parameter', function() {
                deviceHistoryInstance.getHistoricalData({
                    sample: '1h'
                });

                expect(this.requests[0].url).to.contain('interval=1h');
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

            it('should pass meaning query parameter', function() {
                deviceHistoryInstance.getHistoricalData({
                    meaning: 'something'
                });

                expect(this.requests[0].url).to.contain('meaning=something');
            });

            it('should pass path query parameter', function() {
                deviceHistoryInstance.getHistoricalData({
                    path: 'some-path'
                });

                expect(this.requests[0].url).to.contain('path=some-path');
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
                    const startTime = new Date('1955-10-05T13:30:00.000Z');
                    this.clock = sinon.useFakeTimers(startTime.getTime());
                });

                afterEach(function() {
                    this.clock.restore();
                });

                it('one month, it should set start -> end to one month and sampling to 1d', function() {
                    deviceHistoryInstance.getHistoricalData({
                        periode: '1m'
                    });

                    expect(this.requests[0].url).to.contain('start=' + ('1955-09-05T13%3A30%3A00.000Z'));
                    expect(this.requests[0].url).to.contain('end=' + ('1955-10-05T13%3A30%3A00.000Z'));
                    expect(this.requests[0].url).to.contain('interval=1h');
                });

                it('1 day, it should set start -> end to 1 day and sampling to 1h', function() {
                    deviceHistoryInstance.getHistoricalData({
                        periode: '1d'
                    });

                    expect(this.requests[0].url).to.contain('start=' + ('1955-10-04T13%3A30%3A00.000Z'));
                    expect(this.requests[0].url).to.contain('end=' + ('1955-10-05T13%3A30%3A00.000Z'));
                    expect(this.requests[0].url).to.contain('interval=1m');
                });
            });

            describe('on success', function() {
                describe('points object', function() {
                    let historyResponse;
                    beforeEach(function(done) {
                        deviceHistoryInstance.getHistoricalData({
                            periode: '1m',
                            meaning: 'fake-meaning',
                            path: 'fake-path'
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

                    it('should have all the points from one reading', function() {
                        expect(historyResponse.points.get('fake-meaning', 'fake-path')[0]).to.be.an('object');
                        expect(historyResponse.points.get('fake-meaning', 'fake-path')[0]).to.deep.equal({
                            timestamp: '2016-09-06T19:00:00.000Z',
                            avg: 93.07814412491575,
                            max: 93.07814412491575,
                            min: 93.07814412491575
                        });
                    });
                });
            });
            describe('on failure', function() {
                it('should reject the promise with error message', function(done) {
                    deviceHistoryInstance.getHistoricalData({
                        periode: '1m'
                    }).then(() => {}, (m) => {
                        const obj = JSON.parse(m.response);
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
    describe('#getAllHistoricalData', function() {
        beforeEach(function() {
            requestCb = (request) => {
                // Needs to be done async
                setTimeout(function() {
                    request.respond(204, {
                        'Content-Type': 'application/json'
                    }, JSON.stringify({
                        data: [
                            {
                                avg: 95.54889362741321,
                                max: 95.54889362741321,
                                min: 95.54889362741321,
                                timestamp: '2016-09-07T03:00:00.000Z'
                            },
                            {
                                avg: 99.96942368795737,
                                max: 100,
                                min: 99.93884737591476,
                                timestamp: '2016-09-07T11:00:00.000Z'
                            }
                        ]
                    }));
                }, 0);
            };
        });

        it('should get all pages', function() {
            return deviceHistoryInstance.getAllHistoricalData({
                periode: '1m'
            }).then(() => {
                expect(this.requests.length).to.equal(1);
            });
        });

        it('should notify listener on when data is coming in for each page', function() {
            const pageListener = sinon.spy();
            return deviceHistoryInstance.getAllHistoricalData({
                periode: '1m',
                onDataReceived: pageListener
            }).then(() => {
                expect(pageListener).to.have.been.calledOnce;
            });
        });

        it('should pass query options', function() {
            deviceHistoryInstance.getAllHistoricalData({
                start: new Date(1985, 10, 1, 0, 0),
                end: new Date(1988, 8, 31, 0, 0),
                sample: '1d'
            });

            expect(this.requests[0].url).to.contain('interval=');
            expect(this.requests[0].url).to.contain('start=');
            expect(this.requests[0].url).to.contain('end=');
        });
    });
});
