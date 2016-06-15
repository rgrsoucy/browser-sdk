import Model, {
    cache
}
from '../entities/Model.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {
    relayrMockModels
}
from './mocks/models/relayrModels.js';

global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
var expect = chai.expect;
chai.use(sinonChai);

let modelInstance;
let fakeConfig;

describe('Model', function() {
    beforeEach(function() {
        fakeConfig = {
            ajax: {
                url: 'fakeURL',
                token: '12345',
                tokenType: 'Bearer'
            }
        };

        modelInstance = new Model(null, fakeConfig);


        this.xhr = sinon.useFakeXMLHttpRequest();
        this.requests = [];

        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

    });

    afterEach(function() {
        cache.public.toArray = [];
        cache.public.toDictionary = {};
    });

    describe('#getAllModels', function() {
        it('should return an object of models available on the platform', function(done) {

            let sampleModel = relayrMockModels;

            modelInstance.getAllModels().then((result) => {
                expect(result).to.include(sampleModel.models[0]);
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleModel));


        });

        it('should keep a cache after each request', function(done) {

            let sampleModel = relayrMockModels;
            //console.log(sampleModel)

            let firstTime = modelInstance.getAllModels().then((result) => {

                let secondTime = modelInstance.getAllModels().then((result) => {
                    expect(cache.public.toArray[0]).to.deep.equal(sampleModel.models[0])
                    done();
                });
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleModel));


        });

        it('should create a dictionary of models in cache.public.toDictionary', function(done) {

            let sampleModel = relayrMockModels;

            modelInstance.getAllModels().then((result) => {

                expect(cache.public.toDictionary[sampleModel.models[0].id]).to.deep.equal(sampleModel.models[0])
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleModel));


        });
    });

    describe('#getSingleModel', function() {

        it('should retreive a single model even when cache was never created', function(done) {

            let sampleModel = relayrMockModels;
            let modelId = "85dad151-e0e1-407b-9ec8-25f28de92849"
            modelInstance.getModel(modelId).then((result) => {
                expect(result.id).to.equal(modelId)
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleModel));

        });

        it('should return null when model is not found', function(done) {

            let sampleModel = relayrMockModels;
            let modelId = "oh.noes.im.a.model.now.:("
            modelInstance.getModel(modelId).then((model) => {
                console.log(model, "here")
                expect(model).to.be.null;
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleModel));

        });
    });
});