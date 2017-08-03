import chai from 'chai';
import sinonChai from 'sinon-chai';
import { beforeEach, describe, it } from 'mocha';

import DeviceHistoryPoints from '../../../src/entities/history/DeviceHistoryPoints.js';

import deviceHistoryFixture from '../../fixtures/history';

let expect = chai.expect;
chai.use(sinonChai);

describe('DeviceHistoryPoint', function() {

    let deviceHistoryPointsInstance;
    beforeEach(function() {
        deviceHistoryPointsInstance = new DeviceHistoryPoints(deviceHistoryFixture.data, 'fake-meaning', 'fake-path');
    });

    it('should add points on constructions', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path')).to.be.an('Array');
    });

    it('should have all the points from one reading', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path')[0]).to.be.an('object');
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path')[0]).to.deep.equal({
            avg: 93.07814412491575,
            max: 93.07814412491575,
            min: 93.07814412491575,
            timestamp: '2016-09-06T19:00:00.000Z'
        });
    });

    it('should work when the reading does not have a path', function() {
        const deviceHistoryPointsInstance = new DeviceHistoryPoints(deviceHistoryFixture.data, 'fake-meaning', null);
        expect(deviceHistoryPointsInstance.get('fake-meaning', null)).to.be.an('Array');
    });

    it('should work when the reading does not have a meaning', function() {
        const deviceHistoryPointsInstance = new DeviceHistoryPoints(deviceHistoryFixture.data, null, 'fake-path');
        expect(deviceHistoryPointsInstance.get(null, 'fake-path')).to.be.an('Array');
    });

    describe('#addPoints', function() {
        beforeEach(function() {
            deviceHistoryPointsInstance.addPoints(deviceHistoryFixture.data);
            deviceHistoryPointsInstance.addPoints([{
                timestamp: new Date(1465552800000).toISOString(),
                avg: 2
            }]);
        });

        it('add points to existing points object', function() {
            expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path').length).to.be.equal(11);
        });

        it('should add entry if there is not an existing one', function() {
            const points = deviceHistoryPointsInstance.get('fake-meaning', 'fake-path');
            expect(points[points.length - 1].avg).to.be.equal(2);
        });
    });
});
