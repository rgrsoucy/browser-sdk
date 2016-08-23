import main, {
    User, Device, Model, Group, Transmitter
}
from '../src/main';
import DeviceClass from '../src/entities/Device';
import ModelClass from '../src/entities/Model';
import GroupClass from '../src/entities/Group';
import TransmitterClass from '../src/entities/Transmitter';
import { ajax } from '../src/tools/ajax'
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised';
import 'sinon-as-promised';
var expect = chai.expect;

chai.use(sinonChai);
chai.use(chaiPromise);

let oauthMock = {
    token: 'fake-token',
    login: function(){},
    logout: function(){}
};

main.__Rewire__('Oauth2', function() {
    return oauthMock;
});

let testUser = {
                  "id": "abc123",
                  "email": "relayr@relayr.com",
                  "industryArea": "Aerospace",
                  "config": {
                          "mqtt": {
                            "endpoint": "mqtt.relayr.io"
                          },
                          "persistToken": true
                        }
}; 

describe('Main', function() {
    beforeEach(function(){
        sinon.stub(User.prototype, "getUserInfo").resolves(testUser);
        sinon.spy(oauthMock, 'login');
        sinon.spy(oauthMock, 'logout');
    });

    afterEach(function(){
        oauthMock.login.restore();
        oauthMock.logout.restore();
        User.prototype.getUserInfo.restore();
    });


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
                expect(oauthMock.login).to.have.been.called;         
            });

            it('should ask to verify the token', function(){
                sinon.spy(main, '_verifyToken');     
                main.authorize();       
                expect(main._verifyToken).to.have.been.called;
                main._verifyToken.restore();

            });

            it('should update user with the user informaiton', function(done) {
                expect(main.authorize()).to.eventually.to.have.property('email').notify(done);
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
                expect(oauthMock.login).to.not.have.been.called;
            });

            it('should set the token', function() {
                expect(ajax.options.token).to.be.equal('fake-provided-token');
            });
        });

    });

    describe.only('#_verifyToken', function() {
        it('should logout and redirect to login if userinfo has no email', function() {
            //stub out testuser w no email
            let verifyUser = new User();
            let badUser = {
                "id": "abc123",
                "industryArea": "Aerospace",
            }
            User.prototype.getUserInfo.restore();
            sinon.stub(User.prototype, "getUserInfo").resolves(badUser);
            main.authorize().then(()=>{
                expect(oauthMock.logout).to.have.been.called;
            });
        });

        it('should logout and redirect to login if userinfo has obviously bad email', function() {
            //stub out testUser email with a bad one
            let verifyUser = new User();
            let badUser = {
                "id": "abc123",
                "email":"relayrATrelayr.com",
                "industryArea": "Aerospace"
            }
            User.prototype.getUserInfo.restore();
            sinon.stub(User.prototype, "getUserInfo").resolves(badUser);
            main.authorize().then(()=>{
                expect(oauthMock.logout).to.have.been.called;
            });
        });

    });

    describe('#logout', function() {
        it('should log the user out', function() {
            main.logout();

            expect(oauthMock.logout).to.have.been.calledOnce;
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
            
        });

        it('should return the current user', function(){
            main.authorize('fake-token').then(()=>{
                expect(main.getCurrentUser()).to.deep.equal(testUser);
            });
            
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













