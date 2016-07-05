import User from '../src/entities/User.js';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
var expect = chai.expect;
chai.use(sinonChai);
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

let userInstance;
let fakeConfig;
let userStub;
let devicesStub;

describe('User', function() {
    beforeEach(function() {
        fakeConfig = {
            ajax: {
                url: 'http://123',
                token: '123',
                tokenType: 'Bears'
            }
        };

        userInstance = new User(fakeConfig);

        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

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
                expect(userInfo).to.deep.equal(userStub);
                done();
            });


            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(userStub));
        });
    });

    describe('#getAllMyDevices', function() {

        beforeEach(function() {
            userStub = {
                id: '123',
                email: 'john@doe',
                name: 'billy'
            };

            devicesStub = [{
                id: 'fakeDeviceId',
                name: 'fakeDeviceName1',
                modelId: 'fakeModel',
                owner: 'fakeOwner'

            }, {
                id: 'fakeDeviceId2',
                name: 'fakeDeviceName2',
                modelId: 'fakeModel',
                owner: 'fakeOwner'

            }]

        });

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
            }, 1);
        });

        it('should get all devices as classes', function(done) {
            userInstance.userInfo = userStub;
            userInstance.getMyDevices({
                asClasses: true
            }).then((devices) => {
                expect(devices[0]).to.have.property("rawDevice");
                done();
            });

            setTimeout(() => {
                //give some time for the async userInfo cache to take effect
                this.requests[0].respond(200, {
                    'Content-Type': 'text/json'
                }, JSON.stringify(devicesStub));
            }, 1);
        });

    });
});