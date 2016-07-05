import main, {
    User, Device, Model, Group, Transmitter
}
from '../src/main';
import DeviceClass from '../src/entities/Device';
import ModelClass from '../src/entities/Model';
import GroupClass from '../src/entities/Group';
import TransmitterClass from '../src/entities/Transmitter';

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
                    expect(main.getConfig().ajax.token).to.be.equal('fake-token');
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
                expect(main.getConfig().ajax.token).to.be.equal('fake-provided-token');
            });
        });
    });

    describe('#logout', function() {
        it('should log the user out', function() {
            main.logout();

            expect(oauthMock.logout).to.have.beenCalledOnce;
        });
    });
});