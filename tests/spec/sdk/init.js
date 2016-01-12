var fakeAjax = function(func){
  var xhr = sinon.useFakeXMLHttpRequest();
  var requests = [];
  xhr.onCreate = function(xhr){
    requests.push(xhr);
  }
  try{
    func(requests);
  }
  catch (e){
    throw e;
  }
  finally{
    xhr.restore();
  }
}

var relayrInit = function(){
  return RELAYR.init({appId:"testerAppid", redirectUri:"testerRedirectUri"});
};
var token ="testerToken";

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
    fakeAjax(function(requests){
      relayr.login({
        success: function(){
          callbackCalled = true;
        },
        error: function(){

        }
      });
      expect(requests.length).toBe(1);
      var req= requests[0];
      expect(req.url).toBe("https://api.relayr.io/oauth2/user-info");
      req.respond(200, {}, JSON.stringify({id:"42387492730487324", email:"something@something.com", name:"billybob"}));
    });
    expect(callbackCalled).toBe(true);

  });


  it('should redirect to the correct oauth login page', function() {
    //spyOn(window.document, 'location');
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
    fakeAjax(function(requests){
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
    });
    expect(callbackCalled).toBe(true);

  });




  it('should give unauthorized 401 if token is invalid', function(){
    var relayr = relayrInit();
    var callbackCalled = false;

    localStorage.setItem("relayrToken",token);
    fakeAjax(function(requests){
      relayr.login({
        success: function() {},
        error: function() {
          callbackCalled = true;
        }
      });

      expect(requests.length).toBe(1);
      var req= requests[0];
      expect(req.url).toBe("https://api.relayr.io/oauth2/user-info");
      req.respond(401, {}, JSON.stringify({id:"42387492730487324", email:"something@something.com", name:"billybob"}));
    });

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

describe("devices", function(){
  it('device should throw an error when missing the method incomingData', function() {
    var relayr = relayrInit();

    var f = function() {
      relayr.devices().getDeviceData({});
    };

    expect(f).toThrow(new Error("Provide the method incomingData within your parameters"));
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
    fakeAjax(function(requests){
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
});
