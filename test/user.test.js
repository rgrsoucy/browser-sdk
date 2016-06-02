import User from './entities/user'


describe('user', () => {

        let fakeuser;
        beforeEach(() => {
            //will this stay the same as last time? Almost definitely not...
            // describe('users', () => {
            //     var relayr;
            //     beforeEach(function() {
            //         relayr = relayrInit();
            //         relayr.account = {
            //             id: 'test-dummy-account-id',
            //             token: 'test-dummy-token'
            //         };
            //     });

            //stub a user object returned from the cloud- this should have all the parameters of a legit user
            //this json will be a fixture, created with a factory

            var fakeUser = {
                "id": "fakeUserId",
                "name": "fakeUserName"
                "email": "fakeName@fakeemail.com",
                // "token": "fakeToken",
                // "devices": [{}, {}, {}]
            }
        })

        describe('can be instantiated', () => {
            it('should be a constructor', () => {
                expect(new User).toBeA(User);
            });
        });

        describe('#getuser', function() {
            let userInstance;
            let fakeToken = 'sdfhsjhzhbfzhb'
            beforeEach(() => {
                userInstance = new User(fakeToken);
            })

            //THIS ONE is a correct example, everything else is junk
            it('should throw an error if no id is provided', function() {
                expect(userInstance.getuser()).toThrow();
            });

            it('should do a GET to get the user object', function() {
                expect(userInstance.getuser({
                    userId: 'user-id'
                }, function() {}, function() {})). //toReturn? or something?


                expect(requests.length).toBe(1);
                var req = requests[0];
                expect(req.url).toBe('https://api.relayr.io/users/user-id');
            });

            it('should resolve promise when it gets user', function(done) {
                user.getuser({
                    userId: 'user-id'
                }).then(function() {
                    expect(true).toBeTruthy();
                    done();
                }, function() {});

                var req = requests[0];
                req.respond(200, {}, JSON.stringify([]));
            });


            it('should reject promise if the request fails', function(done) {
                user.getuser({
                    userId: 'user-id'
                }).then(function() {}, function() {
                    expect(true).toBeTruthy();
                    done();
                });

                var req = requests[0];
                req.respond(401, {
                    "Content-Type": "application/json"
                }, JSON.stringify({
                    error: "error"
                }));
            });
        });