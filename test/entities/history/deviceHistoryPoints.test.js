
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import DeviceHistoryPoints from '../../../entities/history/DeviceHistoryPoints.js';

import deviceHistoryFixture from '../../fixtures/history/history';

let expect = chai.expect;
chai.use(sinonChai);

describe('DeviceHistoryPoint', function() {

    let deviceHistoryPointsInstance;
    beforeEach(function() {
        deviceHistoryPointsInstance = new DeviceHistoryPoints(deviceHistoryFixture.results);
    });

    it('should contain the deviceId', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path').deviceId).to.be.equal('fake-history-device-id');
    });

    it('should have all the points from one reading', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path').points[0]).to.be.an('object');
        expect(deviceHistoryPointsInstance.get('fake-meaning', 'fake-path').points[0]).to.deep.equal({
            timestamp: 1465552800000,
            value: 49.2680925420364
        });
    });

    it('should work when the reading does not have a path', function() {
        expect(deviceHistoryPointsInstance.get('fake-meaning', null).deviceId).to.be.equal('fake-history-device-id-no-path');
    });

    it('should work when the reading does not have a meaning', function() {
        expect(deviceHistoryPointsInstance.get(null, 'fake-path').deviceId).to.be.equal('fake-history-device-id-no-meaning');
    });
});
