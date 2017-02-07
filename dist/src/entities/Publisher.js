(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../tools/ajax.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('../tools/ajax.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.ajax);
        global.Publisher = mod.exports;
    }
})(this, function (module, exports, _ajax) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Publisher = function () {
        function Publisher() {
            var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, Publisher);

            this.config = config;
            this.name = config.name;
            this.publisherId = config.id;
            this.owner = config.owner;
        }

        _createClass(Publisher, [{
            key: 'newPublisher',
            value: function newPublisher(postBody) {
                var _this = this;

                //POST /publishers, (name, publisher, redirectUri, description)
                if (!postBody) {
                    throw new Error('Provide a body of parameters to post');
                } else if (!postBody.hasOwnProperty('name') && !postBody.hasOwnProperty('owner')) {
                    throw new Error('Provide a body with parameters name and owner for the Publisher');
                }

                return new Promise(function (resolve, reject) {
                    _ajax.ajax.post('/publishers', postBody).then(function (response) {
                        _this.publisherId = response.id;
                        _this.name = response.name;
                        _this.owner = response.owner;
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'deletePublisher',
            value: function deletePublisher() {
                var _this2 = this;

                //DELETE /publishers/{publisherId}
                if (!this.publisherId) {
                    throw new Error('Provide the publisher id during instantiation');
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.delete('/publishers/' + _this2.publisherId).then(function (response) {
                        //right now the object hangs around, but on the cloud it is gone
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }, {
            key: 'updatePublisher',
            value: function updatePublisher(patchBody) {
                var _this3 = this;

                //POST /publishers/{publisherId}, optional:(name, publisher, redirectUri, description)
                if (!this.publisherId) {
                    throw new Error('Please provide an publisherId');
                } else if (!patchBody) {
                    throw new Error('Provide a patch of parameters to update');
                } else if (!Object.keys(patchBody).length) {
                    throw new Error('Provide a patch with some parameters to update');
                }
                for (var x in patchBody) {
                    if (!this.hasOwnProperty(x)) {
                        throw new Error('Provide a patch with relevant parameters to update');
                    }
                }
                return new Promise(function (resolve, reject) {
                    _ajax.ajax.patch('/publishers/' + _this3.publisherId, patchBody).then(function (response) {
                        _this3.name = response.name;
                        _this3.owner = response.owner;
                        resolve(response);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }]);

        return Publisher;
    }();

    exports.default = Publisher;
    module.exports = exports['default'];
});