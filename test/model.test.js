import Model, { cache, prototypeCache } from '../src/entities/Model';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { relayrMockModels, relayrMockPrototypes } from './fixtures/models/models.fixture.js';

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
      cache.clear();
      prototypeCache.clear();
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

            let firstTime = modelInstance.getAllModels().then((result) => {

                let secondTime = modelInstance.getAllModels().then((result) => {
                    expect(cache.public.toArray[0]).to.deep.equal(sampleModel.models[0]);
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

                expect(cache.public.toDictionary[sampleModel.models[0].id]).to.deep.equal(sampleModel.models[0]);
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleModel));
        });
    });

    describe('#getAllPrototypes', function() {
        it('should return list of all the users prototypes', function() {
            let prototypes = relayrMockPrototypes;

            const promise = modelInstance.getAllPrototypes().then((result) => {
                expect(result).to.include(prototypes.prototypes[0]);
                expect(this.requests[0].url).to.contain('device-models/prototypes');
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(prototypes));

            return promise;
        });

        it('should keep a cache after each request', function() {
            let samplePrototype = relayrMockPrototypes;

            let promise = modelInstance.getAllPrototypes().then(() => modelInstance.getAllPrototypes()).then(() => {
                expect(prototypeCache.public.toArray[0]).to.deep.equal(samplePrototype.prototypes[0]);
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(samplePrototype));

            return promise;
        });

        it('should create a dictionary of models in cache.public.toDictionary', function() {
            let samplePrototype = relayrMockPrototypes;

            let promise = modelInstance.getAllPrototypes().then((result) => {
                expect(cache.public.toDictionary[samplePrototype.prototypes[0].id]).to.deep.equal(samplePrototype.prototypes[0]);
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(samplePrototype));

            return promise;
        });
    });

    describe('#getSingleModel', function() {

        it('should retreive a single model even when cache was never created', function(done) {

            let sampleModel = relayrMockModels;
            let modelId = '85dad151-e0e1-407b-9ec8-25f28de92849';
            modelInstance.getModel(modelId).then((result) => {
                expect(result.id).to.equal(modelId);
                done();
            });

            this.requests[0].respond(200, {
                'Content-Type': 'text/json'
            }, JSON.stringify(sampleModel.models[0]));

        });

        it('should return 404 when model is not found', function(done) {

            let sampleModel = relayrMockModels;
            let modelId = 'oh.noes.im.a.model.now.:(';
            modelInstance.getModel(modelId).then((model) => {

            }).catch((error)=> {
              expect(error.status).to.equal(404);
              done();
            });

            this.requests[0].respond(404, {
                'Content-Type': 'text/json'
            }, 'Not found');

        });
    });
});
