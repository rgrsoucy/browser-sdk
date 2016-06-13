import User from '../entities/User.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
var expect = chai.expect;
chai.use(sinonChai);

let userInstance;
let fakeConfig;

describe('User', function() {
  beforeEach(function() {
    fakeConfig = {
      ajax: {
        url: "http://123",
        token: "123",
        tokenType: "Bears"
      }
    }

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
        id: "123",
        email: "john@doe",
        name: "billy"
      }

      userInstance.ajax.customXHR = this.xhr;
      userInstance.getUserInfo().then((userInfo) => {
        expect(userInfo).to.deep.equal(userStub);
        done();
      });


      this.requests[0].respond(200, {
        'Content-Type': 'text/json'
      }, JSON.stringify(userStub));
    });
  });

  describe('#getMyTransmitters', function() {

    it('should resolve a promise with transmitter info', function(done) {
      let transmitterStub = [{
        "id": "c30f9ca2-db38-496b-a833-ca67cb4dc3c8",
        "secret": "AOf3Ft47lvDjgKX",
        "owner": "c70faa9f-5eda-49d8-be91-a7e4b1beeca1",
        "name": "Test transmitter",
        "topic": "/v1/396e822e-9d04-40c1-a049-8b95d3fd7e36/",
        "integrationType": "wunderbar2"
      }]


      userInstance.ajax.customXHR = this.xhr;
      userInstance.getMyTransmitters().then((result) => {
        expect(result).to.deep.equal(transmitterStub[0]);
        done();
      });


      this.requests[0].respond(200, {
        'Content-Type': 'text/json'
      }, JSON.stringify(transmitterStub));
    });
  });
});