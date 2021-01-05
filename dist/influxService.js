"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const influx_1 = require("influx");
class InfluxService {
    constructor(options) {
        this.influx = new influx_1.InfluxDB(options);
    }
    queryTempHumidity() {
        return this.influx.query(`SELECT last("tempf") as "tempf", last("humidity") as "humidity" from "weather" where "sensor" = 'greenhouse'`)
            .then(result => {
            return {
                temp: result[0].tempf,
                humidity: result[0].humidity,
            };
        });
    }
}
exports.default = InfluxService;
//# sourceMappingURL=influxService.js.map