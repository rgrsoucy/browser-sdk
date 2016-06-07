import User from '../entities/User.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
var expect = chai.expect;
chai.use(sinonChai);

let userInstance;

describe('User', function() {
  beforeEach(function() {
    let token = "FAKE_TOKEN";
    userInstance = new User(token);
  });
  it('should get the current token', function() {
    expect(userInstance._getToken()).to.equal("FAKE_TOKEN");
  });

});