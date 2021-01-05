import {
    AccessoryConfig,
    AccessoryPlugin,
    API,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    HAP,
    Logging,
    Service
  } from "homebridge";
import InfluxService from "./influxService";

let hap: HAP;

export = (api: API) => {
    hap = api.hap;
    api.registerAccessory('HomebridgeInflux', HomebridgeInflux);
}

class HomebridgeInflux implements AccessoryPlugin {
    private readonly log: Logging;
    private readonly name: string;
    private readonly tempService: Service;
    private readonly humidityService: Service;
    private readonly informationService: Service;
    private readonly influxService: InfluxService;

    constructor(log: Logging, config: AccessoryConfig, api: API) {
        this.log = log;
        this.name = config.name;

        this.influxService = new InfluxService(config.influx);

        this.tempService = new hap.Service.TemperatureSensor(config.name);
        this.tempService
            .getCharacteristic(hap.Characteristic.CurrentTemperature)
            .setProps({ minValue: -100, maxValue: 150 })
            .on(CharacteristicEventTypes.GET, this.getTemperatureState.bind(this));

        this.humidityService = new hap.Service.HumiditySensor(config.name);
        this.humidityService
            .getCharacteristic(hap.Characteristic.CurrentRelativeHumidity)
            .setProps({ minValue: 0, maxValue: 150 })
            .on(CharacteristicEventTypes.GET, this.getHumidityState.bind(this));
        
        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "Jon Wingfield")
            .setCharacteristic(hap.Characteristic.Model, "NodeMCU powered SHT21");
    }

    getTemperatureState(callback: CharacteristicGetCallback) {
        this.getRemoteState('Temperature', callback);
    }

    getHumidityState(callback: CharacteristicGetCallback) {
        this.getRemoteState('Humidity', callback);
    }

    private getRemoteState(service: 'Temperature' | 'Humidity', callback: CharacteristicGetCallback) {
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
            })
            
    }

    getServices(): Service[] {
        return [
            this.informationService,
            this.tempService,
            this.humidityService,
        ];
    }
    

}