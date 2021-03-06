import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import User from '../src/entities/User.js';
import { ajax } from '../src/tools/ajax.js';

const expect = chai.expect;
chai.use(sinonChai);

let userInstance;
let fakeConfig;

const userStub = {
    id: '123',
    email: 'john@doe',
    name: 'billy'
};

const devicesStub = [{
    id: 'fakeDeviceId',
    name: 'fakeDeviceName1',
    modelId: 'fakeModel',
    owner: 'fakeOwner'

}, {
    id: 'fakeDeviceId2',
    name: 'fakeDeviceName2',
    modelId: 'fakeModel',
    owner: 'fakeOwner'
}];

let oldToken;
describe('User', function() {
    beforeEach(function() {
        fakeConfig = {
            ajax: {
                url: 'http://123',
                token: '123',
                tokenType: 'Bears'
            }
        };

        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

        userInstance = new User(fakeConfig);

        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

        oldToken = ajax.options.token;
        ajax.options.token = 'fake-token';
    });

    afterEach(function() {
        ajax.options.token = oldToken;
    });

    describe('#getUserInfo', function() {
        it('should get the current config', function() {
            expect(userInstance._getConfig()).to.deep.equal(fakeConfig);
        });

        it('should resolve a promise with user info', function(done) {
            let userStub = {
                id: '123',
                email: 'john@doe',
                name: 'billy'
            };

            userInstance.getUserInfo().then((userInfo) => {
                expect(userInfo.id).to.equal('123');
                expect(userInfo.email).to.equal('john@doe');
                expect(userInfo.name).to.equal('billy');
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(userStub));
        });

        it('should attach the user token the user info', function(done) {
            ajax.options.token = 'test-token';

            userInstance.getUserInfo().then((userInfo) => {
                expect(userInfo.token).to.deep.equal('test-token');
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify({}));
        });
    });

    describe('#getAllMyDevices', function() {

        it('should get all devices', function(done) {
            userInstance.userInfo = userStub;
            userInstance.getMyDevices().then((devices) => {
                expect(devices).to.deep.equal(devicesStub);
                done();
            });

            setTimeout(() => {
                //give some time for the async userInfo cache to take effect
                this.requests[0].respond(200, {
                    'Content-Type': 'text/json'
                }, JSON.stringify(devicesStub));
            }, 0);
        });

        it('should get all devices as classes', function(done) {
            userInstance.userInfo = userStub;
            userInstance.getMyDevices({
                asClasses: true
            }).then((devices) => {
                expect(devices[0]).to.have.property('rawDevice');
                done();
            });

            setTimeout(() => {
                //give some time for the async userInfo cache to take effect
                this.requests[0].respond(200, {
                    'Content-Type': 'text/json'
                }, JSON.stringify(devicesStub));
            }, 0);
        });

    });

    describe('#searchForDevices', function() {
        it('should search for devices', function() {
            userInstance.searchForDevices({
                query: { name: 'testur' }
            });

            expect(this.requests[0].url).to.have.string('.io/devices');
        });

        it('should throw an error if no search object has been provided', function() {
            let fn = function() {
                userInstance.searchForDevices({});
            };
            expect(fn).to.throw(Error);
        });

        it('should resolve promise with found devices', function(done) {
            userInstance.searchForDevices({
                query: { name: 'testur' }
            }).then((devices) => {
                expect(devices).to.deep.equal([devicesStub]);
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify({
                data: [devicesStub]
            }));
        });

        it('should be possible to get the devices as classes', function(done) {
            userInstance.searchForDevices({
                query: { name: 'testur' },
                asClasses: true,
            }).then((devices) => {
                expect(devices[0]).to.have.property('rawDevice');
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify({
                data: [devicesStub]
            }));
        });

        describe('query parameters', () => {
            it('should create a query object with correct properties', function() {
                userInstance.searchForDevices({
                    query: {
                        name: 'test-name',
                        description: 'test-description',
                        ids: ['my-id', 'my-second-id'],
                        modelId: 'my-model-id',
                        firmwareVersion: 'my-firmware',
                        owner: 'a-user-uuid',
                        shared: 'by-me'
                    }
                });

                const URL = this.requests[0].url;
                expect(URL).to.have.string('device_name=test-name');
                expect(URL).to.have.string('device_description=test-description');
                expect(URL).to.have.string('device_ids=my-id%2Cmy-second-id');
                expect(URL).to.have.string('model_id=my-model-id');
                expect(URL).to.have.string('firmware_version=my-firmware');
                expect(URL).to.have.string('owner=a-user-uuid');
                expect(URL).to.have.string('shared=by-me');
            });
        });
    });


    describe('#searchForDevicesEx', function() {
        it('should search for devices', function() {
            userInstance.searchForDevicesEx({
                query: { name: 'testur' }
            });

            expect(this.requests[0].url).to.have.string('.io/devices');
        });

        it('should throw an error if no search object has been provided', function() {
            let fn = function() {
                userInstance.searchForDevicesEx({});
            };
            expect(fn).to.throw(Error);
        });

        it('should resolve promise with found devices', function() {
            const promise = userInstance.searchForDevicesEx({
                query: { name: 'testur' }
            }).then((result) => {
                expect(result.devices).to.deep.equal([devicesStub]);
                expect(result.count).to.deep.equal(4);
                expect(result.links).to.deep.equal({
                    next: 'http://example.com?page=2'
                });
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify({
                data: [devicesStub],
                count: 4,
                links: { next: 'http://example.com?page=2' }
            }));

            return promise;
        });

        it('should be possible to get the devices as classes', function(done) {
            userInstance.searchForDevicesEx({
                query: { name: 'testur' },
                asClasses: true,
            }).then((result) => {
                expect(result.devices[0]).to.have.property('rawDevice');
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify({
                data: [devicesStub]
            }));
        });

        describe('query parameters', () => {
            it('should create a query object with correct properties', function() {
                userInstance.searchForDevicesEx({
                    query: {
                        name: 'test-name',
                        description: 'test-description',
                        ids: ['my-id', 'my-second-id'],
                        modelId: 'my-model-id',
                        firmwareVersion: 'my-firmware'
                    }
                });

                const URL = this.requests[0].url;
                expect(URL).to.have.string('device_name=test-name');
                expect(URL).to.have.string('device_description=test-description');
                expect(URL).to.have.string('device_ids=my-id%2Cmy-second-id');
                expect(URL).to.have.string('model_id=my-model-id');
                expect(URL).to.have.string('firmware_version=my-firmware');
            });
        });
    });


    describe('#getCachedDevices', function() {

        it('should return an empty array when there is no cache of devices', function(done) {
            userInstance.userInfo = userStub;


            userInstance.getCachedDevices().then((devicesCache) => {
                expect(devicesCache).to.deep.equal([]);
                done();
            });
        });

        it('should get cached devices when there are some to get', function(done) {
            userInstance.userInfo = userStub;

            userInstance.getMyDevices().then(() => {
                userInstance.getCachedDevices().then((devicesCache) => {
                    expect(devicesCache).to.deep.equal(devicesStub);
                    done();
                });
            });

            setTimeout(() => {
                //give some time for the async userInfo cache to take effect
                this.requests[0].respond(200, {
                    'Content-Type': 'text/json'
                }, JSON.stringify(devicesStub));
            }, 0);

        });
    });

    describe('#getMyApps', function() {

        it('should return an array of app objects', function() {
            const apiResponse =
                [{
                    'id': 'a1bf392f-0890-445a-b025-3d09316cd356',
                    'name': 'WB Data Board (WBDB)',
                    'description': 'The first APP to read the WB Sensors'
                },
                    {
                        'id': 'aaaaaaaa',
                        'name': 'fakething',
                        'description': 'it\'s a thing'
                    }];

            const apiPublishers = [{
                'id': 123
            },
                {
                    'id': 456
                }];
            userInstance.userInfo = userStub;

            // sinon.stub(ajax, 'get').resolves(apiResponse);
            sinon.stub(userInstance, 'getMyPublishers').resolves(apiPublishers);
            sinon.stub(userInstance, '_getPublisherApps').resolves(apiResponse);

            return userInstance.getMyApps().then((res) => {
                expect(res).to.deep.equal(apiResponse);

            });
        });
    });

    describe('#getMyPublishers', function() {

        it('should return an array of Publisher objects', function() {
            const apiResponse = [{
                'id': 'a1bf392f-0890-445a-b025-3d09316cd356',
                'name': 'WB Data Board (WBDB)'
            }, {
                'id': 'aaaaaaaa',
                'name': 'fakething'
            }];
            userInstance.userInfo = userStub;
            sinon.stub(ajax, 'get').resolves(apiResponse);

            return userInstance.getMyPublishers().then((res) => {
                expect(res).to.deep.equal(apiResponse);
            });
        });
    });
    describe('#_getPublisherApps', function() {

        it('should return an array of app objects', function() {
            const apiResponse = [{
                'id': 'a1bf392f-0890-445a-b025-3d09316cd356',
                'name': 'WB Data Board (WBDB)',
                'description': 'The first APP to read the WB Sensors'
            }, {
                'id': 'aaaaaaaa',
                'name': 'fakething',
                'description': 'it\'s a thing'
            }];
            const doubleResponse = apiResponse.concat(apiResponse);

            const apiPublishers = [{
                'id': 123
            }, {
                'id': 456
            }];
            userInstance.userInfo = userStub;
            ajax.get.resolves(apiResponse);

            return userInstance._getPublisherApps(apiPublishers).then((res) => {
                expect(res).to.deep.equal(doubleResponse);

            });
        });
    });
});
