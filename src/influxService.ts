import { InfluxDB, ISingleHostConfig } from 'influx';

export default class InfluxService {
    private readonly influx: InfluxDB;

    constructor(options: ISingleHostConfig) {
        this.influx = new InfluxDB(options);
    }

    queryTempHumidity() {
        return this.influx.query<{ tempf: number, humidity: number}>(`SELECT last("tempf") as "tempf", last("humidity") as "humidity" from "weather" where "sensor" = 'greenhouse'`)
            .then(result => {
                return {
                    temp: result[0].tempf,
                    humidity: result[0].humidity,
                }
            })
    }
}