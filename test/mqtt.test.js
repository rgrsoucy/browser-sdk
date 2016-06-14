import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised'
import {
    mqtt
}
from '../tools/mqtt.js';
var expect = chai.expect;

var jsdom = require('mocha-jsdom')
chai.use(sinonChai);
chai.use(chaiPromise);

let mqttSingleton;


describe('Mqtt', function() {
    jsdom();

    beforeEach(function() {

        mqttSingleton = mqtt;
        sinon.spy(mqttSingleton, "connect");
    });

    afterEach(function() {

        mqttSingleton.connect.restore();

    });

    describe('connect', function() {

        it('should throw if userName and password are not in options', function() {

            let options = {
                NotuserName: "bob",
                NoTpassword: "lovesCake123"
            }
            var fn = function() {
                mqttSingleton.connect(options)
            }
            expect(fn).to.throw(Error);
        });

        it('should pass if userName and password are in options', function() {

            let options = {
                userName: "bob",
                password: "lovesCake123"
            }
            mqttSingleton.connect(options)
            expect(mqttSingleton.connect).to.have.been.calledWith(options);
        });

    });


    describe('subscribe', function() {

        it('should throw if no topic was provided to subscribe', function() {

            var fn = function() {
                mqttSingleton.subscribe(null, null);
            }
            expect(fn).to.throw(Error);
        });

        it('should throw if no callback was provided to subscribe', function() {

            var fn = function() {
                mqttSingleton.subscribe("/v1/someId/topic", null);
            }
            expect(fn).to.throw(Error);
        });

        it('should store subscription in an array to connect later', function() {

            let myTopic = "/v1/someId/topic";
            mqttSingleton.subscribe(myTopic, function() {

            });

            expect(mqttSingleton._topics[myTopic]).to.be.defined;
        });

        it('should trigger stored callback when event is fired', function(done) {

            let fakeSensorReadings = {
                meaning: "temp",
                value: 50
            }

            let myTopic = "/v1/someId/topic2";
            mqttSingleton.subscribe(myTopic, function(sensorData) {

                expect(sensorData).to.deep.equal(fakeSensorReadings)
                done();
            });

            function mockWSSEvent() {
                mqttSingleton._topics[myTopic].subscribers.forEach((subscriber) => {
                    subscriber(fakeSensorReadings)
                })
            }
            mockWSSEvent();
        });


    });
});