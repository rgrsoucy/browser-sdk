import Device from '../entities/Device.js';
import DeviceHistory from '../entities/history/DeviceHistory.js';

import readingFixture from './fixtures/devices/readings.fixture';

let MQTTMock = {
    subscribe: function() {},
    connect: function() {}
};
Device.__Rewire__('mqtt', MQTTMock);
Device.__Rewire__('sharedChannel', {
    credentials: {}
});

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var expect = chai.expect;
chai.use(sinonChai);
let deviceInstance;
let fakeConfig;
let fakeDevice;

describe('Device', function() {
    beforeEach(function() {
        fakeConfig = {
            ajax: {
                url: 'fakeURL',
                token: '12345',
                tokenType: 'Bearer'
            }
        };

        fakeDevice = {
            id: 'fakeDeviceId',
            name: 'fakeDeviceName',
            modelId: 'fakeModel',
            owner: 'fakeOwner',
            openToPublic: false,
        }

        deviceInstance = new Device(fakeDevice, fakeConfig);

        this.xhr = sinon.useFakeXMLHttpRequest();
        // console.log(this.xhr);
        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

    });

    describe('#updateDevice', function() {
        // beforeEach(function() {});

        it('should throw an error if no device id given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.updateDevice();
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of parameters at all to update', function() {
            var fn = function() {
                deviceInstance.updateDevice();
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            var fn = function() {
                deviceInstance.updateDevice(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should give relevant parameters to update on a device in the body', function() {
            let body = {
                pets: 'unicorn',
                abilities: 'flying'
            };

            var fn = function() {
                deviceInstance.updateDevice(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct updated device object based on multiple changes', function(done) {
            let patch = {
                owner: 'bob',
                name: 'Im a thing'
            }
            let response;

            deviceInstance.ajax.customXHR = this.xhr;

            deviceInstance.updateDevice(patch, true).then((response) => {
                //console.log(response);
                expect(patch).to.deep.equal(response);
                done();
            });

            //this is the api
            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(patch));
        });
    });

    describe('#getDeviceState', function() {
        //does this still exist?
    });

    describe('#deleteDevice', function() {
        it('should throw an error if no device Id given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.deleteDevice();
            };
            expect(fn).to.throw(Error);
        });

        it('should delete the deviceInstance', function(done) {
            let data = {}

            deviceInstance.ajax.customXHR = this.xhr;
            deviceInstance.deleteDevice(data).then((response) => {
                expect(response).to.be.defined;
                done();
            });

            //this is the api
            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(data));
        });

    });

    describe('#sendCommand', function() {

        it('should throw an error if no device Id given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.sendCommand();
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of parameters at all to send a command', function() {
            var fn = function() {
                deviceInstance.sendCommand();
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            var fn = function() {
                deviceInstance.sendCommand(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should give relevant parameters to send a command in the body', function() {
            let body = {
                pets: 'unicorn',
                abilities: 'flying'
            };

            var fn = function() {
                deviceInstance.sendCommand(body);
            };
            expect(fn).to.throw(Error);
        });

    });

    describe('#connect', function() {

        it('should give back channel credentials', function(done) {
            let credentialsStub = {
                "channelId": "50a66b82-cb538",
                "id": "1234",
                "credentials": {
                    "user": "2b6:3b383d97-82dc6a",
                    "password": "vcGqoSr",
                    "clientId": "502139731",
                    "topic": "/v1/50a66c96-bac80"
                }
            }

            deviceInstance.id = "1234"

            deviceInstance.getChannel().then((credentials) => {
                expect(credentials).to.deep.equal(credentialsStub);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(credentialsStub));
        });

        describe('on sucessful connection', function() {
            let sandbox;
            let connectionCb;
            beforeEach(function() {
                sandbox = sinon.sandbox.create();
                sandbox.stub(MQTTMock, 'connect').returns(new Promise((resolve) => {
                    resolve();
                }));

                sandbox.stub(MQTTMock, 'subscribe', function(topic, cb) {
                    connectionCb = cb;
                });

                deviceInstance._channelCredentials = {
                    credentials: {
                        topic: 'fake-topic'
                    }
                };
            });

            afterEach(function() {
                sandbox.restore();
            });

            it('should setup a connection with channel credentials over mqtt', function(done) {
                deviceInstance.connect().then(() => {
                    done();
                });
            });

            it('should notify data listeners with data from mqtt', function(done) {
                deviceInstance.connect().then(function(connection) {
                    connection.on('data', function(message) {
                        expect(message).to.deep.equal({ data: 'fake-reading' });
                        done();
                    });
                    connectionCb({ data: 'fake-reading' });
                });

            });
        });

    });

    describe('getHistoricalData', function() {
        let sandbox;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            sandbox.spy(deviceInstance.history, 'getHistoricalData');
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('create a instance of device history ', function() {
            expect(deviceInstance.history).to.be.instanceof(DeviceHistory);
        })

        it('should get historical data from device history object', function() {
            deviceInstance.getHistoricalData({ period: '1m' });

            expect(deviceInstance.history.getHistoricalData).to.have.been.calledOnce;
            expect(deviceInstance.history.getHistoricalData).to.have.been.calledWith({ period: '1m' });
        });
    });

    describe('#getReadings', function() {
        it('should throw an error if no device Id given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.getReadings();
            };
            expect(fn).to.throw(Error);
        });

        it('should get the data from the device/readings resource', function() {
            deviceInstance.getReadings();

            expect(this.requests[0].url).to.contain('/devices/fakeDeviceId/readings');
        });

        describe('on success', function() {
            it('should resolve promise with the list of the readings', function(done) {
                deviceInstance.getReadings().then(function(response) {
                    expect(response).to.be.deep.equal(readingFixture);
                    done();
                });

                this.requests[0].respond(200, {
                    'Content-Type': 'text/json'
                }, JSON.stringify(readingFixture));
            });
        });

        describe('on failure', function() {
            it('should fail promise error message', function() {
                deviceInstance.getReadings().then(() => {}, function(d) {
                    expect(JSON.parse(d.response).message).to.be.deep.equal('oh noes');
                    done();
                });

                this.requests[0].respond(404, {
                    'Content-Type': 'text/json'
                }, JSON.stringify({
                    message: 'oh noes'
                }));
            });
        });
    });

});
