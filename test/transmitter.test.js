import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { beforeEach, describe, it } from 'mocha';
import Transmitter from '../src/entities/Transmitter.js';

const expect = chai.expect;
chai.use(sinonChai);

let transmitterInstance;
let fakeConfig;


describe('Transmitter', function() {
    beforeEach(function() {
        fakeConfig = {
            id: 'fakeID',
            secret: 'fakeSecret',
            name: 'fakeTransmitterName',
            topic: 'fakeTopic',
            owner: 'fakeOwner',
            integrationType: 'fakeIntegrationType',
            ajax: {
                url: 'fakeURL',
                token: '12345',
                tokenType: 'Bearer'
            }
        };

        transmitterInstance = new Transmitter(fakeConfig);
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

        this.xhr = sinon.useFakeXMLHttpRequest();
        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);
    });

    describe('#updateTransmitter', function() {

        it('should throw an error if no id given to look up', function() {
            transmitterInstance.id = null;
            const fn = function() {
                transmitterInstance.updateTransmitter();
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of parameters at all to update', function() {
            const fn = function() {
                transmitterInstance.updateTransmitter();
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            const fn = function() {
                transmitterInstance.updateTransmitter(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should give relevant parameters to update on a transmitter in the body', function() {
            let body = {
                pets: 'unicorn',
                abilities: 'flying'
            };

            const fn = function() {
                transmitterInstance.updateTransmitter(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should return the correct updated transmitter object based on multiple changes', function(done) {
            let patch = {
                owner: 'bob',
                name: 'Im a thing'
            };

            transmitterInstance.updateTransmitter(patch, {}).then((response) => {
                expect(patch).to.deep.equal(response);
                done();
            });

            // this is the api
            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(patch));
        });
    });


    describe('#deleteTransmitter', function() {
        it('should throw an error if no id given to look up', function() {
            transmitterInstance.id = null;
            const fn = function() {
                transmitterInstance.deleteTransmitter();
            };
            expect(fn).to.throw(Error);
        });

        it('should delete the transmitterInstance', function(done) {
            let data = {};

            transmitterInstance.deleteTransmitter(data).then((response) => {
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
