import main, {
    User, Device, Model, Group, Transmitter
}
from '../src/main';
import DeviceClass from '../src/entities/Device';
import ModelClass from '../src/entities/Model';
import GroupClass from '../src/entities/Group';
import TransmitterClass from '../src/entities/Transmitter';
import { ajax } from '../src/tools/ajax'

let oauthMock = {
    token: 'fake-token',
    login: sinon.spy(),
    logout: sinon.spy()
};

main.__Rewire__('Oauth2', function() {
    return oauthMock;
});

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised';
var expect = chai.expect;

chai.use(sinonChai);
chai.use(chaiPromise);

describe('Main', function() {

    it('should export Device class under device', function() {        
        expect(Device).to.be.equal(DeviceClass);    
    });

    it('should export Group class under device', function() {        
        expect(Group).to.be.equal(GroupClass);    
    });

    it('should export Model class under device', function() {        
        expect(Model).to.be.equal(ModelClass);    
    });

    it('should export Transmitter class under device', function() {        
        expect(Transmitter).to.be.equal(TransmitterClass);    
    });

    describe('#authorize', function() {
        beforeEach(function() {
            main.init({
                id: 'fake-project-id'
            });
        });

        describe('no optionalToken is provided', function() {
            it('should login', function() {
                main.authorize();

                expect(oauthMock.login).to.have.beenCalled;
            });

            it('should update user with the user informaiton', function(done) {
                expect(main.authorize()).to.eventually.to.have.property('getUserInfo').notify(done);
            });

            it('should populate the new token', function(done) {
                main.authorize().then(() => {
                    expect(ajax.options.token).to.be.equal('fake-token');
                    done();
                });
            });
        });

        describe('optionalToken is provided', function() {
            beforeEach(function() {
                main.authorize('fake-provided-token');
            });

            it('should not login', function() {
                expect(oauthMock.login).to.not.have.beenCalled;
            });

            it('should set the token', function() {
                expect(ajax.options.token).to.be.equal('fake-provided-token');
            });
        });
    });

    describe('#logout', function() {
        it('should log the user out', function() {
            main.logout();

            expect(oauthMock.logout).to.have.beenCalledOnce;
        });
    });

    describe('#getConfig', function() {
        beforeEach(function() {
            main.init({
                id: 'fake-project-id'
            });
            main.authorize();
        });

        it('should return the current config', function(){
            let testConfig = {
                persistToken: true,
                mqtt: {
                    endpoint: 'mqtt.relayr.io'
                }
            };

            expect(main.getConfig()).to.deep.equal(testConfig);
        });
    });

    describe('#getCurrentUser', function() {
        beforeEach(function() {
            main.init({
                id: 'fake-project-id'
            });
            main.authorize('fake-token');
        });

        it('should return the current user', function(){
            let testUser = {
                "config": {
                  "mqtt": {
                    "endpoint": "mqtt.relayr.io"
                  },
                  "persistToken": true
                }
            };

            expect(main.getCurrentUser()).to.deep.equal(testUser);
        });
    });

    describe('#customAjax', function() {
        beforeEach(function() {
            main.init({
                id: 'fake-project-id'
            });
            main.authorize('fake-token');
        });

        it('should return the custom ajax if one is provided', function(){

            let differentAjax = {'_options':{
                    uri: 'kittens.com',
                    protocol: 'https://', 
                    tokenType: 'Bearer', 
                    token: 'fake-token', 
                    dataUri: 'data-api.relayr.io',
            }};

            let ajaxConfig = {
                                uri: 'kittens.com',
                                dataUri: 'data-api.relayr.io',
                                protocol: 'https://',
                                token: 'fake-token'
                            }

            expect(main.customAjax(ajaxConfig)).to.deep.equal(differentAjax);
        });

        it('should return the standard ajax if none is provided', function(){
            var fn = function() {
                main.customAjax();
            };
            expect(fn).to.throw(Error);
        });

    });
});













