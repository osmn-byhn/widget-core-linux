import fs from 'fs';
import path from 'path';
import os from 'os';
export class WidgetRegistry {
    configPath;
    constructor() {
        this.configPath = path.join(os.homedir(), '.config', 'widget-core', 'widgets.json');
        this.ensureConfigDir();
    }
    ensureConfigDir() {
        const dir = path.dirname(this.configPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.configPath)) {
            fs.writeFileSync(this.configPath, JSON.stringify([], null, 2));
        }
    }
    getWidgets() {
        try {
            const data = fs.readFileSync(this.configPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (e) {
            console.error("Failed to read widget registry:", e);
            return [];
        }
    }
    saveWidgets(widgets) {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(widgets, null, 2));
        }
        catch (e) {
            console.error("Failed to save widget registry:", e);
        }
    }
    addWidget(url, options, id) {
        const widgets = this.getWidgets();
        const finalId = id || Math.random().toString(36).substring(2, 11);
        widgets.push({ id: finalId, url, options, active: true });
        this.saveWidgets(widgets);
        return finalId;
    }
    removeWidget(id) {
        const widgets = this.getWidgets().filter(w => w.id !== id);
        this.saveWidgets(widgets);
    }
    updateWidget(id, updates) {
        const widgets = this.getWidgets().map(w => w.id === id ? { ...w, ...updates } : w);
        this.saveWidgets(widgets);
    }
    activateWidget(id) {
        this.updateWidget(id, { active: true });
    }
    deactivateWidget(id) {
        this.updateWidget(id, { active: false });
    }
    getWidget(id) {
        return this.getWidgets().find(w => w.id === id);
    }
}
//# sourceMappingURL=registry.js.map