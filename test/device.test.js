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
            owner: 'fakeOwner'

        }

        deviceInstance = new Device(fakeDevice, fakeConfig);

        this.xhr = sinon.useFakeXMLHttpRequest();
        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

    });

    describe('#updateDevice', function() {

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
            beforeEach(function() {
                sandbox = sinon.sandbox.create();
                sandbox.stub(mqtt, 'connect').returns(new Promise((resolve) => {
                    resolve();
                }));

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
                    mqttSingleton._topics['fake-topic'].subscribers.forEach(function(sub) {
                        sub(({ data: 'fake-reading' }));
                    });
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
            deviceInstance.getHistoricalData({
                period: '1m'
            });

            expect(deviceInstance.history.getHistoricalData).to.have.been.calledOnce;
            expect(deviceInstance.history.getHistoricalData).to.have.been.calledWith({
                period: '1m'
            });
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
            deviceInstance.id = null;
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

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleState));
        });
    });

    describe('#getDeviceConfiguration', function() {

        let sampleConfiguration = {
            "configurations": ['something']
        }

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.getDeviceConfigurations();
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct object describing the configurations', function(done) {
            let response;

            deviceInstance.getDeviceConfigurations().then((response) => {
                expect(response).to.deep.equal(sampleConfiguration);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleConfiguration));
        });
    });

    describe('#setDeviceConfigurations', function() {
        let schema = {
            'path': 'somePath',
            'name': 'someName',
            'value': 'someValue'
        }

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.setDeviceConfigurations(schema);
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of parameters at all to update', function() {
            var fn = function() {
                deviceInstance.setDeviceConfigurations();
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            var fn = function() {
                deviceInstance.setDeviceConfigurations(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should give relevant parameters to update on a device in the body', function() {
            let body = {
                pets: 'unicorn',
                abilities: 'flying'
            };

            var fn = function() {
                deviceInstance.setDeviceConfigurations(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should add an item to the configurations array', function() {
            deviceInstance.configurations[0] = {
                'path': 'somePath1',
                'name': 'someName1',
                'value': 'someValue1'
            }
            let response;

            let sampleConfig = [schema];
            deviceInstance.setDeviceConfigurations(schema).then((response) => {
                expect(deviceInstance.configurations.length).to.equal(2);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleConfig));
        });

        it('should have the last item in the config array be the one you just added', function(done) {
            let response;

            let sampleConfig = [schema];
            deviceInstance.setDeviceConfigurations(schema).then((response) => {
                expect(response).to.deep.equal(sampleConfig);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleConfig));

        });

    });

    describe('#getDeviceCommands', function() {

        let sampleCommands = {
            "commands": ['do it']
        }

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.getDeviceCommands();
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct object describing state', function(done) {
            let response;

            deviceInstance.getDeviceCommands().then((response) => {
                expect(response).to.deep.equal(sampleCommands);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleCommands));
        });
    });

    describe('#setDeviceCommands', function() {
        let cmd = {
            'path': 'somePath',
            'name': 'someName',
            'value': 'someValue'
        }

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.setDeviceCommands(cmd);
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of parameters at all to set', function() {
            var fn = function() {
                deviceInstance.setDeviceCommands();
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            var fn = function() {
                deviceInstance.setDeviceCommands(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should give relevant parameters to set for the commands in the body', function() {
            let body = {
                pets: 'unicorn',
                abilities: 'flying'
            };

            var fn = function() {
                deviceInstance.setDeviceCommands(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should add an item to the commands array', function() {
            deviceInstance.commands[0] = {
                'path': 'somePath1',
                'name': 'someName1',
                'value': 'someValue1'
            }

            let response;

            let sampleConfig = [cmd];
            deviceInstance.setDeviceCommands(cmd).then((response) => {
                expect(deviceInstance.commands.length).to.equal(2);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleConfig));
        });

        it('should have the last item in the command array be the one you just added', function(done) {
            let response;

            let sampleConfig = [cmd];
            deviceInstance.setDeviceCommands(cmd).then((response) => {
                expect(response).to.deep.equal(sampleConfig);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleConfig));

        });

    });

    describe('#getDeviceMetadata', function() {

        let sampleMetadata = {
            "metadata": {
                'data': 'metaaaaaa'
            }
        }

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.getDeviceMetadata();
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct object describing Metadata', function(done) {
            let response;

            deviceInstance.getDeviceMetadata().then((response) => {
                expect(response).to.deep.equal(sampleMetadata);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleMetadata));
        });
    });

    describe('#setDeviceMetadata', function() {
        let meta = {
            'data': 'metaaaaaa'
        }

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.setDeviceMetadata(meta);
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of metadata at all to update', function() {
            var fn = function() {
                deviceInstance.setDeviceMetadata();
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            var fn = function() {
                deviceInstance.setDeviceMetadata(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should replace the previous metadata with the one you just set', function(done) {
            let response;

            deviceInstance.metadata = {
                'data': 'this that or the other thing'
            };

            deviceInstance.setDeviceMetadata(meta).then((response) => {
                expect(deviceInstance.metadata).to.deep.equal(meta);
                done()
            });

            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(meta));

        });

    });

    describe('#deleteDeviceMetadata', function() {
        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.id = null;
            var fn = function() {
                deviceInstance.deleteDeviceMetadata();
            };
            expect(fn).to.throw(Error);
        });

        it('should delete the metadata ', function(done) {
            let data = {}
            deviceInstance.deleteDeviceMetadata(data).then((response) => {
                expect(response).to.be.defined;
                done();
            });

            //this is the api
            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(data));
        });

    });

});