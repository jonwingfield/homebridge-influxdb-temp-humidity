"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const influxService_1 = __importDefault(require("./influxService"));
new influxService_1.default({
    host: 'pi4.local',
    database: 'weather',
}).queryTempHumidity().then(({ temp, humidity }) => {
    console.log(`Temp: ${Math.round(temp * 10) / 10} Humidity: ${Math.round(humidity)}\n`);
});
//# sourceMappingURL=test.js.map