"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const influxService_1 = __importDefault(require("./influxService"));
let hap;
class HomebridgeInflux {
    constructor(log, config, api) {
        this.log = log;
        this.name = config.name;
        this.influxService = new influxService_1.default(config.influx);
        this.tempService = new hap.Service.TemperatureSensor(config.name);
        this.tempService
            .getCharacteristic(hap.Characteristic.CurrentTemperature)
            .setProps({ minValue: -100, maxValue: 150 })
            .on("get" /* GET */, this.getTemperatureState.bind(this));
        this.humidityService = new hap.Service.HumiditySensor(config.name);
        this.humidityService
            .getCharacteristic(hap.Characteristic.CurrentRelativeHumidity)
            .setProps({ minValue: 0, maxValue: 150 })
            .on("get" /* GET */, this.getHumidityState.bind(this));
        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "Jon Wingfield")
            .setCharacteristic(hap.Characteristic.Model, "NodeMCU powered SHT21");
    }
    getTemperatureState(callback) {
        this.getRemoteState('Temperature', callback);
    }
    getHumidityState(callback) {
        this.getRemoteState('Humidity', callback);
    }
    getRemoteState(service, callback) {
        this.influxService.queryTempHumidity()
            .then(({ temp, humidity }) => {
            temp = Math.round(temp * 10) / 10;
            humidity = Math.round(humidity);
            this.tempService.setCharacteristic(hap.Characteristic.CurrentTemperature, temp);
            this.humidityService.setCharacteristic(hap.Characteristic.CurrentRelativeHumidity, humidity);
            switch (service) {
                case 'Temperature':
                    return callback(null, temp);
                case 'Humidity':
                    return callback(null, humidity);
            }
        }).catch(err => {
            this.log(err);
            return callback(new Error(err));
        });
    }
    getServices() {
        return [
            this.informationService,
            this.tempService,
            this.humidityService,
        ];
    }
}
module.exports = (api) => {
    hap = api.hap;
    api.registerAccessory('HomebridgeInflux', HomebridgeInflux);
};
//# sourceMappingURL=accessory.js.map