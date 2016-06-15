export
default class Ajax {
    constructor(options) {
        this.tokenType = options.tokenType;
        this.token = options.token;
        this.uri = options.uri || "https://api.relayr.io/"
        this.customXHR;
    }


    get(url, raw, contentType = 'application/json') {
        if (!url) throw new Error('Please provide atleast a url');
        if (typeof(url) !== "string") throw new Error('Please provide a string url');

        return new Promise((resolve, reject) => {
            var xhrObject = this._xhrRequest({
                type: "GET",
                url: url,
                isObject: raw || true,
                contentType: contentType
            }).then((result) => {
                resolve(result);
            }).catch((xhrObject) => {
                reject(xhrObject);
            });
        });
    }

    post(url, post, raw, contentType = 'application/json') {
        if (!url) throw new Error('Please provide atleast a url');
        if (typeof(url) !== "string") throw new Error('Please provide a string url');

        return new Promise((resolve, reject) => {
            var xhrObject = this._xhrRequest({
                type: "POST",
                url: url,
                post: post,
                isObject: raw || true,
                contentType: contentType
            }).then((result) => {
                resolve(result);

            }).catch((xhrObject) => {
                reject(xhrObject);
            });
        });
    }

    patch(url, patch, raw, contentType = 'application/json') {
        if (!url) throw new Error('Please provide atleast a url');
        if (typeof(url) !== "string") throw new Error('Please provide a string url');

        return new Promise((resolve, reject) => {
            var xhrObject = this._xhrRequest({
                type: "PATCH",
                url: url,
                patch: patch,
                isObject: raw || true,
                contentType: contentType
            }).then((result) => {
                resolve(result);

            }).catch((xhrObject) => {
                reject(xhrObject);
            });
        });
    }

    delete(url, raw, contentType = 'application/json') {
        if (!url) throw new Error('Please provide atleast a url');
        if (typeof(url) !== "string") throw new Error('Please provide a string url');

        return new Promise((resolve, reject) => {
            var xhrObject = this._xhrRequest({
                type: "DELETE",
                url: url,
                isObject: raw || true,
                contentType: contentType
            }).then((result) => {
                resolve(result);

            }).catch((xhrObject) => {
                reject(xhrObject);
            });
        });
    }

    _xhrRequest(options, body) {

        let xhrObject;

        xhrObject = new XMLHttpRequest();

        xhrObject.open(
            options.type,
            this.uri + options.url,
            true
        );

        xhrObject.setRequestHeader('Authorization', this.token);
        xhrObject.setRequestHeader('Content-Type', options.contentType);

        return new Promise((resolve, reject) => {

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

            if (body) {
                xhrObject.send(JSON.stringify(body));
            } else {
                xhrObject.send();
            }

        });


    }
}