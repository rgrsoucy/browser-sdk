import App from '../src/entities/App.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var expect = chai.expect;
chai.use(sinonChai);

let appInstance;
let fakeConfig;
const myAppStub = sinon.stub();//generic stub
const myAppSpy = sinon.spy();//generic stub
App.__Rewire__('ajax', {
                url: 'fakeURL',
                token: '12345',
                tokenType: 'Bearer',
                patch:myAppStub,
                delete: myAppSpy,
                post: myAppSpy
            });

describe('App', function() {
    beforeEach(function() {
        fakeConfig = {
            name:'initial fake name',
            appId:'initial fake Id'
        };

        appInstance = new App(fakeConfig);

        myAppStub.returns({
            then: (resolve) => resolve({
                appId:'initial fake Id',
                name:'fake',
                description:'fake'
            }) //fakey promise, resolves with predefined response
        });
    });

    describe('#updateApp', function() {

        it('should throw an error if no id given to look up', function() {
            var fn = function() {
                appInstance.updateApp(null, {});
            };
            expect(fn).to.throw(Error);
        });

        it('should give a body of parameters at all to update', function() {
            var fn = function() {
                appInstance.updateApp('fakeId', null);
            };
            expect(fn).to.throw(Error);
        });

        it('should have something in the body', function() {
            let body = {};
            var fn = function() {
                appInstance.updateApp(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should give relevant parameters to update on a App in the body', function() {
            let body = {
                pets: 'unicorn',
                abilities: 'flying'
            };

            var fn = function() {
                appInstance.updateApp(body);
            };
            expect(fn).to.throw(Error);
        });

        it('should successfully update appInstance based on the response', function(done) {
            let body = {
                name:'fake',
                publisher:'fake'
            };

            appInstance.updateApp(body).then((res) => {
                expect(appInstance).to.deep.equal({
                    config:fakeConfig,
                    name:'fake',
                    appId:'initial fake Id',
                    description:'fake',
                    publisher:undefined,
                    redirectUri:undefined
                });
                done();
            });
            
        });
    });

    describe('#deleteApp', function() {
        it('should hit the delete endpoint', function() {
            appInstance.deleteApp();
            expect(myAppSpy).to.be.called.once;
        });

        it('should throw an error if no id present', function() {
            appInstance.appId = null;
            var fn = function() {
                appInstance.deleteApp();
            };
            expect(fn).to.throw(Error);
        });
    });

    describe('#newApp', function() {
        let body = {
            name:'fakename',
            description:'something fake',
            redirectUri:'www.fakeyourmom.com',
            publisher:'fakePub'
        };

        it('should hit the post endpoint', function() {
            appInstance.newApp(body);
            expect(myAppSpy).to.be.called.once;
        });

        it('should throw an error if no id present', function() {
            appInstance.appId = null;
            var fn = function() {
                appInstance.newApp();
            };
            expect(fn).to.throw(Error);
        });
    });
});
