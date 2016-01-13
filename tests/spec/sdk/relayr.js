var relayrInit = function(){
  return RELAYR.init({appId:"testerAppid", redirectUri:"testerRedirectUri"});
};

var token = "testerToken";

describe('relayr SDK', function() {
  var xhr, requests;
  beforeEach(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function(xhr){
      requests.push(xhr);
    }
  });

  describe('#init', function() {
    var validInputs = [{appId:"37648273648628", redirectUri:"34324234"}];

    it('should initialize with constructor with valid arguments', function() {
      var relayr= RELAYR.init({
        appId: '37648273648628',
        redirectUri:'34324234'
      });
      expect(typeof relayr.login).toBe('function');

    });
  });

  describe('#login', function() {
    afterEach(function() {
      localStorage.removeItem("relayrToken")
    });

    it('should throw an error with constructor undefined', function() {
      var f = function(){
        var relayr = RELAYR.init(undefined);
        relayr.login();
      };

      expect(f).toThrow(new Error("Provide credentials: appId and redirectUri"));

    });

    it('should throw an error with constructor {}', function() {
      var f = function(){
        var relayr = RELAYR.init({});
        relayr.login();
      };

      expect(f).toThrow(new Error("Provide credentials: appId and redirectUri"));
    });

    it('should throw an error with constructor null', function() {
      var f = function(){
        var relayr = RELAYR.init(null);
        relayr.login();
      };

      expect(f).toThrow(new Error("Provide credentials: appId and redirectUri"));
    });

    it('should throw an error with constructor ""', function() {
      var f = function(){
        var relayr = RELAYR.init("");
        relayr.login();
      };

      expect(f).toThrow(new Error("Provide credentials: appId and redirectUri"));
    });

    it('should throw an error with constructor []', function() {
      var f = function(){
        var relayr = RELAYR.init([]);
        relayr.login();
      };

      expect(f).toThrow(new Error("Provide credentials: appId and redirectUri"));
    });

    it('should throw an error with constructor {appId:true}', function() {
      var f = function(){
        var relayr = RELAYR.init({appId:true});
        relayr.login();
      };

      expect(f).toThrow(new Error("Provide credentials: appId and redirectUri"));
    });

    it('should throw an error with constructor {appId:""}', function() {
      var f = function(){
        var relayr = RELAYR.init({appId:""});
        relayr.login();
      };

      expect(f).toThrow(new Error("Provide credentials: appId and redirectUri"));
    });

    it('should throw an error if callback success not valid or defined with args undefined', function() {
      var f = function(){
        var relayr = relayrInit();
        relayr.login(undefined);
      };
      expect(f).toThrow();
    });

    it('should throw an error if callback success not valid or defined with args {}', function() {
      var f = function(){
        var relayr = relayrInit();
        relayr.login({});
      };
      expect(f).toThrow();
    });

    it('should throw an error if callback success not valid or defined with args null', function() {
      var f = function(){
        var relayr = relayrInit();
        relayr.login(null);
      };
      expect(f).toThrow();
    });

    it('should throw an error if callback success not valid or defined with args ""', function() {
      var f = function(){
        var relayr = relayrInit();
        relayr.login("");
      };
      expect(f).toThrow();
    });

    it('should throw an error if callback success not valid or defined with args []', function() {
      var f = function(){
        var relayr = relayrInit();
        relayr.login([]);
      };
      expect(f).toThrow();
    });

    it('should call success method when the token exists in localStorage', function() {
      var relayr = relayrInit();
      var callbackCalled = false;

      localStorage.setItem("relayrToken",token);

      relayr.login({
        success: function(){
          callbackCalled = true;
        },
        error: function(){
        }
      });
      expect(requests.length).toBe(1);
      var req = requests[0];

      expect(req.url).toBe("https://api.relayr.io/oauth2/user-info");
      req.respond(200, {}, JSON.stringify({id:"42387492730487324", email:"something@something.com", name:"billybob"}));

      expect(callbackCalled).toBe(true);
    });


    it('should redirect to the correct oauth login page', function() {
      var relayr = relayrInit();
      relayr.login.redirect = function(uri){

        this.uri = uri;
      };
      relayr.login({
        success: function(){

        }
      });
      expect(relayr.login.uri).toBe("https://api.relayr.io/oauth2/auth?client_id=testerAppid&redirect_uri=testerRedirectUri&response_type=token&scope=access-own-user-info+configure-devices")
    });
  });

  describe('User', function(){
    it('should check if user info returns properties', function(){
      var relayr = relayrInit();
      var callbackCalled = false;

      localStorage.setItem("relayrToken",token);
      relayr.login({
        success: function() {
          callbackCalled = true;
        },
        error: function() {}
      });
      expect(requests.length).toBe(1);

      var req= requests[0];

      expect(req.url).toBe("https://api.relayr.io/oauth2/user-info");
      req.respond(200, {}, JSON.stringify({id:"42387492730487324", email:"something@something.com", name:"billybob"}));

      expect(relayr.user().getUserInfo().id).toBeDefined();
      expect(relayr.user().getUserInfo().id).toBe("42387492730487324");
      expect(callbackCalled).toBe(true);
    });




    it('should give unauthorized 401 if token is invalid', function(){
      var relayr = relayrInit();
      var callbackCalled = false;

      localStorage.setItem("relayrToken",token);

      relayr.login({
        success: function() {},
        error: function() {
          callbackCalled = true;
        }
      });

      expect(requests.length).toBe(1);

      var req = requests[0];
      expect(req.url).toBe("https://api.relayr.io/oauth2/user-info");

      req.respond(401, {}, JSON.stringify({id:"42387492730487324", email:"something@something.com", name:"billybob"}));

      expect(callbackCalled).toBe(true);
    });

    it('logout should remove key from storage', function(){
      localStorage.setItem("relayrToken",token);

      var relayr = relayrInit();
      var storageToken=localStorage.getItem("relayrToken")

      relayr.user().logout();
      var check = localStorage.getItem("relayrToken");
      expect(check).toBe(null);
    });

    afterEach(function() {
      localStorage.removeItem("relayrToken")
    });
  });

  describe('devices', function(){
    var relayr;
    beforeEach(function() {
      relayr = relayrInit();
      relayr.account = {
        id: 'test-dummy-account-id',
        token: 'test-dummy-token'
      };
    });

    it('device should throw an error when missing the method incomingData', function() {
      var f = function() {
        relayr.devices().getDeviceData({});
      };

      expect(f).toThrow(new Error("Provide the method incomingData within your parameters"));
    });

    describe('#getAllDevices', function() {

      it('should throw an error is no success cb is provided', function() {
        var f = function() {
          relayr.devices().getAllDevices();
        };

        expect(f).toThrow();
      });

      it('should throw an error is no error cb is provided', function() {
        var f = function() {
          relayr.devices().getAllDevices(function() {});
        };

        expect(f).toThrow();
      });

      it('should do a GET to users devices', function() {
        relayr.devices().getAllDevices(function() {}, function() {});

        expect(requests.length).toBe(1);
        var req = requests[0];
        expect(req.url).toBe('https://api.relayr.io/users/test-dummy-account-id/devices');
      });

      it('should call success callback when it gets data', function(done) {
        relayr.devices().getAllDevices(function() {
          expect(true).toBeTruthy();
          done();
        }, function() {});

        var req = requests[0];
        req.respond(200, {}, JSON.stringify([]));
      });


      it('should call error callback if the request fails', function(done) {
        relayr.devices().getAllDevices(function() {}, function() {
          expect(true).toBeTruthy();
          done();
        });

        var req = requests[0];
        req.respond(401, { "Content-Type": "application/json" }, JSON.stringify({error: "error"}));
      });
    });


    describe('#getDevice', function() {
      it('should throw an error if no id is provided', function() {
        var f = function() {
          relayr.devices().getDevice();
        };

        expect(f).toThrow();
      });

      it('should throw an error is no success cb is provided', function() {
        var f = function() {
          relayr.devices().getDevice({
            deviceId: 'device-id'
          });
        };

        expect(f).toThrow();
      });

      it('should throw an error is no error cb is provided', function() {
        var f = function() {
          relayr.devices().getDevice({
            deviceId: 'device-id'
          }, function() {});
        };

        expect(f).toThrow();
      });

      it('should do a GET to users devices', function() {
        relayr.devices().getDevice({
          deviceId: 'device-id'
        }, function() {}, function() {});

        expect(requests.length).toBe(1);
        var req = requests[0];
        expect(req.url).toBe('https://api.relayr.io/devices/device-id');
      });

      it('should call success callback when it gets device', function(done) {
        relayr.devices().getDevice({
          deviceId: 'device-id'
        }, function() {
          expect(true).toBeTruthy();
          done();
        }, function() {});

        var req = requests[0];
        req.respond(200, {}, JSON.stringify([]));
      });


      it('should call error callback if the request fails', function(done) {
        relayr.devices().getDevice({
            deviceId: 'device-id'
        }, function() {}, function() {
          expect(true).toBeTruthy();
          done();
        });

        var req = requests[0];
        req.respond(401, { "Content-Type": "application/json" }, JSON.stringify({error: "error"}));
      });
    });

    describe('#getDeviceState', function() {
      it('should throw an error if no id is provided', function() {
        var f = function() {
          relayr.devices().getDeviceState();
        };

        expect(f).toThrow();
      });

      it('should throw an error is no success cb is provided', function() {
        var f = function() {
          relayr.devices().getDeviceState({
            deviceId: 'device-id'
          });
        };

        expect(f).toThrow();
      });

      it('should throw an error is no error cb is provided', function() {
        var f = function() {
          relayr.devices().getDeviceState({
            deviceId: 'device-id'
          }, function() {});
        };

        expect(f).toThrow();
      });

      it('should do a GET to users devices', function() {
        relayr.devices().getDeviceState({
          deviceId: 'device-id'
        }, function() {}, function() {});

        expect(requests.length).toBe(1);
        var req = requests[0];
        expect(req.url).toBe('https://api.relayr.io/devices/device-id/state');
      });

      it('should call success callback when it gets data', function(done) {
        relayr.devices().getDeviceState({
          deviceId: 'device-id'
        }, function() {
          expect(true).toBeTruthy();
          done();
        }, function() {});

        var req = requests[0];
        req.respond(200, {}, JSON.stringify([]));
      });


      it('should call error callback if the request fails', function(done) {
        relayr.devices().getDevice({
          deviceId: 'device-id'
        }, function() {}, function() {
          expect(true).toBeTruthy();
          done();
        });

        var req = requests[0];
        req.respond(401, { "Content-Type": "application/json" }, JSON.stringify({error: "error"}));
      });
    });

  });

  describe('groups', function() {
    var relayr;
    beforeEach(function() {
      relayr = relayrInit();
      relayr.account = {
        id: 'test-dummy-account-id',
        token: 'test-dummy-token'
      };
    });

    describe('#getAllGroups', function() {

      it('should throw an error is no success cb is provided', function() {
        var f = function() {
          relayr.groups().getAllGroups();
        };

        expect(f).toThrow();
      });

      it('should throw an error is no error cb is provided', function() {
        var f = function() {
          relayr.groups().getAllGroups(function() {});
        };

        expect(f).toThrow();
      });

      it('should do a GET to users devices', function() {
        relayr.groups().getAllGroups(function() {}, function() {});

        expect(requests.length).toBe(1);
        var req = requests[0];
        expect(req.url).toBe('https://api.relayr.io/users/test-dummy-account-id/groups');
      });

      it('should call success callback when it gets data with response', function(done) {
        relayr.groups().getAllGroups(function(data) {
          expect(data).toEqual([]);
          done();
        }, function() {});

        var req = requests[0];
        req.respond(200, {}, JSON.stringify([]));
      });

      it('should call error callback if the request fails', function(done) {
        relayr.groups().getAllGroups(function() {}, function() {
          expect(true).toBeTruthy();
          done();
        });

        var req = requests[0];
        req.respond(401, { "Content-Type": "application/json" }, JSON.stringify({error: "error"}));
      });
    });

  });

  describe('models', function() {
    var relayr;
    beforeEach(function() {
      relayr = relayrInit();
      relayr.account = {
        id: 'test-dummy-account-id',
        token: 'test-dummy-token'
      };
    });

    describe('#getAllModels', function() {

      it('should throw an error is no success cb is provided', function() {
        var f = function() {
          relayr.models().getAllModels();
        };

        expect(f).toThrow();
      });

      it('should throw an error is no error cb is provided', function() {
        var f = function() {
          relayr.models().getAllModels(function() {});
        };

        expect(f).toThrow();
      });

      it('should do a GET to users devices', function() {
        relayr.models().getAllModels(function() {}, function() {});

        expect(requests.length).toBe(1);
        var req = requests[0];
        expect(req.url).toBe('https://api.relayr.io/device-models?limit=100000');
      });

      it('should call success callback when it gets data with response', function(done) {
        relayr.models().getAllModels(function(data) {
          expect(data).toEqual([]);
          done();
        }, function() {});

        var req = requests[0];
        req.respond(200, {}, JSON.stringify([]));
      });

      it('should call error callback if the request fails', function(done) {
        relayr.models().getAllModels(function() {}, function() {
          expect(true).toBeTruthy();
          done();
        });

        var req = requests[0];
        req.respond(401, { "Content-Type": "application/json" }, JSON.stringify({error: "error"}));
      });
    });
  });

  describe('Transmitters', function(){
    it('it should throw an error when accessing transmitters without being logged in', function() {
      var relayr = relayrInit();

      var f = function() {
        relayr.transmitters().getTransmitters({});
      };

      expect(f).toThrow(new Error("You must be logged in to access this method."));
    });

    it('transmitters should give an array of transmitters', function() {
      var relayr = relayrInit();

      localStorage.setItem("relayrToken",token);
      relayr.login({
        success: function() {},
        error: function(){
          callbackCalled = true;
        }
      });

      var req = requests[0];
      var transmitterCallback = false;

      expect(req.url).toBe("https://api.relayr.io/oauth2/user-info");

      req.respond(200, {}, JSON.stringify({id:"42387492730487324", email:"something@something.com", name:"billybob"}));
      relayr.transmitters().getTransmitters(function(transmitters) {
        expect(transmitters.length).toBe(0);
        transmitterCallbackResult = transmitters;
      });

      var req= requests[1];
      req.respond(200, {}, JSON.stringify([]));

      expect(transmitterCallbackResult).toBeDefined();
    });
  });

  describe('util', function() {
    var relayr;
    beforeEach(function() {
      relayr = relayrInit();
    });

    describe('#ajax', function() {
      describe('sucess', function() {
        it('call succes cb on response 200', function(done) {
          relayr.util.ajax({}, function(data) {
            expect(data).toEqual('{}');
            done();
          }, function() {});

          var req = requests[0];
          req.respond(200, {}, JSON.stringify({}));
        });

        it('call succes cb on response 201', function(done) {
          relayr.util.ajax({}, function(data) {
            expect(data).toEqual('{}');
            done();
          }, function() {});

          var req = requests[0];
          req.respond(201, {}, JSON.stringify({}));
        });
      });

      describe('error', function() {
        it('call error cb on response 400', function(done) {
          relayr.util.ajax({}, function() {}, function(data) {
            expect(data).toEqual(jasmine.any(Object));
            done();
          });

          var req = requests[0];
          req.respond(400, {}, JSON.stringify({}));
        });

        it('call error cb on response 401', function(done) {
          relayr.util.ajax({}, function() {}, function(data) {
            expect(data).toEqual(jasmine.any(Object));
            done();
          });

          var req = requests[0];
          req.respond(401, {}, JSON.stringify({}));
        });

        it('call error cb on response 404', function(done) {
          relayr.util.ajax({}, function() {}, function(data) {
            expect(data).toEqual(jasmine.any(Object));
            done();
          });

          var req = requests[0];
          req.respond(404, {}, JSON.stringify({}));
        });

        it('call error cb on response 500', function(done) {
          relayr.util.ajax({}, function() {}, function(data) {
            expect(data).toEqual(jasmine.any(Object));
            done();
          });

          var req = requests[0];
          req.respond(500, {}, JSON.stringify({}));
        });
      });
    });
  });
});
