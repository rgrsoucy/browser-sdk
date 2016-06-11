import Mqtt from '../tools/mqtt.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised'
var expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiPromise);

let mqttInstance;


describe('Mqtt', function() {

    beforeEach(function() {
        mqttInstance = new Mqtt();
    });

    afterEach(function() {

    });

    it('should mqtt', function() {

    });

});