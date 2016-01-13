window.RELAYR = (function (win, doc) {
    var relayr =  {
        init: function(credentials){
          return new Relayr(credentials);
        }
    };
    function Relayr(credentials){


      var config ={
        url: "https://api.relayr.io/",
        mqtt: "mqtt.relayr.io",
        mockMode: false
      };


      var self = this;

      self.credentials = credentials;
      self.config = config;
      self.checkAccount = function(){
        if (!self.account){
          throw new Error("You must be logged in to access this method.");
        }
      };
      function login(callback){

        if (!(credentials && util.nonEmptyString(credentials.appId))){
          throw new Error("Provide credentials: appId and redirectUri");
        }

        if (!(credentials && util.nonEmptyString(credentials.redirectUri))){
          throw new Error("Provide credentials: redirectUri");
        }
        if (!(callback && callback.success && typeof callback.success == "function")){
          throw new Error("Provide the method success within your parameters");
        }
        var localToken = localStorage.getItem("relayrToken");
        if (localToken){
            triggerCallback();

        } else {

          var authURL ={
            client_id: self.credentials.appId,
            redirect_uri: self.credentials.redirectUri,
            scope: "access-own-user-info+configure-devices"
          };

          this.login.redirect(config.url + "oauth2/auth?client_id=" + authURL.client_id + "&redirect_uri=" + authURL.redirect_uri + "&response_type=token&scope=" + authURL.scope);
        }

        function triggerCallback(){
          self.user().getUserInfo(localToken, function(){
            callback.success(localToken) ;
          }, function(error){
            if (!(callback && callback.error && typeof callback.error == "function")){
              localStorage.removeItem("relayrToken");
              self.login(callback);
            }else{
              callback.error(error);
            }
          });
        }
      }

      function user() {

        this.getUserInfo = function(token, successCb, errorCb){
          if (self.account){
            if (!(successCb && typeof successCb == "function")){
              return self.account;
            } else {
              successCb(self.account);
            }
          } else {
            util.ajax({
              url:self.config.url+"oauth2/user-info",
              type: "GET",
              token:"Bearer "+ token,
              isObject: true
            }, function(account){
                account.token = token;
                self.account = account;
                successCb(self.account);
            }, function(error){
                errorCb(error);
            });
          }
          return this;
        };

        this.logout = function(){
          localStorage.removeItem("relayrToken");
        };
      }



      function devices() {
        this.getDeviceData = function(device, callback, errorCb){

          if (!(device && device.incomingData && typeof device.incomingData == "function")){
            throw new Error("Provide the method incomingData within your parameters");
          }
          if (!(device && device.deviceId)){
            throw new Error("Provide the deviceId within your parameters");
          }
          if (!device.token){
            if (self.account.token){
              device.token = self.account.token;
            }
          }

          device.token = device.token.replace("Bearer ","");
          util.ajax({
            url:self.config.url+"channels",
            type: "POST",
            token:"Bearer "+ device.token,
            isObject: true,
            body:{
              "transport":"mqtt",
              "deviceId": device.deviceId
            }
          }, function(credentials) {
            credentials.cb = device.incomingData;
            util.mqttClient(credentials);
          }, function(error){
            if (!(device && device.error && typeof device.error == "function")){
              throw new Error("Provide the method error within your parameters");
            }
            errorCb(error);
            localStorage.removeItem("relayrToken");
            self.login();
          });
          return this;
        };


        this.getAllDevices = function(successCb, errorCb){
          if (!util.isAFunction(successCb)) {
            throw new Error("Provide an success callback as an parameter");
          }

          if (!util.isAFunction(errorCb)) {
            throw new Error("Provide a error callback as an parameter");
          }

          util.ajax({
            url: self.config.url + "users/" + self.account.id + "/devices",
            type: "GET",
            token: "Bearer "+ self.account.token,
            isObject: true
          }, function(devices){
            successCb(devices);
          }, function(error){
            errorCb(error);
          });

          return this;
        };

        this.sendCommand = function(device){
          if (!(device && device.deviceId && device.command)){
            throw new Error("Provide the deviceId within your parameters");
          }
          if (!device.token) {
            if (self.account.token){
              device.token = self.account.token;
            }
          }

          device.token = device.token.replace("Bearer ","");

          util.ajax({
            url:self.config.url+"devices/"+ device.deviceId+"/cmd",
            type: "POST",
            token:"Bearer "+ device.token,
            body:device.command
          }, function(credentials){}, function(error){
            errorCb(error);
            localStorage.removeItem("relayrToken");
            self.login();
          });
          return this;
        };
      }

      function groups() {
        this.getAllGroups = function(successCb, errorCb){
          if (!util.isAFunction(successCb)) {
            throw new Error("Provide an success callback as an parameter");
          }

          if (!util.isAFunction(errorCb)) {
            throw new Error("Provide a error callback as an parameter");
          }

          util.ajax({
            url: self.config.url + "users/" + self.account.id + "/groups",
            type: "GET",
            token: "Bearer "+ self.account.token,
            isObject: true
          }, function(group){
            successCb(group);
          }, function(error){
            errorCb(error);
          });

          return this;
        };
      }

      function models() {
        this.getAllModels = function(successCb, errorCb){
          if (!util.isAFunction(successCb)) {
            throw new Error("Provide an success callback as an parameter");
          }

          if (!util.isAFunction(errorCb)) {
            throw new Error("Provide a error callback as an parameter");
          }

          util.ajax({
            url: self.config.url + "device-models?limit=100000",
            type: "GET",
            token: "Bearer "+ self.account.token,
            isObject: true
          }, function(group){
            successCb(group);
          }, function(error){
            errorCb(error);
          });

          return this;
        };
      }


      function transmitters(){
        self.checkAccount();
        this.getTransmitters = function(successCb, errorCb){

          util.ajax({
            url:self.config.url+"users/"+self.account.id +"/transmitters",
            type: "GET",
            token:"Bearer "+ self.account.token,
            isObject: true
          }, function(transmitters){
            successCb(transmitters);
          }, function(error){
            if (!(errorCb && errorCb && typeof errorCb == "function")){
              throw new Error("Provide the method error within your parameters");
            }
          });
          return this;
        };
      }

      (function(){
        //Auto check for token scrapping
        function parse(input){
          var parts = input.split("#");
          if (parts.length <  2){
            return undefined;
          }
          var queryParams = parts[1].split("&");
          var obj = queryParams.reduce(function(accumulator, pair){
            var tuple = pair.split("=");
            accumulator[tuple[0]] = tuple[1];
            return accumulator;
          }, {});
          return obj.access_token;
        }
        var parsed = parse(document.location.hash);
        var loc = window.location.href,
            index = loc.indexOf('#access_token');

        if (index > 0) {
          window.location = loc.substring(0, index);
        }
        if (parsed){
          localStorage.setItem("relayrToken", parsed);
        }
      })();

      this.login = login;
      this.user = function(){
        return new user();
      };

      this.devices = function(){
        return new devices();
      };

      this.groups = function() {
        return new groups();
      };

      this.models = function() {
        return new models();
      };

      this.transmitters = function(){
        return new transmitters();
      };

      this.login.redirect = function(uri){
          doc.location = uri;
      };

      this.util = util;

    }



    var util = {
      nonEmptyString: function(string){
        return string && typeof string == "string" && string.length > 0;
      },

      isAFunction: function(fn) {
        return fn && typeof fn == "function";
      },

      ajax: function(options, callback, error){
        var xhrObject = new XMLHttpRequest();
        xhrObject.onreadystatechange = function() {
          if (xhrObject.readyState === 4) {
            if (xhrObject.status > 199 && xhrObject.status < 299 ) {

              if (options.isObject){
                callback(JSON.parse(xhrObject.responseText));
              }else{
                callback(xhrObject.responseText);
              }
            }
            if (xhrObject.status > 399 && xhrObject.status < 600) {
              error(xhrObject);
            }
          }
        };
        xhrObject.open(
          options.type,
          options.url,
          true
        );

        xhrObject.setRequestHeader("Authorization", options.token);
        xhrObject.setRequestHeader("Content-Type","application/json");
        if (options.body){
          xhrObject.send(JSON.stringify(options.body));
        }else{
          xhrObject.send();
        }
      },

      mqttClient: function(credentials){
        credentials.mqtt = new mqtt();
        credentials.mqtt.subscribe(credentials);
        credentials.mqtt.connect();
        return credentials;
      }
    };

    function mqtt(base){
      var MQTT_TIMEOUT = 10000;
      var self = this;
      self.subscriptions =[];
      self.credentials =null;

      self.retries = 0;
      self.connect= function(param){
        param= self.subscriptions[0];
        self.credentials = param;
        self.client = new Paho.MQTT.Client("mqtt.relayr.io", 443, "JSDK_" + Math.floor((Math.random() * 1000)));
        self.client.onConnectionLost = onConnectionLost;
        self.client.onMessageArrived = onMessageArrived;
        self.client.isConnected = false;
        self.retries++;
        console.log("Connecting...");
        if (self.retries > 100){
          throw new Error("Too many MQTT retries occured, please try later.");
        }

        var options = {
          timeout: 30,
          keepAliveInterval: 10,
          cleanSession: true,
          useSSL: true,
          userName:param.credentials.user,
          password:param.credentials.password,
          onSuccess: function(data){
            self.client.isConnected = true;
            self.retries =0;
            self.subscriptions.forEach(function(subscription){
              self.client.subscribe(subscription.credentials.topic,0);

            });
          },
          onFailure: function(data){
            if (!self.forceDisconnect){
              self.connect(self.credentials);
            }
          }
        };

        self.client.connect(options);
      };


      function onMessageArrived(data){
        try {
          var deviceId = data._getDestinationName();
          deviceId = deviceId.split("/v1/")[1].split("/")[0];
          var dataTopic =data._getDestinationName().split("/v1/")[1];
          var incomingData =(data._getPayloadString());
          incomingData =  JSON.parse(data._getPayloadString());

          for (var i = self.subscriptions.length - 1; i >= 0; i--) {
           if(self.subscriptions[i].channelId == dataTopic){
            deviceId = self.subscriptions[i].deviceId;

            if ((self.subscriptions[i].cb && self.subscriptions[i].cb && typeof self.subscriptions[i].cb == "function")){
              self.subscriptions[i].cb(incomingData);
            }
            if ((self.subscriptions[i].incomingData && self.subscriptions[i].incomingData && typeof self.subscriptions[i].incomingData == "function")){
              self.subscriptions[i].incomingData(incomingData);
            }
           }
          }

        } catch(err) {
          console.log("Incoming data function error:", err);
        }
      }

      function onConnectionLost(data){
        console.log("Lost connection");
        setTimeout(function(){
          self.client.isConnected = false;
          self.connect(self.lastParam);

          if (!self.forceDisconnect){
            self.connect(self.lastParam);
          }
        }, MQTT_TIMEOUT);
      }

      this.disconnect = function() {
        self.forceDisconnect = true;
        if (self.client){
          try{
            self.client.disconnect();
          } catch(err) {}
        }
      };

      this.subscribe= function(channel){
        self.subscriptions.push(channel);
      };

      this.cleanUp= function(){
        self.disconnect();
      };

      return this;
    }

    return relayr;
}(window, window.document));
