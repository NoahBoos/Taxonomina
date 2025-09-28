import * as path from "node:path";

import {app, BrowserWindow} from "electron";

const CreateIndexWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, "index", "preload.js"),
            // devTools: false
        }
    });

    window.loadFile(path.join(__dirname, "index", "index.html"));
}

app.whenReady().then(() => {
    CreateIndexWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            CreateIndexWindow();
        }
    })
})