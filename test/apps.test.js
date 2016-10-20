// import Apps from '../src/entities/Apps.js';

// import chai from 'chai';
// import sinon from 'sinon';
// import sinonChai from 'sinon-chai';

// var expect = chai.expect;
// chai.use(sinonChai);

// let appInstance;
// let fakeConfig;


// describe('Apps', function() {
//     beforeEach(function() {
//         fakeConfig = {
//             owner: 'fakeOwner',
//             position: 99,
//             id: 'fakeId',
//             devices: [{
//                 dev1: 'device1'
//             }, {
//                 dev2: 'device2'
//             }],
//             name: 'fakeName',
//             ajax: {
//                 url: 'fakeURL',
//                 token: '12345',
//                 tokenType: 'Bearer'
//             }
//         };

//         appsInstance = new Apps(fakeConfig);

//         this.xhr = sinon.useFakeXMLHttpRequest();
//         this.requests = [];

//         this.xhr.onCreate = function(xhr) {
//             this.requests.push(xhr);
//         }.bind(this);
//     });

//     describe('#getApps', function() {
//         let apiResponse = [
//             {
//             "id": "a1bf392f-0890-445a-b025-3d09316cd356",
//             "name": "WB Data Board (WBDB)",
//             "description": "The first APP to read the WB Sensors"
//             },
//             {
//             "id": "aaaaaaaa",
//             "name": "fakething",
//             "description": "it's a thing"
//             }
//             ]

//         it('should throw an error if no id given to look up', function() {
//             groupInstance.id = null;
//             var fn = function() {
//                 groupInstance.getGroup();
//             };
//             expect(fn).to.throw(Error);
//         });

//         it('should return the correct object describing the group', function(done) {
//             let response;

//             groupInstance.getGroup().then((response) => {
//                 expect(response).to.deep.equal(sampleGroup);
//                 done();
//             });

//             this.requests[0].respond(200, {
//                 'Content-Type': 'text/json'
//             }, JSON.stringify(sampleGroup));
//         });
//     });