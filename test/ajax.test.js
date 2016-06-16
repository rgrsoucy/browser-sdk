import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised'
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

import Ajax from '../tools/ajax.js';
var expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiPromise);

let ajaxInstance;


describe('Ajax', function() {

    beforeEach(function() {
        let options = {
            tokenType: "Bearer",
            token: "FAKE_TOKEN",
            uri: null
        }

        ajaxInstance = new Ajax(options);

        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

        sinon.spy(ajaxInstance, "_xhrRequest");
    });

    afterEach(function() {
        this.xhr.restore();
    });

    it('should get the current token', function() {
        expect(ajaxInstance.token).to.equal("FAKE_TOKEN");
    });

    describe('get', function() {

        it('Should return a promise when calling ajaxInstance._xhrRequest()', function(done) {

            var data = {
                "id": "a3aad38e-55db-4c59-bb82-d98b38fc2b83",
                "name": "John Smith",
                "email": "test_user@relayr.io"
            };

            var dataJson = JSON.stringify(data);

            ajaxInstance._xhrRequest({
                url: "/oauth-userinfo",
                type: "GET",
                isObject: true,
            }, null).then((result) => {
                expect(result).to.deep.equal(data);
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, dataJson);
        });


        it('Should pass the correct options to the _xhrRequest', function() {

            var options = {
                url: "/oauth-userinfo",
                type: "GET",
                isObject: true
            }

            ajaxInstance.get("/oauth-userinfo");

            expect(ajaxInstance._xhrRequest).to.have.been.calledWith(options)

        });

        it('Should have url in ajaxInstance.get', function() {
            var fn = function() {
                ajaxInstance.get(null);
            }

            expect(fn).to.throw(Error)
        });

        it('Should have a string in a url', function() {
            var fn = function() {
                ajaxInstance.get(8);
            }

            expect(fn).to.throw(Error)
        });

        describe('query parameters', function() {
            it('should create a query params string of query object', function() {
                ajaxInstance.get('/test', true, {
                    one: 1,
                    two: 2,
                    three: 3
                });

                expect(this.requests[0].url).to.contain('?one=1&two=2&three=3');
            });

            it('should URI encode all query parameters', function() {
                ajaxInstance.get('/test', true, {
                    complicated: '-- test *'
                });

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


});
