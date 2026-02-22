import {mount} from "svelte";
import App from "@/renderer/components/App.svelte";
import {loadSettings} from "@/renderer/stores/settingsStore";

async function IndexRenderer() {
    const app_container = document.getElementById("app-container");
    if (!app_container) {
        throw new Error("The App container (#app) is missing from the DOM.");
    }

    await loadSettings();
    const app = mount(App, { target: app_container });
}

addEventListener("DOMContentLoaded", () => {
    IndexRenderer().catch(console.error);
});