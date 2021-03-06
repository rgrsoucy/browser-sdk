import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised';
import { afterEach, beforeEach, describe, it } from 'mocha';
import Ajax, { ajax } from '../src/tools/ajax.js';

global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiPromise);

let ajaxInstance;


describe('Ajax', function() {
    beforeEach(function() {
        ajaxInstance = ajax;
        ajaxInstance.options = {
            tokenType: 'Bearer',
            token: 'FAKE_TOKEN'
        };

        // instance.xhr doesn't exist anymore as a property
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];


        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

    });

    afterEach(function() {
        this.xhr.restore();
    });


    describe('setup', function() {
        it('should get the current token', function() {
            expect(ajaxInstance.options.token).to.equal('FAKE_TOKEN');
        });

        it('should default protocol to https://', function() {
            expect(ajaxInstance.options.protocol).to.equal('https://');
        });

        it('should be possible to specify another protocol', function() {
            let ajaxInstance2 = new Ajax({
                protocol: 'http://'
            });
            expect(ajaxInstance2.options.protocol).to.equal('http://');
        });

        it('should default uri to api.relayr.io', function() {
            expect(ajaxInstance.options.uri).to.equal('api.relayr.io');
        });
    });

    describe('get', function() {

        it('Should return a promise when calling ajaxInstance._xhrRequest()', function(done) {
            const data = {
                id: 'a3aad38e-55db-4c59-bb82-d98b38fc2b83',
                name: 'John Smith',
                email: 'test_user@relayr.io'
            };

            const dataJson = JSON.stringify(data);

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

            sinon.spy(ajaxInstance, '_xhrRequest');

            const options = {
                url: '/oauth-userinfo',
                type: 'GET',
                isObject: true,
                contentType: 'application/json'
            };

            ajaxInstance.get('/oauth-userinfo');

            expect(ajaxInstance._xhrRequest).to.have.been.calledWith(options);

        });

        it('Should have url in ajaxInstance.get', function() {
            const fn = function() {
                ajaxInstance.get(null);
            };

            expect(fn).to.throw(Error);
        });

        it('Should have a string in a url', function() {
            const fn = function() {
                ajaxInstance.get(8);
            };

            expect(fn).to.throw(Error);
        });


        describe('query parameters', function() {

            it('should create a query params string of query object', function() {
                ajaxInstance.get('/test', {
                    raw: true,
                    queryObj: {
                        one: 1,
                        two: 2,
                        three: 3
                    }
                });

                expect(this.requests[0].url).to.contain('?one=1&two=2&three=3');
            });

            it('should URI encode all query parameters', function() {
                ajaxInstance.get('/test', {
                    raw: true,
                    queryObj: {
                        complicated: '-- test *'
                    }
                });

                expect(this.requests[0].url).to.contain('?complicated=--%20test%20*');
            });

            it('should support query parameters that are arrays', function() {
                ajaxInstance.get('/test', {
                    queryObj: {
                        array: [1, 2, 3, 4]
                    }
                });

                expect(this.requests[0].url).to.contain('?array=1%2C2%2C3%2C4');
            });

            it('should exclude properties that are empty', function() {
                ajaxInstance.get('/test', {
                    queryObj: {
                        empty: null
                    }
                });

                expect(this.requests[0].url).not.to.contain('?empty=');
            });

            it('should not add any query string if no query parameter object was provided', function() {
                ajaxInstance.get('/test', true);

                expect(this.requests[0].url).to.not.contain('?');
            });

            it('should not add any query string if the query parameter object is empty', function() {
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

            expect(this.requests[0].requestBody).to.be.deep.equal(JSON.stringify({
                fakeKey: 'fakeValue'
            }));
        });

        it('Should throw an error upon server response 4xx', function(done) {
            const config = {
                url: '/oauth-userinfo',
                type: 'GET',
                isObject: true,
            };

            expect(ajaxInstance._xhrRequest(config, null)).to.eventually.be.rejected.notify(done);
            this.requests[0].respond(404, {});
        });

        it('Should throw an error upon server response 5xx', function(done) {
            const config = {
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

            expect(this.requests[0].requestBody).to.be.deep.equal(JSON.stringify({
                fakeKey: 'fakeValue'
            }));
        });
    });

    describe('_xhrRequest', function() {
        it('should return pure responseText when its an isObject but emtpy string coming back', function(done) {
            ajaxInstance.post('/test', {
                    fakeKey: 'fakeValue'
                },
                {
                    raw: true
                }).then((responseText) => {
                expect(responseText).to.be.deep.equal('');
                done();
            });

            this.requests[0].respond(202, {
                'Content-Type': 'application/json'
            }, '');
        });
    });


});
