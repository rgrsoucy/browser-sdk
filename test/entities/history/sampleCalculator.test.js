import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import sampleCalculator from '../../../entities/history/sampleCalculator.js';

var expect = chai.expect;
chai.use(sinonChai);

var oneHourMs = 1000 * 3600;
describe('sampleCalculator', function() {

    var service;
    beforeEach(function() {
        let baseTime = new Date(1985, 4, 12, 0, 0);
        this.clock = sinon.useFakeTimers(baseTime.getTime());
    });

    afterEach(function() {
        this.clock.restore();
    });

    describe('#getTimeFrame', function() {
        it('should return an object with start Date and end Date', function() {
            var timeframeObj = sampleCalculator('1y');

            expect(timeframeObj.start).to.be.a('Date');
            expect(timeframeObj.end).to.be.a('Date');
        });

        it('should have a time span of one year start -> end for 1y', function() {
            var timeframeObj = sampleCalculator('1y');
            expect(timeframeObj.end.getFullYear() - timeframeObj.start.getFullYear()).to.equal(1);
            expect(timeframeObj.end.getMonth()).to.equal(timeframeObj.start.getMonth());
            expect(timeframeObj.end.getDate()).to.equal(timeframeObj.start.getDate());
        });

        it('should have a time span of one month start -> end for 1m', function() {
            var timeframeObj = sampleCalculator('1m');
            expect(timeframeObj.end.getFullYear()).to.equal(timeframeObj.start.getFullYear());
            expect(timeframeObj.end.getMonth() - timeframeObj.start.getMonth()).to.equal(1);
            expect(timeframeObj.end.getDate()).to.equal(timeframeObj.start.getDate());
        });

        it('should have a time span of one week start -> end for 1w', function() {
            var timeframeObj = sampleCalculator('1w');

            expect((timeframeObj.end.getTime() - timeframeObj.start.getTime()) / oneHourMs).to.equal(24 * 7);
        });

        it('should have a time span of one day start -> end for 1d', function() {
            var timeframeObj = sampleCalculator('1d');

            expect((timeframeObj.end.getTime() - timeframeObj.start.getTime()) / oneHourMs).to.equal(24);
        });

        it('should have a time span of five hours start -> end for 5h', function() {
            var timeframeObj = sampleCalculator('5h');
            expect((timeframeObj.end.getTime() - timeframeObj.start.getTime()) / oneHourMs).to.equal(5);
        });

        it('should have a time span of one hour start -> end for 1h', function() {
            var timeframeObj = sampleCalculator('1h');
            expect((timeframeObj.end.getTime() - timeframeObj.start.getTime()) / oneHourMs).to.equal(1);
        });

        it('should have no sampling size for 1h', function() {
            var timeframeObj = sampleCalculator('1h');
            expect(timeframeObj.sampleSize).to.equal('1m');
        });

        it('should have no sampling size for 5h', function() {
            var timeframeObj = sampleCalculator('5h');
            expect(timeframeObj.sampleSize).to.equal('1m');
        });

        it('should have 1m sampling size for 1d', function() {
            var timeframeObj = sampleCalculator('1d');
            expect(timeframeObj.sampleSize).to.equal('1m');
        });

        it('should have 1h sampling size for 1w', function() {
            var timeframeObj = sampleCalculator('1w');
            expect(timeframeObj.sampleSize).to.equal('1h');
        });

        it('should have 1h sampling size for 1m', function() {
            var timeframeObj = sampleCalculator('1m');
            expect(2).to.equal(2);
            expect(timeframeObj.sampleSize).to.equal('1h');
        });

        it('should have 1h sampling size for 1y', function() {
            var timeframeObj = sampleCalculator('1y');
            expect(timeframeObj.sampleSize).to.equal('1h');
        });

    });
});
