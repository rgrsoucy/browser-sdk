import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { beforeEach, describe, it } from 'mocha';
import Group from '../src/entities/Group.js';

const expect = chai.expect;
chai.use(sinonChai);

let groupInstance;
let fakeConfig;


describe('Group', function() {
    beforeEach(function() {
        fakeConfig = {
            owner: 'fakeOwner',
            position: 99,
            id: 'fakeId',
            devices: [{
                dev1: 'device1'
            }, {
                dev2: 'device2'
            }],
            name: 'fakeName',
            ajax: {
                url: 'fakeURL',
                token: '12345',
                tokenType: 'Bearer'
            }
        };

        groupInstance = new Group(fakeConfig);

        this.xhr = sinon.useFakeXMLHttpRequest();
        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);
    });

    describe('#getGroup', function() {

        let sampleGroup = {
            owner: 'fakeOwner',
            position: 99,
            id: 'fakeId',
            devices: [{
                dev1: 'device1'
            }, {
                dev2: 'device2'
            }],
            name: 'fakeName'
        };

        it('should throw an error if no id given to look up', function() {
            groupInstance.id = null;
            const fn = function() {
                groupInstance.getGroup();
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct object describing the group', function(done) {
            groupInstance.getGroup().then((response) => {
                expect(response).to.deep.equal(sampleGroup);
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleGroup));
        });
    });

    describe('#getGroupDevices', function() {

        let sampleGroupDevices =
            [{
                dev1: 'device1'
            }, {
                dev2: 'device2'
            }];

        let sampleGroup = {
            owner: 'fakeOwner',
            position: 99,
            id: 'fakeId',
            devices: [{
                dev1: 'device1'
            }, {
                dev2: 'device2'
            }],
            name: 'fakeName'
        };

        it('should throw an error if no id given to look up', function() {
            groupInstance.id = null;
            const fn = function() {
                groupInstance.getGroupDevices();
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct array describing the groups devices', function(done) {
            groupInstance.getGroupDevices().then((response) => {
                expect(response).to.deep.equal(sampleGroupDevices);
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleGroup));
        });
    });

    describe('#updateGroup', function() {

        it('should throw an error if no id given to look up', function() {
            groupInstance.id = null;
            const fn = function() {
                groupInstance.updateGroup();
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of parameters at all to update', function() {
            const fn = function() {
                groupInstance.updateGroup();
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            const fn = function() {
                groupInstance.updateGroup(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should give relevant parameters to update on a group in the body', function() {
            let body = {
                pets: 'unicorn',
                abilities: 'flying'
            };

            const fn = function() {
                groupInstance.updateGroup(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct updated group object based on multiple changes', function(done) {
            let patch = {
                owner: 'bob',
                name: 'Im a thing'
            };

            groupInstance.updateGroup(patch, true).then((response) => {
                expect(patch).to.deep.equal(response);
                done();
            });

            //this is the api
            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(patch));
        });
    });


    describe('#deleteGroup', function() {
        it('should throw an error if no id given to look up', function() {
            groupInstance.id = null;
            const fn = function() {
                groupInstance.deleteGroup();
            };
            expect(fn).to.throw(Error);
        });

        it('should delete the groupInstance', function(done) {
            let data = {};

            groupInstance.deleteGroup(data).then((response) => {
                expect(response).to.be.ok;
                done();
            });

            // this is the api
            this.requests[0].respond(204, {
                'Content-Type': 'text/json'
            }, JSON.stringify(data));
        });

    });
});
