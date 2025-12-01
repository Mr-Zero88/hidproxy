import HID = require("node-hid");
import * as WebSocket from 'ws';

process.title = "hidproxy";

let devices = HID.devices().filter((dev) => dev.productId == 4613 && dev.vendorId == 10462);
let sl: Array<WebSocket> = [];
let websocketserver = new WebSocket.Server({port: 7000});
websocketserver.on('connection', s => sl.push(s))
let sendRaw = (data: Buffer) => {
  sl.forEach(_ => _.send(data));
};
console.log(devices);
let device = devices[3];
if (device == null) process.abort();
let controler = new HID.HID(device.path ?? "");
controler.on('data', (data: Buffer) => {
  sendRaw(data);
});
