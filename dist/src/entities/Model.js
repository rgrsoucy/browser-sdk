(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../tools/ajax.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../tools/ajax.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.ajax);
        global.Model = mod.exports;
    }
})(this, function (exports, _ajax) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.prototypeCache = exports.cache = undefined;

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

    function createCache() {
        var cache = {
            init: function init() {},
            public: {
                toArray: [],
                toDictionary: {}
            },
            clear: function clear() {
                cache.public.toArray = [];
                cache.public.toDictionary = [];
            }
        };

        return cache;
    }

    var cache = exports.cache = createCache();

    var prototypeCache = exports.prototypeCache = createCache();

    var Model = function () {
        function Model() {
            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var config = arguments[1];

            _classCallCheck(this, Model);

            this.config = config;
            if (id) {
                this.id = id;
            }
        }

        _createClass(Model, [{
            key: 'getAllModels',
            value: function getAllModels() {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    if (cache.public.toArray.length > 0) {
                        resolve(cache.public.toArray);
                    } else {
                        _ajax.ajax.get('/device-models', {
                            queryObj: 'limit=100000',
                            contentType: 'application/hal+json'
                        }).then(function (response) {
                            cache.public.toArray = response.models;
                            _this._makeDictionary(cache.public.toArray);
                            resolve(cache.public.toArray);
                        }).catch(function (error) {
                            reject(error);
                        });
                    }
                });
            }
        }, {
            key: 'getAllPrototypes',
            value: function getAllPrototypes() {
                var _this2 = this;

                return new Promise(function (resolve, reject) {
                    if (prototypeCache.public.toArray.length > 0) {
                        resolve(prototypeCache.public.toArray);
                    } else {
                        _ajax.ajax.get('/device-models/prototypes', {
                            queryObj: 'limit=100000',
                            contentType: 'application/hal+json'
                        }).then(function (response) {
                            prototypeCache.public.toArray = response.prototypes;
                            _this2._makeDictionary(prototypeCache.public.toArray);
                            resolve(prototypeCache.public.toArray);
                        }).catch(function (error) {
                            reject(error);
                        });
                    }
                });
            }
        }, {
            key: 'getModel',
            value: function getModel(id) {
                if (this.id && !id) {
                    id = this.id;
                }

                if (cache.public.toDictionary[id]) {
                    return new Promise(function (resolve, reject) {
                        resolve(cache.public.toDictionary[id]);
                    });
                } else {
                    return new Promise(function (resolve, reject) {
                        _ajax.ajax.get('/device-models/' + id, {
                            contentType: 'application/hal+json'
                        }).then(function (model) {
                            cache.public.toArray.push(model);
                            cache.public.toDictionary[id] = model;
                            resolve(model);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                }
            }
        }, {
            key: '_getModelById',
            value: function _getModelById(id) {
                if (cache.public.toArray.length > 0) {
                    return cache.public.toDictionary[id] || null;
                } else {
                    return null;
                }
            }
        }, {
            key: '_getPublicModelsFromArray',
            value: function _getPublicModelsFromArray() {
                return cache.public.toArray || [];
            }
        }, {
            key: '_getPublicModelsFromDictionary',
            value: function _getPublicModelsFromDictionary() {
                return cache.public.toDictionary || [];
            }
        }, {
            key: '_makeDictionary',
            value: function _makeDictionary(modelsArray) {
                if (!modelsArray) {
                    return;
                }
                if (!cache.public.toDictionary) cache.public.toDictionary = {};
                var len = modelsArray.length;
                var i = 0;
                while (len--) {
                    var model = modelsArray[i];
                    cache.public.toDictionary[model.id] = model;
                    i++;
                }
                return cache.public.toDictionary;
            }
        }]);

        return Model;
    }();

    exports.default = Model;
});