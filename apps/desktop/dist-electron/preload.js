"use strict";
// src/electron/preload.ts
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (channel, data) => {
        electron_1.ipcRenderer.send(channel, data);
    },
    onMessage: (channel, callback) => {
        electron_1.ipcRenderer.on(channel, callback);
    },
});
//# sourceMappingURL=preload.js.map