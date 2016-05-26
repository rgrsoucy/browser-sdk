class User {
  constructor(token) {
    this.token = token;
    _getUserById();
  }

  _getUserById(){
    this.userId = "123";
    this.email = "email@relayr.io"
  }

  get token() {
    return this.token;
  }


}

module.exports =  User;
