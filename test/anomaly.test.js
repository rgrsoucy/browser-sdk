import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { beforeEach, describe, it } from 'mocha';
import Device from '../src/entities/Device.js';

const expect = chai.expect;
chai.use(sinonChai);
let deviceInstance;
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

describe('Device', function() {
    const sampleState = {
        data: [{
            score: 23,
            contributors: [{
                featureId: 23,
                score: 100
            }],
            timestamp: '2016-09-01T08:00:00Z'
        }, {
            score: 17,
            contributors: [{
                featureId: 14,
                score: 74
            }, {
                featureId: 23,
                score: 30
            }],
            timestamp: '2016-09-01T08:23:00Z'
        }]
    };
    const fakeConfig = {
        ajax: {
            url: 'fakeURL',
            token: '12345',
            tokenType: 'Bearer'
        }
    };
    const fakeDevice = {
        id: 'fakeDeviceId',
        name: 'fakeDeviceName',
        modelId: 'fakeModel',
        owner: 'fakeOwner'
    };

    beforeEach(function() {
        deviceInstance = new Device(fakeDevice, fakeConfig);

        this.xhr = sinon.useFakeXMLHttpRequest();
        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

    });


    it('should return the correct array describing anomalies', function(done) {
        deviceInstance.getAnomalies()
            .then((response) => {
                expect(response).to.deep.equal(sampleState.data);
                done();
            });
        this.requests[0].respond(204, {
            'Content-Type': 'text/json'
        }, JSON.stringify(sampleState));
    });

    it('should throw when the anomaly service returns 500', function() {
        expect(deviceInstance.getAnomalies()).to.be.rejected;
        this.requests[0].respond(500, {
            'Content-Type': 'text/json'
        }, JSON.stringify({}));
    });

    it('should throw an error if no device id given to look up', function() {
        deviceInstance.id = null;
        const fn = function() {
            deviceInstance.getAnomalies();
        };
        expect(fn).to.throw(Error);
    });
});
