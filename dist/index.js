import { createRequire } from "module";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { WidgetRegistry } from "./registry.js";
import { AutostartManager } from "./autostart.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nodeRequire = createRequire(import.meta.url);
let native;
try {
    native = nodeRequire("../build/Release/widget_shield_native");
}
catch (e) {
    console.warn("Native module not found, falling back to mock for testing.");
    native = {
        createWidget: (url, opts) => {
            console.log(`[Mock Shield] Creating widget for ${url} (Interactive: ${opts.interactive})`);
            return { id: 1 };
        },
        updateOpacity: (h, v) => console.log(`[Mock Shield] Opacity -> ${v}`),
        updatePosition: (h, x, y) => console.log(`[Mock Shield] Position -> (${x}, ${y})`)
    };
}
export class DesktopWidget {
    url;
    nativeHandle;
    id;
    static BLOCKED_KEYWORDS = ["shell", "process", "eval", "fs", "child_process"];
    registry = new WidgetRegistry();
    autostart = new AutostartManager();
    constructor(url = "", options) {
        this.url = url;
        this.id = Math.random().toString(36).substring(2, 11);
        if (url) {
            this.validateURL(url);
        }
        else if (!options.html) {
            throw new Error("Either url or html content must be provided.");
        }
        this.applySecurityShield(options);
        // Native tarafında pencereyi oluştur
        try {
            this.nativeHandle = native.createWidget(url, options);
        }
        catch (e) {
            console.error("Failed to create native widget:", e);
        }
    }
    setOpacity(value) {
        if (value < 0 || value > 1)
            throw new Error("Opacity must be between 0 and 1");
        native.updateOpacity(this.nativeHandle, value);
        const existing = this.registry.getWidget(this.id);
        if (existing) {
            this.registry.updateWidget(this.id, { options: { ...existing.options, opacity: value } });
        }
    }
    setPosition(x, y) {
        native.updatePosition(this.nativeHandle, x, y);
        const existing = this.registry.getWidget(this.id);
        if (existing) {
            this.registry.updateWidget(this.id, { options: { ...existing.options, x, y } });
        }
    }
    setPersistent(value) {
        if (value) {
            if (!this.id) {
                // Options used to create this widget might not be exactly what we want to persist if they were modified
                // For now, we use the ones that work.
                // Note: We'd need to track current options in the class.
                // Simplified for this implementation.
            }
        }
    }
    async makePersistent(options) {
        this.registry.addWidget(this.url, options, this.id);
        const runnerPath = path.join(__dirname, "runner.js");
        const command = `node ${runnerPath} ${this.id}`;
        this.autostart.enable(this.id, this.url, command);
        console.log(`Widget ${this.id} is now persistent and will autostart.`);
    }
    stopPersistence() {
        this.autostart.disable(this.id);
        this.registry.removeWidget(this.id);
        DesktopWidget.killProcess(this.id);
        console.log(`Widget ${this.id} removed from persistence and process killed.`);
    }
    activate() {
        if (!this.id)
            throw new Error("Widget must be persistent to be activated");
        const widget = this.registry.getWidget(this.id);
        if (!widget)
            throw new Error("Widget not found in registry");
        this.registry.activateWidget(this.id);
        const runnerPath = path.join(__dirname, "runner.js");
        const command = `node ${runnerPath} ${this.id}`;
        this.autostart.enable(this.id, widget.url, command);
        console.log(`Widget ${this.id} is now activated and autostart enabled.`);
    }
    deactivate() {
        this.registry.deactivateWidget(this.id);
        this.autostart.disable(this.id);
        DesktopWidget.killProcess(this.id);
        console.log(`Widget ${this.id} is now deactivated, autostart disabled, and process killed.`);
    }
    static listWidgets() {
        return new WidgetRegistry().getWidgets();
    }
    static listActiveWidgets() {
        return new WidgetRegistry().getWidgets().filter(w => w.active);
    }
    static listPassiveWidgets() {
        return new WidgetRegistry().getWidgets().filter(w => !w.active);
    }
    static activateById(id) {
        const registry = new WidgetRegistry();
        const autostart = new AutostartManager();
        const widget = registry.getWidget(id);
        if (!widget)
            throw new Error(`Widget ${id} not found in registry`);
        registry.activateWidget(id);
        const runnerPath = path.join(__dirname, "runner.js");
        const command = `node ${runnerPath} ${id}`;
        autostart.enable(id, widget.url, command);
        console.log(`Widget ${id} activated via ID.`);
    }
    static deactivateById(id) {
        const registry = new WidgetRegistry();
        const autostart = new AutostartManager();
        registry.deactivateWidget(id);
        autostart.disable(id);
        DesktopWidget.killProcess(id);
        console.log(`Widget ${id} deactivated via ID and process killed.`);
    }
    static removeById(id) {
        const registry = new WidgetRegistry();
        const autostart = new AutostartManager();
        registry.removeWidget(id);
        autostart.disable(id);
        DesktopWidget.killProcess(id);
        console.log(`Widget ${id} permanently removed via ID and process killed.`);
    }
    static stopAll() {
        const registry = new WidgetRegistry();
        const autostart = new AutostartManager();
        const widgets = registry.getWidgets();
        for (const w of widgets) {
            registry.deactivateWidget(w.id);
            autostart.disable(w.id);
        }
        DesktopWidget.killAllProcesses();
        console.log("All widgets deactivated and processes killed.");
    }
    static killAllProcesses() {
        const { execSync } = createRequire(import.meta.url)("child_process");
        try {
            if (process.platform === 'win32') {
                execSync(`wmic process where "CommandLine like '%runner.js%'" delete`);
            }
            else {
                execSync(`pkill -f "runner.js"`);
            }
        }
        catch (e) {
            // Ignore if no processes found
        }
    }
    static killProcess(id) {
        const { execSync } = createRequire(import.meta.url)("child_process");
        try {
            if (process.platform === 'win32') {
                // Windows: Kill node process that has the ID in its command line
                // Use wmic or taskkill with filtering
                try {
                    execSync(`wmic process where "CommandLine like '%runner.js %${id}%'" delete`);
                }
                catch (e) {
                    // Ignore if not found
                }
            }
            else {
                // Linux/macOS: Use pkill with full command line matching
                execSync(`pkill -f "runner.js ${id}"`);
            }
        }
        catch (e) {
            // pkill returns non-zero if no process matched, which is fine
        }
    }
    launchStandalone() {
        if (!this.id)
            throw new Error("Widget must be persistent to launch standalone");
        const runnerPath = path.join(__dirname, "runner.js");
        const child = spawn("node", [runnerPath, this.id], {
            detached: true,
            stdio: 'ignore'
        });
        child.unref();
        console.log(`Launched standalone widget process (PID: ${child.pid})`);
    }
    validateURL(url) {
        try {
            const parsed = new URL(url);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:" && parsed.protocol !== "file:") {
                throw new Error(`Security Shield: Protocol ${parsed.protocol} is blocked.`);
            }
            // Localhost or specific allowed domains could be enforced here
        }
        catch (e) {
            if (e instanceof Error && e.message.includes("Security Shield"))
                throw e;
            throw new Error("Security Shield: Invalid URL format.");
        }
    }
    applySecurityShield(options) {
        // Block sensitive node-like options if they were passed
        const permissions = options.permissions || [];
        if (permissions.includes("all")) {
            console.warn("Security Shield: 'all' permissions granted. Use with extreme caution.");
        }
        // In a real implementation, we would pass these flags to the native webview
        // to disable Node.js integration, context isolation, etc.
    }
}
//# sourceMappingURL=index.js.map