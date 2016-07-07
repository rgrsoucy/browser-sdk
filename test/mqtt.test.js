import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised';
import Mqtt from '../src/tools/mqtt.js';
var expect = chai.expect;

var jsdom = require('mocha-jsdom');
chai.use(sinonChai);
chai.use(chaiPromise);

let fakeOptions = {
    userName: 'bob',
    password: 'lovesCake123'
}
describe('Mqtt', function() {
    jsdom();

    let mqtt;
    beforeEach(function() {

        mqtt = new Mqtt();
        mqtt.client = {
            connect: sinon.spy(),
            isConnected: function() {}
        };
    });

    describe('connect', function() {

        it('should throw if userName and password are not in options', function() {
            let options = {
                NotuserName: 'bob',
                NoTpassword: 'lovesCake123'
            };
            var fn = function() {
                mqtt.connect(options);
            };
            expect(fn).to.throw(Error);
        });

        it('should pass if userName and password are in options', function() {
            mqtt.connect(fakeOptions);

            expect(mqtt.client.connect.getCall(0).args[0]).to.have.property('userName', 'bob');
            expect(mqtt.client.connect.getCall(0).args[0]).to.have.property('password', 'lovesCake123');
        });

        it('should not create a connection if it is already connecting', function() {
            mqtt.connect(fakeOptions);
            mqtt.connect(fakeOptions);

            expect(mqtt.client.connect).to.have.been.calledOnce;
        });
    });


    describe('lost connection', function() {
        beforeEach(function() {
            mqtt.connect(fakeOptions);
            sinon.spy(mqtt, "connect");
            sinon.spy(mqtt, "_onConnectionLost");
        });

        it('should reconnect after lostConnection', function() {

            mqtt.client.onConnectionLost();
            expect(mqtt._onConnectionLost).to.have.been.calledOnce;
        });

        it('should reconnect only x amount of times after lostConnection', function() {
            let largeAmountOfDisconnects = 200;
            for (var i = 0; i <= 200; i++) {
                mqtt.client.onConnectionLost();
            }
            expect(mqtt.connect).to.have.be.callCount(mqtt.config.reconnectLimit); //Limit is 10 by default

        });
    });

    describe('subscribe', function() {

        it('should throw if no topic was provided to subscribe', function() {

            var fn = function() {
                mqtt.subscribe(null, null);
            };
            expect(fn).to.throw(Error);
        });

        it('should throw if no callback was provided to subscribe', function() {

            var fn = function() {
                mqtt.subscribe('/v1/someId/topic', null);
            };
            expect(fn).to.throw(Error);
        });

        it('should store subscription in an array to connect later', function() {

            let myTopic = '/v1/someId/topic';
            mqtt.subscribe(myTopic, function() {

            });

            expect(mqtt._topics[myTopic]).to.be.defined;
        });

        it('should trigger stored callback when event is fired', function(done) {

            let fakeSensorReadings = {
                meaning: 'temp',
                value: 50
            };

            let myTopic = '/v1/someId/topic2';
            mqtt.subscribe(myTopic, function(sensorData) {

                expect(sensorData).to.deep.equal(fakeSensorReadings);
                done();
            });

            function mockWSSEvent() {
                mqtt._topics[myTopic].subscribers.forEach((subscriber) => {
                    subscriber(fakeSensorReadings);
                });
            }
            mockWSSEvent();
        });

        describe('on message arrived', function() {
            beforeEach(function() {
                mqtt.connect(fakeOptions);
            });

            it('should notify the subscriber to that topic', function(done) {

                mqtt.subscribe('fake-topic', function(data) {
                    expect(data).to.be.have.property('test', 123);
                    done();
                });

                mqtt.client.onMessageArrived({
                    _getDestinationName: function() {
                        return 'fake-topic';
                    },
                    _getPayloadString: function() {
                        return '{ "test": 123 }';
                    }
                });
            });

            it('should not notify other subscribers', function() {
                var cbSpy = sinon.spy();
                mqtt.subscribe('another-topic', cbSpy);

                mqtt.client.onMessageArrived({
                    _getDestinationName: function() {
                        return 'fake-topic';
                    },
                    _getPayloadString: function() {
                        return '{ "test": 123 }';
                    }
                });

                expect(cbSpy).not.to.have.been.calledOnce;
            });
        });

    });
});