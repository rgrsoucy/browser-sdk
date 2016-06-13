// getAllModels
import Ajax from '../tools/ajax.js'

export
default class Model {
  constructor(config) {
    this.config = config;
    this.ajax = new Ajax(config.ajax);
  }


  getAllModels() {
    return new Promise((resolve, reject) => {
      this.ajax.get('device-models?limit=100000', ).then((response) => {
        this.allModels = response;
        resolve(response)
      }).catch((error) => {
        reject(error);
      });
    });
  }
}