import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised'
import Connection from '../tools/connection'

var expect = chai.expect;

chai.use(sinonChai);
chai.use(chaiPromise);



describe('Connection', function() {

    it("Should trigger subscriber callback on event", function(done) {
        let dataCount = 0;
        let connection = new Connection
        let mockData = {
            meaning: "temp",
            value: 20
        }
        connection.on("data", function(dataStream) {
            expect(dataStream).to.deep.equal(mockData)
            if (dataCount == 5) {
                done();

            }
            dataCount++;
        });


        function fakeSocket() {
            for (var i = 5; i >= 0; i--) {
                connection.event(mockData)
            }
        }

        fakeSocket();
    });

    it("Should keep a buffer of historical data and flush to subscriber when ready", function(done) {
        let dataCount = 0;
        this.timeout(5000)
        let connection = new Connection
        let mockData = {
            meaning: "temp",
            value: 20
        }

        function fakeSocket() {
            connection.event(mockData)
        }

        fakeSocket();



        function fakeProcessingWait() {
            setTimeout(() => {

                connection.on("data", function(dataStream) {
                    expect(dataStream).to.deep.equal(mockData)
                    done();

                });

            }, 2000)
        }

        fakeProcessingWait();
    });

});