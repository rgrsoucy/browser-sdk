import Mqtt from '../tools/mqtt.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised'
var expect = chai.expect;

var jsdom = require('mocha-jsdom')
chai.use(sinonChai);
chai.use(chaiPromise);

let mqttInstance;


describe('Mqtt', function() {
    jsdom();

    beforeEach(function() {
        mqttInstance = new Mqtt();
        sinon.spy(mqttInstance, "connect");
    });

    afterEach(function() {

    });

    describe('connect', function() {

        it('should throw if userName and password are not in options', function() {

            let options = {
                NotuserName: "bob",
                NoTpassword: "lovesCake123"
            }
            var fn = function() {
                mqttInstance.connect(options)
            }
            expect(fn).to.throw(Error);
        });

        it('should pass if userName and password are in options', function() {

            let options = {
                userName: "bob",
                password: "lovesCake123"
            }
            mqttInstance.connect(options)
            expect(mqttInstance.connect).to.have.been.calledWith(options);
        });

    });


    describe('subscribe', function() {

        it('should throw if no topic was provided to subscribe', function() {

            var fn = function() {
                mqttInstance.subscribe(null, null);
            }
            expect(fn).to.throw(Error);
        });

        it('should throw if no callback was provided to subscribe', function() {

            var fn = function() {
                mqttInstance.subscribe("/v1/someId/topic", null);
            }
            expect(fn).to.throw(Error);
        });

        it('should store subscription in an array to connect later', function() {

            let myTopic = "/v1/someId/topic";
            mqttInstance.subscribe(myTopic, function() {

            });

            expect(mqttInstance._topics[myTopic]).to.be.defined;
        });

        it('should trigger stored callback when event is fired', function(done) {

            let fakeSensorReadings = {
                meaning: "temp",
                value: 50
            }

            let myTopic = "/v1/someId/topic2";
            mqttInstance.subscribe(myTopic, function(sensorData) {

                expect(sensorData).to.deep.equal(fakeSensorReadings)
                done();
            });

            function mockWSSEvent() {
                mqttInstance._topics[myTopic].subscribers.forEach((subscriber) => {
                    subscriber(fakeSensorReadings)
                })
            }
            mockWSSEvent();
        });


    });
});