import {
    mqtt
}
from '../tools/mqtt';
import Device from '../entities/Device.js';
import DeviceHistory from '../entities/history/DeviceHistory.js';

import readingFixture from './fixtures/devices/readings.fixture';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var expect = chai.expect;
chai.use(sinonChai);
let mqttSingleton = mqtt;
let deviceInstance;
let fakeConfig;
// let deviceStub;
// let fakeResolved;

describe('Device', function() {
    beforeEach(function() {
        fakeConfig = {
            deviceId: 'fakeDeviceId',
            name: 'fakeDeviceName',
            model: 'fakeModel',
            owner: 'fakeOwner',
            openToPublic: false,
            ajax: {
                url: 'fakeURL',
                token: '12345',
                tokenType: 'Bearer'
            }
        };

        // deviceStub = {
        //   deviceId: 'fakeDeviceId',
        //   name: 'newFakeDeviceName',
        //   model: 'fakeModel',
        //   owner: 'fakeOwner',
        //   openToPublic: true,
        //   ajax: {
        //     url: 'fakeURL',
        //     token: '12345',
        //     tokenType: 'Bearer'
        //   }
        // };

        deviceInstance = new Device(fakeConfig);

        this.xhr = sinon.useFakeXMLHttpRequest();
        // console.log(this.xhr);
        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);



        // fakeResolved = function(value) {
        //   return {
        //     then: function(callback) {
        //       callback(deviceStub);
        //     }
        //   }
        // }
        // sinon.stub(deviceInstance.ajax, "patch").returns(fakeResolved(deviceStub));

    });

    describe('#updateDevice', function() {
        // beforeEach(function() {});

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.deviceId = null;
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
        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.deviceId = null;
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

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.deviceId = null;
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
                "deviceId": "1234",
                "credentials": {
                    "user": "2b6:3b383d97-82dc6a",
                    "password": "vcGqoSr",
                    "clientId": "502139731",
                    "topic": "/v1/50a66c96-bac80"
                }
            }

            deviceInstance.deviceId = "1234"

            deviceInstance.getChannel().then((credentials) => {
                expect(credentials).to.deep.equal(credentialsStub);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(credentialsStub));
        });


        it('should connect to mqtt and return with a callback for events', function(done) {
            let credentialsStub = {
                "channelId": "50a66b82-cb538",
                "deviceId": "1234",
                "credentials": {
                    "user": "2b6:3b383d97-82dc6a",
                    "password": "vcGqoSr",
                    "clientId": "502139731",
                    "topic": "/v1/50a66c96-bac80"
                }
            }

            let fakeSensorReadings = {
                meaning: "temp",
                value: 50
            }

            deviceInstance._channelCredentials = credentialsStub

            deviceInstance.connect().then((connection) => {

                connection.on("data", (dataStream) => {

                    expect(dataStream).to.deep.equal(fakeSensorReadings)
                    done();
                })
            });


            let myTopic = credentialsStub.credentials.topic;

            function mockWSSEvent() {
                mqttSingleton._topics[myTopic].subscribers.forEach((subscriber) => {
                    subscriber(fakeSensorReadings)
                })
            }
            mockWSSEvent();
        });
    });

    // describe('#getAllDevices', function() {
    //   beforeEach(function() {

    //   });

    //   it('should throw an error if no deviceId given to look up', function() {
    //     deviceInstance.deviceId = null;
    //     var fn = function() {
    //       deviceInstance.getDevice();
    //     };
    //     expect(fn).to.throw(Error);
    //   });

    //   it('should hit ajax with the right options', function() {

    //   });

    //   it('should resolve the promise with an array of objects', function() {

    //   });

    //   it('should reject with the xhr object', function() {

    //   });


    // });

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
            deviceInstance.getHistoricalData({
                period: '1m'
            });

            expect(deviceInstance.history.getHistoricalData).to.have.been.calledOnce;
            expect(deviceInstance.history.getHistoricalData).to.have.been.calledWith({
                period: '1m'
            });
        });
    });
    describe('#getDeviceState', function() {

        let sampleState = {
            "readings": [{
                "path": "",
                "meaning": "",
                "value": "",
                "received": 12345
            }],
            "version": {
                "commands": {
                    "number": 0,
                    "ts": 12345
                },
                "configurations": {
                    "number": 0,
                    "ts": 12345
                },
                "readings": {
                    "number": 0,
                    "ts": 12345
                },
                "metadata": {
                    "number": 0,
                    "ts": 12345
                }
            },
            "metadata": {},
            "configurations": [],
            "commands": []
        }

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.deviceId = null;
            var fn = function() {
                deviceInstance.getDeviceState();
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct object describing state', function(done) {
            let response;

            deviceInstance.getDeviceState().then((response) => {
                expect(response).to.deep.equal(sampleState);
                done()
            });

<<<<<<< HEAD
            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(credentialsStub));
        });
    });
});
=======
    describe('#getReadings', function() {
        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.deviceId = null;
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
>>>>>>> 2.0.0-dev-readings
