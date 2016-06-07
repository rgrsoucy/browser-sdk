export
default class Ajax {
  constructor(options) {
    this.tokenType = options.tokenType;
    this.token = options.token;
    this.uri = options.uri || "https://api.relayr.io/"
  }

  get(url, raw) {
    return new Promise((resolve, reject) => {
      var xhrObject = this._xhrRequest({
        type: "GET",
        url: url,
        isObject: true
      }).then((result) => {
        resolve(result);
      }).catch((xhrObject) => {
        reject(xhrObject);
      });
    });
  }

  post() {

  }

  patch() {

  }

  delete() {

  }

  _xhrRequest(options, body) {
    var xhrObject = new XMLHttpRequest();

    return new Promise((resolve, reject) => {

      xhrObject.open(
        options.type,
        options.url,
        true
      );

      xhrObject.onreadystatechange = function() {
        if (xhrObject.readyState === 4) {
          if (xhrObject.status > 199 && xhrObject.status < 299) {
            if (options.isObject) {
              resolve(JSON.parse(xhrObject.responseText));
            } else {
              resolve(xhrObject.responseText);
            }
          }
          if (xhrObject.status > 399 && xhrObject.status < 600) {

            reject(xhrObject);
          }
        }
      };


      xhrObject.setRequestHeader('Authorization', options.token);
      xhrObject.setRequestHeader('Content-Type', 'application/json');
      if (body) {
        xhrObject.send(JSON.stringify(body));
      } else {
        xhrObject.send();
      }

    });
  }
}