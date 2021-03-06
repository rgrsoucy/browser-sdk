// getAllModels
import { ajax } from '../tools/ajax.js';


function createCache() {
    var cache = {
        init: () => {

        },
        public: {
            toArray: [],
            toDictionary: {}
        },
        clear: () => {
            cache.public.toArray = [];
            cache.public.toDictionary = [];
        }
    };

    return cache;
}

export
let cache = createCache();

export
let prototypeCache = createCache();

export
default class Model {
    constructor(id = null, config) {
        this.config = config;
        if (id) {
            this.id = id;
        }
    }

    getAllModels() {
        return new Promise((resolve, reject) => {
            if (cache.public.toArray.length > 0) {
                resolve(cache.public.toArray);
            } else {
                ajax.get('/device-models', {
                    queryObj: 'limit=100000',
                    contentType: 'application/hal+json'
                }).then((response) => {
                    cache.public.toArray = response.models;
                    this._makeDictionary(cache.public.toArray);
                    resolve(cache.public.toArray);
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }

    getAllPrototypes() {
        return new Promise((resolve, reject) => {
            if (prototypeCache.public.toArray.length > 0) {
                resolve(prototypeCache.public.toArray);
            } else {
                ajax.get('/device-models/prototypes', {
                    queryObj: 'limit=100000',
                    contentType: 'application/hal+json'
                }).then((response) => {
                    prototypeCache.public.toArray = response.prototypes;
                    this._makeDictionary(prototypeCache.public.toArray);
                    resolve(prototypeCache.public.toArray);
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }

    getModel(id) {
        if (this.id && !id) {
            id = this.id;
        }

        if (cache.public.toDictionary[id]) {
            return new Promise((resolve, reject) => {
                resolve(cache.public.toDictionary[id]);
            });
        } else {
            return new Promise((resolve, reject) => {
                ajax.get(`/device-models/${id}`, {
                    contentType: 'application/hal+json'
                }).then((model) => {
                    cache.public.toArray.push(model);
                    cache.public.toDictionary[id] = model;
                    resolve(model);
                }).catch((error) => {
                    reject(error);
                });
            });
        }
    }

    _getModelById(id) {
        if (cache.public.toArray.length > 0) {
            return (cache.public.toDictionary[id] || null);
        } else {
            return null;
        }
    }

    _getPublicModelsFromArray() {
        return cache.public.toArray || [];
    }

    _getPublicModelsFromDictionary() {
        return cache.public.toDictionary || [];
    }

    _makeDictionary(modelsArray) {
        if (!modelsArray) {
            return;
        }
        if (!cache.public.toDictionary) cache.public.toDictionary = {};
        var len = modelsArray.length;
        let i = 0;
        while (len--) {
            let model = modelsArray[i];
            cache.public.toDictionary[model.id] = model;
            i++;
        }
        return cache.public.toDictionary;
    }
}
