import Ajax from '../tools/ajax.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonPromise from 'sinon-as-promised'
var expect = chai.expect;
chai.use(sinonChai);

let ajaxInstance;

describe('Ajax', function() {
  beforeEach(function() {
    let options = {
      tokenType: "Bearer",
      token: "FAKE_TOKEN",
      uri: null
    }

    ajaxInstance = new Ajax(options);

  });
  it('should get the current token', function() {
    expect(ajaxInstance.token).to.equal("FAKE_TOKEN");
  });

  it('Should call _xhrRequest', function() {
    sinon.spy(ajaxInstance, '_xhrRequest');

    ajaxInstance.get("/oauth-userinfo").then((result) => {

    });
    expect(ajaxInstance._xhrRequest).to.have.been.called;
  });

});