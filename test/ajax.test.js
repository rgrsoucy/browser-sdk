import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised';
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

import Ajax from '../src/tools/ajax.js';
var expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiPromise);

let ajaxInstance;


describe('Ajax', function() {
    let options = {
        tokenType: 'Bearer',
        token: 'FAKE_TOKEN',
        uri: null,
    };
    beforeEach(function() {

        ajaxInstance = new Ajax(options);

        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

        sinon.spy(ajaxInstance, '_xhrRequest');
    });

    afterEach(function() {
        this.xhr.restore();
    });


    describe('setup', function() {
        it('should get the current token', function() {
            expect(ajaxInstance.token).to.equal('FAKE_TOKEN');
        });

        it('should default protocol to https://', function() {
            expect(ajaxInstance.protocol).to.equal('https://');
        });

        it('should be possible to specify another protocol', function () {
            ajaxInstance = new Ajax(Object.assign({
                protocol: 'http://' },
                options));
            expect(ajaxInstance.protocol).to.equal('http://');
        });

        it('should default uri to api.relayr.io', function() {
            expect(ajaxInstance.uri).to.equal('api.relayr.io/');
        });
    });

    describe('get', function() {

        it('Should return a promise when calling ajaxInstance._xhrRequest()', function(done) {

            var data = {
                id: 'a3aad38e-55db-4c59-bb82-d98b38fc2b83',
                name: 'John Smith',
                email: 'test_user@relayr.io'
            };

            var dataJson = JSON.stringify(data);

            ajaxInstance._xhrRequest({
                url: '/oauth-userinfo',
                type: 'GET',
                isObject: true
            }, null).then((result) => {
                expect(result).to.deep.equal(data);
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'application/json'
            }, dataJson);
        });


        it('Should pass the correct options to the _xhrRequest', function() {

            var options = {
                url: '/oauth-userinfo',
                type: 'GET',
                isObject: true,
                contentType: 'application/json'
            };

            ajaxInstance.get('/oauth-userinfo');

            expect(ajaxInstance._xhrRequest).to.have.been.calledWith(options);

        });

        it('Should have url in ajaxInstance.get', function() {
            var fn = function() {
                ajaxInstance.get(null);
            };

            expect(fn).to.throw(Error);
        });

        it('Should have a string in a url', function() {
            var fn = function() {
                ajaxInstance.get(8);
            };

            expect(fn).to.throw(Error);
        });


        describe('query parameters', function() {
            it('should create a query params string of query object', function() {
                ajaxInstance.get('/test', { raw: true, queryObj: {
                    one: 1,
                    two: 2,
                    three: 3
                } });

                expect(this.requests[0].url).to.contain('?one=1&two=2&three=3');
            });

            it('should URI encode all query parameters', function() {
                ajaxInstance.get('/test', { raw: true, queryObj: {
                    complicated: '-- test *'
                } });

                expect(this.requests[0].url).to.contain('?complicated=--%20test%20*');
            });

            it('should not add any query string if no query parameter object was provided', function() {
                ajaxInstance.get('/test', true);

                expect(this.requests[0].url).to.not.contain('?');
            });

            it('should not add any query string if the query parameter objec is empty', function() {
                ajaxInstance.get('/test', true, {});

                expect(this.requests[0].url).to.not.contain('?');
            });
        });
    });

    describe('#post', function() {
        it('should create a xhr request with the body', function() {
            ajaxInstance.post('/test', {
                fakeKey: 'fakeValue'
            });

            expect(this.requests[0].requestBody).to.be.deep.equal(JSON.stringify({ fakeKey: 'fakeValue' }));
        });

        it('Should throw an error upon server response 4xx', function(done) {

            var data = {
                id: 'a3aad38e-55db-4c59-bb82-d98b38fc2b83',
                name: 'John Smith',
                email: 'test_user@relayr.io'
            };

            var dataJson = JSON.stringify(data);
            var config = {
                url: '/oauth-userinfo',
                type: 'GET',
                isObject: true,
            };

            expect(ajaxInstance._xhrRequest(config, null)).to.eventually.be.rejected.notify(done);
            this.requests[0].respond(404, {});
        });

        it('Should throw an error upon server response 5xx', function(done) {

            var data = {
                id: 'a3aad38e-55db-4c59-bb82-d98b38fc2b83',
                name: 'John Smith',
                email: 'test_user@relayr.io'
            };

            var dataJson = JSON.stringify(data);
            var config = {
                url: '/oauth-userinfo',
                type: 'GET',
                isObject: true,
            };

            expect(ajaxInstance._xhrRequest(config, null)).to.eventually.be.rejected.notify(done);
            this.requests[0].respond(500, {});
        });

    });

    describe('#patch', function() {
        it('should create a xhr request with the body', function() {
            ajaxInstance.patch('/test', {
                fakeKey: 'fakeValue'
            });

            expect(this.requests[0].requestBody).to.be.deep.equal(JSON.stringify({ fakeKey: 'fakeValue' }));
        });
    });


});
