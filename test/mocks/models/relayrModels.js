export
let relayrMockModelOld = [{
    "id": "2bc156b4-b1bf-4d65-9f2a-8923c7f20b85",
    "name": "NetAtmo NAModule4 Indoor",
    "manufacturer": "NetAtmo",
    "readings": [],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "245fdfe4-da91-4e4f-b884-739ae902fba0",
    "name": "NetAtmo NATherm1",
    "manufacturer": "NetAtmo",
    "readings": [{
        "meaning": "temperature",
        "unit": "celsius",
        "maximum": 50,
        "minimum": 0,
        "precision": 0.10000000149011612
    }],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "fcefdcdf-b241-440d-8734-27123e4f3d5d",
    "name": "Siemens Dishwascher",
    "manufacturer": "Siemens",
    "readings": [{
        "meaning": "phase",
        "unit": "integer",
        "maximum": 4,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "intensiv_zone",
        "unit": "boolean",
        "path": "programme"
    }, {
        "meaning": "eco_as_default",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "operation_state",
        "unit": "integer",
        "maximum": 8,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "hygiene_plus",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "brilliance_dry",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "auto_power_off",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "finished",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "paused",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "aborted",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "turbidity",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0,
        "path": "drainage"
    }, {
        "meaning": "drain_blockage",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0,
        "path": "drainage"
    }, {
        "meaning": "check_filter",
        "unit": "integer",
        "maximum": 3,
        "minimum": 0,
        "path": "drainage"
    }, {
        "meaning": "rinse_aid_lack",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0,
        "path": "consumables"
    }, {
        "meaning": "rinse_aid",
        "unit": "integer",
        "maximum": 6,
        "minimum": 0,
        "path": "consumables"
    }, {
        "meaning": "display",
        "unit": "boolean",
        "path": "display"
    }, {
        "meaning": "luminosity",
        "unit": "boolean",
        "path": "interior"
    }, {
        "meaning": "interior_light",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "interior"
    }, {
        "meaning": "alarm",
        "unit": "dateTime",
        "path": "clock"
    }, {
        "meaning": "time",
        "unit": "dateTime",
        "path": "clock"
    }, {
        "meaning": "locked",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "door"
    }, {
        "meaning": "open",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "door"
    }, {
        "meaning": "energy_management",
        "unit": "integer",
        "maximum": 2,
        "minimum": 1,
        "path": "power_unit"
    }, {
        "meaning": "power",
        "unit": "boolean",
        "maximum": 2,
        "minimum": 1,
        "path": "power_unit"
    }],
    "commands": [{
        "command": "energy_management",
        "path": "power_unit",
        "unit": "integer",
        "maximum": 2,
        "minimum": 1
    }, {
        "command": "locked",
        "path": "door",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "hardness",
        "path": "pump"
    }, {
        "command": "luminosity",
        "path": "interior",
        "unit": "boolean"
    }, {
        "command": "rinse_aid",
        "path": "consumables",
        "unit": "integer",
        "maximum": 6,
        "minimum": 0
    }, {
        "command": "turbidity",
        "path": "drainage",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0
    }, {
        "command": "brilliance_dry",
        "path": "programme",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "hygiene_plus",
        "path": "programme",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "eco_as_default",
        "path": "programme",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "intensiv_zone",
        "path": "programme",
        "unit": "boolean"
    }],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "ecf6cf94-cb07-43ac-a85e-dccf26b48c86",
    "name": "Wunderbar Thermometer & Humidity Sensor",
    "manufacturer": "Relayr GmbH",
    "readings": [{
        "meaning": "temperature",
        "unit": "celsius",
        "maximum": 100,
        "minimum": -100,
        "precision": 0.25
    }, {
        "meaning": "humidity",
        "unit": "percent"
    }],
    "commands": [{
        "command": "cmd",
        "path": "led",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }],
    "firmwareVersions": [{
        "version": "2.0.0",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }, {
        "version": "1.0.0",
        "configuration": {
            "schema": {
                "title": "Relayr configuration schema",
                "type": "object",
                "properties": {
                    "frequency": {
                        "description": "Frequency of the sensor updates in milliseconds",
                        "type": "integer",
                        "minimum": 200
                    }
                },
                "required": ["frequency"]
            },
            "defaultValues": {
                "frequency": 1000
            }
        }
    }]
}, {
    "id": "0a1c8de1-163a-4784-9e37-f5963a0f2048",
    "name": "Nest Smoke Alarm",
    "manufacturer": "Nest Labs",
    "readings": [{
        "meaning": "co2",
        "unit": "ppm",
        "maximum": 5000,
        "minimum": 0,
        "precision": 50
    }, {
        "meaning": "humidity",
        "unit": "percentage",
        "maximum": 100,
        "minimum": 0,
        "precision": 3
    }, {
        "meaning": "temperature",
        "unit": "celsius",
        "maximum": 50,
        "minimum": 0,
        "precision": 0.30000001192092896
    }, {
        "meaning": "is_manual_test_active",
        "unit": "boolean"
    }, {
        "meaning": "smoke_alarm_state",
        "unit": "boolean"
    }, {
        "meaning": "co_alarm_state",
        "unit": "boolean"
    }],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "173c44b5-334e-493f-8eb8-82c8cc65d29f",
    "name": "Wunderbar Accelerometer & Gyroscope",
    "manufacturer": "Relayr GmbH",
    "readings": [{
        "meaning": "angularSpeed",
        "unit": "degrees_per_second"
    }, {
        "meaning": "acceleration",
        "unit": "g"
    }],
    "commands": [{
        "command": "cmd",
        "path": "led",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }],
    "firmwareVersions": [{
        "version": "2.0.0",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }, {
        "version": "1.0.0",
        "configuration": {
            "schema": {
                "title": "Relayr configuration schema",
                "type": "object",
                "properties": {
                    "frequency": {
                        "description": "Frequency of the sensor updates in milliseconds",
                        "type": "integer",
                        "minimum": 200
                    }
                },
                "required": ["frequency"]
            },
            "defaultValues": {
                "frequency": 1000
            }
        }
    }]
}, {
    "id": "b708d836-2017-4ef3-bb79-bdba21ccd141",
    "name": "Sensiviot Microphone",
    "manufacturer": "Sensiviot",
    "readings": [{
        "meaning": "noiseLevel",
        "unit": "dba"
    }],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "b05aeb92-2142-4abe-914d-abe4cb24d37a",
    "name": "Sensiviot Light Sensor",
    "manufacturer": "Sensiviot",
    "readings": [{
        "meaning": "luminosity",
        "unit": "lumen"
    }],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "87ed910c-6e28-4606-99b3-16a3f880f459",
    "name": "KeyBox",
    "manufacturer": "KeyBox",
    "readings": [],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "95359405-4370-4ba9-b975-c267a53bdc64",
    "name": "NetAtmo NAModule1 Outdoor",
    "manufacturer": "NetAtmo",
    "readings": [{
        "meaning": "humidity",
        "unit": "percentage",
        "maximum": 100,
        "minimum": 0,
        "precision": 3
    }, {
        "meaning": "temperature",
        "unit": "celsius",
        "maximum": 65,
        "minimum": -40,
        "precision": 0.30000001192092896
    }],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "4f38b6c6-a8e9-4f93-91cd-2ac4064b7b5a",
    "name": "Wunderbar Microphone",
    "manufacturer": "Relayr GmbH",
    "readings": [{
        "meaning": "noiseLevel",
        "unit": "dba"
    }],
    "commands": [{
        "command": "cmd",
        "path": "led",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }],
    "firmwareVersions": [{
        "version": "2.0.0",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }, {
        "version": "1.0.0",
        "configuration": {
            "schema": {
                "title": "Relayr configuration schema",
                "type": "object",
                "properties": {
                    "frequency": {
                        "description": "Frequency of the sensor updates in milliseconds",
                        "type": "integer",
                        "minimum": 200
                    }
                },
                "required": ["frequency"]
            },
            "defaultValues": {
                "frequency": 1000
            }
        }
    }]
}, {
    "id": "715e07d1-c80f-4e14-82a0-ebb19e71c2d2",
    "name": "Sensiviot Thermometer",
    "manufacturer": "Sensiviot",
    "readings": [{
        "meaning": "temperature",
        "unit": "celsius"
    }],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "d6002302-846e-4819-a243-e04df69a4894",
    "name": "NetAtmo NAModule3 Rain",
    "manufacturer": "NetAtmo",
    "readings": [{
        "meaning": "rain",
        "unit": "mm",
        "maximum": 150,
        "minimum": 0.20000000298023224,
        "precision": 1
    }],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "ebd828dd-250c-4baf-807d-69d85bed065b",
    "name": "Wunderbar Bridge Module",
    "manufacturer": "Relayr GmbH",
    "readings": [{
        "meaning": "raw",
        "unit": "raw"
    }],
    "commands": [{
        "command": "cmd",
        "path": "led",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }],
    "firmwareVersions": [{
        "version": "1.0.0",
        "configuration": {
            "schema": {
                "title": "Relayr configuration schema",
                "type": "object",
                "properties": {
                    "frequency": {
                        "description": "Frequency of the sensor updates in milliseconds",
                        "type": "integer",
                        "minimum": 200
                    }
                },
                "required": ["frequency"]
            },
            "defaultValues": {
                "frequency": 1000
            }
        }
    }]
}, {
    "id": "f37017d9-8e90-4312-be4d-e736b6c9fbb1",
    "name": "Wunderbar UART Bridge Module",
    "manufacturer": "Relayr GmbH",
    "readings": [],
    "commands": [],
    "firmwareVersions": [{
        "version": "2.0.0",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "96889445-5b12-4886-80ba-120913eac2fe",
    "name": "Bosch Dishwascher",
    "manufacturer": "Bosch",
    "readings": [{
        "meaning": "phase",
        "unit": "integer",
        "maximum": 4,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "intensiv_zone",
        "unit": "boolean",
        "path": "programme"
    }, {
        "meaning": "eco_as_default",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "operation_state",
        "unit": "integer",
        "maximum": 8,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "hygiene_plus",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "brilliance_dry",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "auto_power_off",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "finished",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "paused",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "sabbath",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "aborted",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "turbidity",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0,
        "path": "drainage"
    }, {
        "meaning": "drain_blockage",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0,
        "path": "drainage"
    }, {
        "meaning": "check_filter",
        "unit": "integer",
        "maximum": 3,
        "minimum": 0,
        "path": "drainage"
    }, {
        "meaning": "rinse_aid_lack",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0,
        "path": "consumables"
    }, {
        "meaning": "rinse_aid",
        "unit": "integer",
        "maximum": 6,
        "minimum": 0,
        "path": "consumables"
    }, {
        "meaning": "display",
        "unit": "boolean",
        "path": "display"
    }, {
        "meaning": "clockness",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "display"
    }, {
        "meaning": "luminosity",
        "unit": "boolean",
        "path": "interior"
    }, {
        "meaning": "interior_light",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "interior"
    }, {
        "meaning": "alarm",
        "unit": "dateTime",
        "path": "clock"
    }, {
        "meaning": "time",
        "unit": "dateTime",
        "path": "clock"
    }, {
        "meaning": "locked",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "door"
    }, {
        "meaning": "open",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "door"
    }, {
        "meaning": "energy_management",
        "unit": "integer",
        "maximum": 2,
        "minimum": 1,
        "path": "power_unit"
    }, {
        "meaning": "power",
        "unit": "boolean",
        "maximum": 2,
        "minimum": 1,
        "path": "power_unit"
    }],
    "commands": [{
        "command": "energy_management",
        "path": "power_unit",
        "unit": "integer",
        "maximum": 2,
        "minimum": 1
    }, {
        "command": "locked",
        "path": "door",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "hardness",
        "path": "pump"
    }, {
        "command": "luminosity",
        "path": "interior",
        "unit": "boolean"
    }, {
        "command": "rinse_aid",
        "path": "consumables",
        "unit": "integer",
        "maximum": 6,
        "minimum": 0
    }, {
        "command": "turbidity",
        "path": "drainage",
        "unit": "integer",
        "maximum": 2,
        "minimum": 0
    }, {
        "command": "brilliance_dry",
        "path": "programme",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "hygiene_plus",
        "path": "programme",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "eco_as_default",
        "path": "programme",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "intensiv_zone",
        "path": "programme",
        "unit": "boolean"
    }],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "9cd72fa9-37a1-4a46-aff4-0f695417857d",
    "name": "NetAtmo NAMain Indoor",
    "manufacturer": "NetAtmo",
    "readings": [{
        "meaning": "sound_level",
        "unit": "db",
        "maximum": 120,
        "minimum": 35
    }, {
        "meaning": "pressure",
        "unit": "mbar",
        "maximum": 1160,
        "minimum": 260,
        "precision": 1
    }, {
        "meaning": "co2",
        "unit": "ppm",
        "maximum": 5000,
        "minimum": 0,
        "precision": 50
    }, {
        "meaning": "humidity",
        "unit": "percentage",
        "maximum": 100,
        "minimum": 0,
        "precision": 3
    }, {
        "meaning": "temperature",
        "unit": "celsius",
        "maximum": 50,
        "minimum": 0,
        "precision": 0.30000001192092896
    }],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "a7ec1b21-8582-4304-b1cf-15a1fc66d1e8",
    "name": "Wunderbar Light & Proximity Sensor",
    "manufacturer": "Relayr GmbH",
    "readings": [{
        "meaning": "proximity",
        "unit": "number"
    }, {
        "meaning": "color",
        "unit": "rgb"
    }, {
        "meaning": "luminosity",
        "unit": "lumen"
    }],
    "commands": [{
        "command": "cmd",
        "path": "led",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }],
    "firmwareVersions": [{
        "version": "2.0.0",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }, {
        "version": "1.0.0",
        "configuration": {
            "schema": {
                "title": "Relayr configuration schema",
                "type": "object",
                "properties": {
                    "frequency": {
                        "description": "Frequency of the sensor updates in milliseconds",
                        "type": "integer",
                        "minimum": 200
                    }
                },
                "required": ["frequency"]
            },
            "defaultValues": {
                "frequency": 1000
            }
        }
    }]
}, {
    "id": "bab45b9c-1c44-4e71-8e98-a321c658df47",
    "name": "Wunderbar Infrared Sensor",
    "manufacturer": "Relayr GmbH",
    "readings": [],
    "commands": [{
        "command": "cmd",
        "path": "led",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }],
    "firmwareVersions": [{
        "version": "2.0.0",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }, {
        "version": "1.0.0",
        "configuration": {
            "schema": {
                "title": "Relayr configuration schema",
                "type": "object",
                "properties": {
                    "frequency": {
                        "description": "Frequency of the sensor updates in milliseconds",
                        "type": "integer",
                        "minimum": 200
                    }
                },
                "required": ["frequency"]
            },
            "defaultValues": {
                "frequency": 1000
            }
        }
    }]
}, {
    "id": "39225641-1c13-43a8-bcd1-7e88284faa5b",
    "name": "Bosch oven",
    "manufacturer": "Bosch",
    "readings": [{
        "meaning": "finished",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "paused",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "sabbath",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "aborted",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "plugged",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "water_tank"
    }, {
        "meaning": "emptiness",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "water_tank"
    }, {
        "meaning": "clockness",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "display"
    }, {
        "meaning": "plugged",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "meat_probe"
    }, {
        "meaning": "temperature",
        "unit": "celsius",
        "path": "meat_probe"
    }, {
        "meaning": "luminosity",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "cavity"
    }, {
        "meaning": "temperature",
        "unit": "celsius",
        "path": "cavity"
    }, {
        "meaning": "tone",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "sound"
    }, {
        "meaning": "alarm",
        "unit": "dateTime",
        "path": "clock"
    }, {
        "meaning": "time",
        "unit": "dateTime",
        "path": "clock"
    }, {
        "meaning": "locked",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "door"
    }, {
        "meaning": "open",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "door"
    }, {
        "meaning": "power",
        "unit": "integer",
        "maximum": 3,
        "minimum": 1,
        "path": "power_unit"
    }],
    "commands": [{
        "command": "power",
        "path": "power_unit",
        "unit": "integer",
        "maximum": 3,
        "minimum": 1
    }, {
        "command": "locked",
        "path": "door",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "time",
        "path": "clock",
        "unit": "dateTime"
    }, {
        "command": "alarm",
        "path": "clock",
        "unit": "dateTime"
    }, {
        "command": "sound_level",
        "path": "sound",
        "maximum": 4,
        "minimum": 0
    }, {
        "command": "tone",
        "path": "sound",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "signal_duration",
        "path": "sound",
        "maximum": 2,
        "minimum": 0
    }, {
        "command": "luminosity",
        "path": "cavity",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "brightness",
        "path": "display",
        "maximum": 4,
        "minimum": 1
    }, {
        "command": "clockness",
        "path": "display",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "hardness",
        "path": "water_tank",
        "maximum": 4,
        "minimum": 0
    }, {
        "command": "selected",
        "path": "programme"
    }, {
        "command": "aborted",
        "path": "programme",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "sabbath",
        "path": "programme",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "paused",
        "path": "programme",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "wattage",
        "path": "microwave"
    }],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "c8ea5141-f05e-495c-ae6b-5c6604e401fc",
    "name": "Wunderbar ADC Bridge Module",
    "manufacturer": "Relayr GmbH",
    "readings": [],
    "commands": [],
    "firmwareVersions": [{
        "version": "2.0.0",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "bf22eb94-7de3-4e7e-a367-46682f2785a2",
    "name": "UI Tablet App",
    "manufacturer": "KeyBox",
    "readings": [],
    "commands": [],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "39c07b43-5937-4605-b3a8-507a188aeab0",
    "name": "Siemens Oven",
    "manufacturer": "Siemens",
    "readings": [{
        "meaning": "finished",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "paused",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "sabbath",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "aborted",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "programme"
    }, {
        "meaning": "plugged",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "water_tank"
    }, {
        "meaning": "emptiness",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "water_tank"
    }, {
        "meaning": "clockness",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "display"
    }, {
        "meaning": "plugged",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "meat_probe"
    }, {
        "meaning": "temperature",
        "unit": "celsius",
        "path": "meat_probe"
    }, {
        "meaning": "luminosity",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "cavity"
    }, {
        "meaning": "temperature",
        "unit": "celsius",
        "path": "cavity"
    }, {
        "meaning": "tone",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "sound"
    }, {
        "meaning": "alarm",
        "unit": "dateTime",
        "path": "clock"
    }, {
        "meaning": "time",
        "unit": "dateTime",
        "path": "clock"
    }, {
        "meaning": "locked",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0,
        "path": "door"
    }, {
        "meaning": "open",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0,
        "path": "door"
    }, {
        "meaning": "power",
        "unit": "integer",
        "maximum": 3,
        "minimum": 1,
        "path": "power_unit"
    }],
    "commands": [{
        "command": "power",
        "path": "power_unit",
        "unit": "integer",
        "maximum": 3,
        "minimum": 1
    }, {
        "command": "locked",
        "path": "door",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "time",
        "path": "clock",
        "unit": "dateTime"
    }, {
        "command": "alarm",
        "path": "clock",
        "unit": "dateTime"
    }, {
        "command": "sound_level",
        "path": "sound",
        "maximum": 4,
        "minimum": 0
    }, {
        "command": "tone",
        "path": "sound",
        "unit": "boolean"
    }, {
        "command": "signal_duration",
        "path": "sound",
        "maximum": 2,
        "minimum": 0
    }, {
        "command": "luminosity",
        "path": "cavity",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "brightness",
        "path": "display",
        "maximum": 4,
        "minimum": 1
    }, {
        "command": "clockness",
        "path": "display",
        "unit": "boolean",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "hardness",
        "path": "water_tank",
        "maximum": 4,
        "minimum": 0
    }, {
        "command": "selected",
        "path": "programme"
    }, {
        "command": "aborted",
        "path": "programme",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "sabbath",
        "path": "programme",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "paused",
        "path": "programme",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
    }, {
        "command": "wattage",
        "path": "microwave"
    }],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}, {
    "id": "33110278-08df-4302-8826-8a5a85cf75a7",
    "name": "Nest Thermostat",
    "manufacturer": "Nest Labs",
    "readings": [{
        "meaning": "humidity",
        "unit": "percentage",
        "maximum": 90,
        "minimum": 0,
        "precision": 1
    }, {
        "meaning": "temperature",
        "unit": "celsius",
        "maximum": 100,
        "minimum": -100,
        "precision": 1
    }],
    "commands": [{
        "command": "fan_timer_active",
        "path": "fan_timer_active",
        "unit": "boolean"
    }, {
        "command": "hvac_mode",
        "path": "hvac_mode",
        "unit": "string",
        "example": "heat|cool|heat-cool|off"
    }, {
        "command": "target_temperature_f",
        "description": "Desired temperature, in full degrees Fahrenheit (1°F). Used when hvac_mode = “heat” or “cool”.",
        "path": "target_temperature_f",
        "unit": "fahrenheit",
        "maximum": 70,
        "minimum": 90
    }, {
        "command": "target_temperature_c",
        "description": "Desired temperature, in half degrees Celsius (0.5°C). Used when hvac_mode = “heat” or “cool”.",
        "path": "target_temperature_c",
        "unit": "celcius",
        "maximum": 9,
        "minimum": 32
    }, {
        "command": "target_temperature_high_f",
        "description": "Maximum target temperature, displayed in whole degrees Fahrenheit (1°F). Used when hvac_mode = “heat-cool” (Heat • Cool mode).",
        "path": "target_temperature_high_f",
        "unit": "fahrenheit",
        "maximum": 70,
        "minimum": 90
    }, {
        "command": "target_temperature_high_c",
        "description": "Maximum target temperature, displayed in half degrees Celsius (0.5°C). Used when hvac_mode = “heat-cool” (Heat • Cool mode).",
        "path": "target_temperature_high_c",
        "unit": "celcius",
        "maximum": 9,
        "minimum": 32
    }, {
        "command": "target_temperature_low_f",
        "description": "Minimum target temperature, displayed in whole degrees Fahrenheit (1°F). Used when hvac_mode = “heat-cool” (Heat • Cool mode).",
        "path": "target_temperature_low_f",
        "unit": "fahrenheit",
        "maximum": 70,
        "minimum": 90
    }, {
        "command": "target_temperature_low_c",
        "description": "Minimum target temperature, displayed in half degrees Celsius (0.5°C). Used when hvac_mode = “heat-cool” (Heat • Cool mode).",
        "path": "target_temperature_low_c",
        "unit": "celcius",
        "maximum": 9,
        "minimum": 32
    }],
    "firmwareVersions": [{
        "version": "0.0.1",
        "configuration": {
            "schema": {},
            "defaultValues": {}
        }
    }]
}]

export
let relayrMockModels = {
    "_links": {
        "self": {
            "href": "/device-models"
        },
        "next": {
            "href": "/device-models?limit=20&offset=10"
        },
        "last": {
            "href": "/device-models?limit=97&offset=87"
        },
        "first": {
            "href": "/device-models"
        }
    },
    "count": 97,
    "models": [{
        "id": "85dad151-e0e1-407b-9ec8-25f28de92849",
        "name": "OpenBerlin Lights",
        "productNumber": "0001",
        "description": "Soll_Dimmwert",
        "website": "https://cisco.com/",
        "manufacturer": {
            "name": "OpenBerlin",
            "website": "https://cisco.com/",
            "contactInfo": {
                "email": "info@relayr.com",
                "phone": "+491792989866"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [],
                        "configurations": [{
                            "name": "Present Value",
                            "path": "",
                            "valueSchema": {
                                "type": "number",
                                "unit": "percent",
                                "maximum": 100,
                                "minimum": 0
                            }
                        }]
                    }
                },
                "repository": "",
                "releaseDate": "2014-17-10",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }, {
        "id": "403b119e-2633-4ddf-bb33-94e10899a082",
        "name": "OpenBerlin relayr Watchdog",
        "productNumber": "0001",
        "description": "Watchdog relayr",
        "website": "https://cisco.com/",
        "manufacturer": {
            "name": "OpenBerlin",
            "website": "https://cisco.com/",
            "contactInfo": {
                "email": "info@relayr.com",
                "phone": "+491792989866"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [],
                        "configurations": [{
                            "name": "Present Value",
                            "path": "",
                            "valueSchema": {
                                "enum": [
                                    "active",
                                    "inactive"
                                ],
                                "type": "string"
                            }
                        }]
                    }
                },
                "repository": "",
                "releaseDate": "2014-17-10",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }, {
        "id": "5b16aa68-c0b3-4d40-b6ff-df35cc2d0f43",
        "name": "door",
        "productNumber": "",
        "description": "",
        "website": "http://default.com",
        "manufacturer": {
            "name": "",
            "website": "http://www.relayr.io",
            "contactInfo": {
                "email": "info@relayr.io"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [{
                            "path": "",
                            "meaning": "Open",
                            "valueSchema": {
                                "type": "boolean"
                            }
                        }],
                        "configurations": []
                    }
                },
                "repository": "",
                "releaseDate": "",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }, {
        "id": "72e3b133-c707-498d-9605-86a752ac405b",
        "name": "WhiteBox",
        "productNumber": "",
        "description": "POE Sensor board",
        "website": "http://relayr.io",
        "manufacturer": {
            "name": "relayr inc",
            "website": "http://relayr.io",
            "contactInfo": {
                "email": "info@relayr.io"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [{
                            "path": "",
                            "meaning": "temperature",
                            "valueSchema": {
                                "type": "number",
                                "unit": "celcius",
                                "maximum": 70,
                                "minimum": -25
                            }
                        }, {
                            "path": "",
                            "meaning": "humidity",
                            "valueSchema": {
                                "type": "number",
                                "unit": "percent"
                            }
                        }, {
                            "path": "",
                            "meaning": "luminosity",
                            "valueSchema": {
                                "type": "integer",
                                "unit": "lux",
                                "maximum": 64000,
                                "minimum": 0
                            }
                        }, {
                            "path": "",
                            "meaning": "proximity",
                            "valueSchema": {
                                "type": "integer",
                                "maximum": 1,
                                "minimum": 0
                            }
                        }],
                        "configurations": []
                    }
                },
                "repository": "",
                "releaseDate": "",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }, {
        "id": "7bd31192-b63d-4178-b3f3-166f3f8dc2a3",
        "name": "Whitebox Wireless Collection",
        "productNumber": "",
        "description": "A grouping of Whitebox Wireless Sensor Modules",
        "website": "http://relayr.io",
        "manufacturer": {
            "name": "relayr GmbH",
            "website": "http://relayr.io",
            "contactInfo": {
                "email": "info@relayr.io"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [{
                            "path": "main",
                            "meaning": "presence",
                            "valueSchema": {
                                "type": "boolean"
                            }
                        }, {
                            "path": "main",
                            "meaning": "audio",
                            "valueSchema": {
                                "type": "number",
                                "unit": "dBa",
                                "maximum": 120,
                                "minimum": 35
                            }
                        }, {
                            "path": "main",
                            "meaning": "motion",
                            "valueSchema": {
                                "type": "number",
                                "unit": "percent",
                                "maximum": 100,
                                "minimum": 0
                            }
                        }, {
                            "path": "main",
                            "meaning": "luminosity",
                            "valueSchema": {
                                "type": "number",
                                "unit": "lux",
                                "maximum": 5000,
                                "minimum": 0
                            }
                        }, {
                            "path": "main",
                            "meaning": "humidity",
                            "valueSchema": {
                                "type": "number",
                                "unit": "RH%",
                                "maximum": 100,
                                "minimum": 0
                            }
                        }, {
                            "path": "main",
                            "meaning": "temperature",
                            "valueSchema": {
                                "type": "number",
                                "unit": "celcius",
                                "maximum": 70,
                                "minimum": -20
                            }
                        }],
                        "configurations": []
                    }
                },
                "repository": "",
                "releaseDate": "",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }, {
        "id": "18d5a642-4a56-4d02-ae69-d671fd032ccb",
        "name": "OpenBerlin Color Lights",
        "productNumber": "0001",
        "description": "Soll_Farbwert",
        "website": "https://cisco.com/",
        "manufacturer": {
            "name": "OpenBerlin",
            "website": "https://cisco.com/",
            "contactInfo": {
                "email": "info@relayr.com",
                "phone": "+491792989866"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [],
                        "configurations": [{
                            "name": "Present Value",
                            "path": "",
                            "valueSchema": {
                                "type": "number",
                                "unit": "percent",
                                "maximum": 100,
                                "minimum": 0
                            }
                        }]
                    }
                },
                "repository": "",
                "releaseDate": "2014-17-10",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }, {
        "id": "53f022ab-6764-4e7b-b1b9-c799f31b088c",
        "name": "Onboarding Raspi",
        "productNumber": "",
        "description": "Demo Raspberry Pi",
        "website": "http://relayr.io",
        "manufacturer": {
            "name": "",
            "website": "http://example.com",
            "contactInfo": {
                "email": "info@example.com"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [{
                            "path": "main",
                            "meaning": "random",
                            "valueSchema": {
                                "type": "number",
                                "maximum": 100
                            }
                        }],
                        "configurations": []
                    }
                },
                "repository": "",
                "releaseDate": "",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }, {
        "id": "2bc156b4-b1bf-4d65-9f2a-8923c7f20b85",
        "name": "NetAtmo Indoor Module",
        "productNumber": "NetAtmo NAModule1 Indoor",
        "description": "Use indoor temperature, relative humidity and CO2 readings to live in a healthier home.",
        "website": "https://www.netatmo.com/en-US/product/weather-station",
        "manufacturer": {
            "name": "Netatmo",
            "website": "https://netatmo.com",
            "contactInfo": {
                "email": "support@netatmo.com",
                "phone": ""
            }
        },
        "resources": [{
            "id": "f1576c82-29f7-11e5-b345-feff819cdc9f",
            "type": "icon",
            "mediaUrl": "https://s3-eu-west-1.amazonaws.com/device-models/netatmo-indoor.jpg",
            "mimeType": "image/jpg"
        }],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [{
                            "path": "",
                            "meaning": "temperature",
                            "valueSchema": {
                                "type": "number",
                                "unit": "celsius",
                                "maximum": 65,
                                "minimum": -40
                            }
                        }, {
                            "path": "",
                            "meaning": "humidity",
                            "valueSchema": {
                                "type": "number",
                                "unit": "percent",
                                "maximum": 100,
                                "minimum": 0
                            }
                        }, {
                            "path": "",
                            "meaning": "co2",
                            "valueSchema": {
                                "type": "integer",
                                "unit": "ppm",
                                "maximum": 5000,
                                "minimum": 0
                            }
                        }],
                        "configurations": []
                    }
                },
                "repository": "",
                "releaseDate": "2015-06-15",
                "releaseNotes": "",
                "documentation": "https://dev.netatmo.com/doc/devices/weatherstation"
            }
        }
    }, {
        "id": "d8018498-f4e6-4b30-8178-22e8d08bb8a0",
        "name": "Photon",
        "productNumber": "001",
        "description": "A tiny Wi-Fi development kit for prototyping your IoT product. Reprogrammable and connected to the cloud.",
        "website": "https://store.particle.io/?product=particle-photon",
        "manufacturer": {
            "name": "Particle",
            "website": "https://www.particle.io",
            "contactInfo": {
                "email": "info@particle.io",
                "phone": "+491792989866"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [{
                            "name": "d1",
                            "path": "",
                            "valueSchema": {
                                "enum": [
                                    "high",
                                    "low"
                                ],
                                "type": "string"
                            }
                        }, {
                            "name": "d0",
                            "path": "",
                            "valueSchema": {
                                "enum": [
                                    "high",
                                    "low"
                                ],
                                "type": "string"
                            }
                        }, {
                            "name": "color",
                            "path": "",
                            "valueSchema": {
                                "enum": [
                                    "green",
                                    "red",
                                    "blue"
                                ],
                                "type": "string"
                            }
                        }],
                        "readings": [{
                            "path": "",
                            "meaning": "analog1",
                            "valueSchema": {
                                "type": "integer",
                                "maximum": 4095,
                                "minimum": 0
                            }
                        }, {
                            "path": "",
                            "meaning": "analog0",
                            "valueSchema": {
                                "type": "integer",
                                "maximum": 4095,
                                "minimum": 0
                            }
                        }],
                        "configurations": [{
                            "name": "frequency",
                            "path": "",
                            "valueSchema": {
                                "type": "integer",
                                "unit": "milliseconds",
                                "maximum": 5000,
                                "minimum": 200
                            }
                        }]
                    }
                },
                "repository": "",
                "releaseDate": "2016-01-10",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }, {
        "id": "8310e159-bcd2-47e7-990b-78ecd34b9908",
        "name": "AP CMX Data",
        "productNumber": "",
        "description": "CMX Data POSTed from a Meraki AP",
        "website": "https://relayr.io",
        "manufacturer": {
            "name": "Cisco Meraki",
            "website": "https://meraki.cisco.com",
            "contactInfo": {
                "email": "jeff@relayr.io"
            }
        },
        "resources": [],
        "firmware": {
            "1.0.0": {
                "binaries": "",
                "transport": {
                    "cloud": {
                        "commands": [],
                        "readings": [{
                            "path": "",
                            "meaning": "apData"
                        }],
                        "configurations": []
                    }
                },
                "repository": "",
                "releaseDate": "",
                "releaseNotes": "",
                "documentation": ""
            }
        }
    }],
    "limit": 10,
    "offset": 0
}