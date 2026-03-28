import { DesktopWidget } from './index.js';
import { WidgetRegistry } from './registry.js';

const id = process.argv[2];
if (!id) {
    console.error("Widget ID required");
    process.exit(1);
}

const registry = new WidgetRegistry();
const widgetData = registry.getWidget(id);

if (!widgetData) {
    console.error(`No such widget: ${id}`);
    process.exit(1);
}

if (!widgetData.active) {
    console.log(`Widget ${id} is currently deactivated. Skipping launch.`);
    process.exit(0);
}

console.log(`Launching widget ${id} (${widgetData.url})...`);
const widget = new DesktopWidget(widgetData.url, widgetData.options);

// Keep alive
setInterval(() => {}, 1000);
