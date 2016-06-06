import Device from './entities/Device'


describe('Device', () => {

        let fakeDevice;
        beforeEach(() => {
            //will this stay the same as last time? Almost definitely not...
            // describe('devices', () => {
            //     var relayr;
            //     beforeEach(function() {
            //         relayr = relayrInit();
            //         relayr.account = {
            //             id: 'test-dummy-account-id',
            //             token: 'test-dummy-token'
            //         };
            //     });

            //stub a device object returned from the cloud- this should have all the parameters of a legit device
            //this json will be a fixture, created with a factory

            var fakeDevice = {
                "id": "device-id",
                "name": "fakeName",
                "productNumber": "",
                "description": "",
                "website": "",
                "manufacturer": {},
                "resources": [],
                "firmware": {},
                "cloudDataForFirmwareVersion": {
                    "commands": [],
                    "readings": [{
                        "path": "",
                        "meaning": "",
                        "valueSchema": {
                            "type": ""
                        },
                        "template": ""
                    }],
                    "configurations": []
                }
            }
        })

        describe('can be instantiated', () => {
            it('should be a constructor', () => {
                expect(new Device).toBeA(Device);
            });
        });

        describe('#getDevice', function() {
            let deviceInstance;
            beforeEach(() => {
                deviceInstance = new Device();
            })
            it('should throw an error if no id is provided', function() {
                expect(deviceInstance.getDevice()).toThrow();
            });

            it('should throw an error if no id is provided', function() {
                expect(deviceInstance.getDevice()).toThrow();
            });

            it('should do a GET to users devices', function() {
                Device.getDevice({
                    deviceId: 'device-id'
                }, function() {}, function() {});

                expect(requests.length).toBe(1);
                var req = requests[0];
                expect(req.url).toBe('https://api.relayr.io/devices/device-id');
            });

            it('should resolve promise when it gets device', function(done) {
                Device.getDevice({
                    deviceId: 'device-id'
                }).then(function() {
                    expect(true).toBeTruthy();
                    done();
                }, function() {});

                var req = requests[0];
                req.respond(200, {}, JSON.stringify([]));
            });


            it('should reject promise if the request fails', function(done) {
                Device.getDevice({
                    deviceId: 'device-id'
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