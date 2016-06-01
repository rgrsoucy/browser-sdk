import expect from 'expect';
import Relayr from '../src/main';

describe('Main', () => {
        describe('can be instantiated', () => {
            it('should be a constructor', () => {
                expect(new Relayr).toBeA(Relayr);
            });
            //check that relayr should be instantiated with tools, ID, etc (??)
        });




        describe('Device', () => {
            let device;
            beforeEach(() => {
                //stub a device object returned from the cloud
            })

            describe('can be instantiated', () => {
                it('should be a constructor', () => {
                    expect(new Device).toBeA(Device);
                });
            });

            // getDevice
            describe('#getDevice', () => {
                it('should get the device', () => {

                });
            });

            // getDeviceData
            describe('#getDeviceData', () => {
                it('should get the device data', () => {

                });
            });

            // getDeviceState
            describe('#getDeviceState', () => {
                it('should get the device state', () => {

                });
            });

            // sendCommand
            describe('#sendCommand', () => {
                it('should send a command with good id info', () => {

                });

                it('should send a command with bad id info', () => {

                });
            });

        });





        //Group
        // getAllGroups

        //Model
        // getAllModels

        //Transmitter
        // getTransmitters
        // deleteTransmitter
        // updateTransmitter

        //User
        //getToken
        //setToken
        //hasToken
        //getUserInfo
        //logout
        // getAllDevices