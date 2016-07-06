
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import DeviceHistoryPoints from '../../../src/entities/history/DeviceHistoryPoints.js';

import deviceHistoryFixture from '../../fixtures/history';

let expect = chai.expect;
chai.use(sinonChai);

describe('DeviceHistoryPoint', function() {

    let deviceHistoryPointsInstance;
    beforeEach(function() {
        deviceHistoryPointsInstance = new DeviceHistoryPoints(deviceHistoryFixture.results);
    });

    it('should add points on constructions', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path').id).to.be.equal('fake-history-device-id');
    });

    it('should contain the id', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path').id).to.be.equal('fake-history-device-id');
    });

    it('should have all the points from one reading', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path').points[0]).to.be.an('object');
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path').points[0]).to.deep.equal({
            timestamp: 1465552800000,
            value: 49.2680925420364
        });
    });

    it('should work when the reading does not have a path', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', null).id).to.be.equal('fake-history-device-id-no-path');
    });

    it('should work when the reading does not have a meaning', function() {
        expect(deviceHistoryPointsInstance.get(null, 'fake-path').id).to.be.equal('fake-history-device-id-no-meaning');
    });

    describe('#addPoints', function() {
        beforeEach(function() {
            deviceHistoryPointsInstance.addPoints(deviceHistoryFixture.results);
            deviceHistoryPointsInstance.addPoints([{
                deviceId: 'new-added-last',
                points: [{
                    timestamp: 1465552800000,
                    value: 2
                }],
                meaning: 'fake-new-meaning',
                path: 'null'
            },]);
        });

        it('add points to existing points object', function() {
            expect(deviceHistoryPointsInstance.get('fake-meaning', null).points.length).to.be.equal(2);
        })

        it('should add new entry if there is not an existing one', function() {
            expect(deviceHistoryPointsInstance.get('fake-new-meaning', null).points[0].value).to.be.equal(2);
        })
    });
});
