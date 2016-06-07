import Ajax from '../tools/ajax.js'

export default class User {
  constructor(token) {
    this.token = token;
    console.log(token)
    this.ajax = new Ajax({
        uri:"api.relayr.io",
        tokenType:"Bearer",
        token:"3765817364537645"
    });
  }

  getUserInfo(){
    return new Promise((resolve, reject)=>{
        this.ajax.get("/oauth2/user-info").then((reply)=>{

        });
    });
  }

  _getToken(){
    return this.token;
  }
}