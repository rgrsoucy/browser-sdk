import Transmitter from '../src/entities/Transmitter.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var expect = chai.expect;
chai.use(sinonChai);

let transmitterInstance;
let fakeConfig;


describe('Transmitter', function() {
  beforeEach(function() {
    fakeConfig = {
      transmitterId: 'fakeTransmitterId',
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

    this.xhr = sinon.useFakeXMLHttpRequest();
    this.requests = [];

    this.xhr.onCreate = function(xhr) {
      this.requests.push(xhr);
    }.bind(this);
  });

  describe('#updateTransmitter', function() {

    it('should throw an error if no transmitterId given to look up', function() {
      transmitterInstance.transmitterId = null;
      var fn = function() {
        transmitterInstance.updateTransmitter();
      };
      expect(fn).to.throw(Error);
    });

    it('should give a body of parameters at all to update', function() {
      var fn = function() {
        transmitterInstance.updateTransmitter();
      };
      expect(fn).to.throw(Error);
    });

    it('should have something in the body', function() {
      let body = {};
      var fn = function() {
        transmitterInstance.updateTransmitter(body);
      };
      expect(fn).to.throw(Error);
    });

    it('should give relevant parameters to update on a transmitter in the body', function() {
      let body = {
        pets: 'unicorn',
        abilities: 'flying'
      };

      var fn = function() {
        transmitterInstance.updateTransmitter(body);
      };
      expect(fn).to.throw(Error);
    });

    it('should return the correct updated transmitter object based on multiple changes', function(done) {
      let patch = {
        owner: 'bob',
        name: 'Im a thing'
      };
      let response;



      transmitterInstance.updateTransmitter(patch, true).then((response) => {
        expect(patch).to.deep.equal(response);
        done();
      });

      //this is the api
      this.requests[0].respond(200, {
        'Content-Type': 'text/json'
      }, JSON.stringify(patch));
    });
  });


  describe('#deleteTransmitter', function() {
    it('should throw an error if no transmitterId given to look up', function() {
      transmitterInstance.transmitterId = null;
      var fn = function() {
        transmitterInstance.deleteTransmitter();
      };
      expect(fn).to.throw(Error);
    });

    it('should delete the transmitterInstance', function(done) {
      let data = {};

      transmitterInstance.deleteTransmitter(data).then((response) => {
        expect(response).to.be.defined;
        done();
      });

      //this is the api
      this.requests[0].respond(204, {
        'Content-Type': 'text/json'
      }, JSON.stringify(data));
    });

  });
});
