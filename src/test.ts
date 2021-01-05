import InfluxService from "./influxService";

new InfluxService({
    host: 'pi4.local',
    database: 'weather',
}).queryTempHumidity().then(({ temp, humidity }) => {
    console.log(`Temp: ${Math.round(temp * 10) / 10}F Humidity: ${Math.round(humidity)}%\n`);
})