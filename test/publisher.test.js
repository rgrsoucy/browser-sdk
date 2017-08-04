import Publisher from '../src/entities/Publisher.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var expect = chai.expect;
chai.use(sinonChai);

let publisherInstance;
let fakeConfig;
let myPublisherStub = null;
let myPublisherSpy = null;

describe('Publisher', function() {
    beforeEach(function() {
        myPublisherStub = sinon.stub();//generic stub
        myPublisherSpy = sinon.spy();//generic stub
        Publisher.__Rewire__('ajax', {
            url: 'fakeURL',
            token: '12345',
            tokenType: 'Bearer',
            patch:myPublisherStub,
            delete: myPublisherSpy,
            post: myPublisherSpy
        });

        fakeConfig = {
            name:'initial fake name',
            id:'initial fake Id'
        };

        publisherInstance = new Publisher(fakeConfig);

        myPublisherStub.returns({
            then: (resolve) => resolve({
                id:'initial fake Id',
                name:'fake',
                owner:'fake'
            }) //fakey promise, resolves with predefined response
        });
    });

    describe('#updatePublisher', function() {

        it('should throw an error if no id given to look up', function() {
            var fn = function() {
                publisherInstance.updatePublisher(null, {});
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of parameters at all to update', function() {
            var fn = function() {
                publisherInstance.updatePublisher('fakeId', null);
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            var fn = function() {
                publisherInstance.updatePublisher(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should give relevant parameters to update on a Publisher in the body', function() {
            let body = {
                pets: 'unicorn',
                abilities: 'flying'
            };

            var fn = function() {
                publisherInstance.updatePublisher(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should successfully update publisherInstance based on the response', function(done) {
            let body = {
                name:'fake',
                owner:'fake'
            };

            publisherInstance.updatePublisher(body).then((res) => {
                expect(publisherInstance).to.deep.equal({
                    config:fakeConfig,
                    name:'fake',
                    publisherId:'initial fake Id',
                    owner:'fake'
                });
                done();
            });

        });
    });

    describe('#deletePublisher', function() {
        it('should hit the delete endpoint', function(done) {
            publisherInstance.deletePublisher()
                .catch(e => {
                    expect(e).to.be.ok;
                    expect(myPublisherSpy).to.be.calledOnce;
                    done();
                });
        });

        it('should throw an error if no id present', function() {
            publisherInstance.publisherId = null;
            var fn = function() {
                publisherInstance.deletePublisher();
            };
            expect(fn).to.throw(Error);
        });
    });

    describe('#newPublisher', function() {
        let body = {
            name:'fakename',
            owner:'something fake'
        };

        it('should hit the post endpoint', function(done) {
            publisherInstance.newPublisher(body)
                .catch(e => {
                    expect(e).to.be.ok;
                    expect(myPublisherSpy).to.be.calledOnce;
                    done();
                });
        });

        it('should throw an error if no id present', function() {
            publisherInstance.publisherId = null;
            var fn = function() {
                publisherInstance.newPublisher();
            };
            expect(fn).to.throw(Error);
        });
    });
});
