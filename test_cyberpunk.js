
import { DesktopWidget } from './dist/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const widgetPath = 'file://' + path.join(__dirname, 'temp_widgets', 'cyberpunk-clock-widget', 'index.html');

console.log('Testing with widget path:', widgetPath);

try {
    const widget = new DesktopWidget(widgetPath, {
        width: 400,
        height: 600,
        x: 100,
        y: 100,
        opacity: 0.9,
        interactive: true,
        sticky: true
    });

    console.log('Widget instance created successfully with ID:', widget.id);
    
    // In a headless environment with xvfb, it might not render visually
    // but the GTK/WebKit subprocesses should start.
    // Wait a few seconds to ensure no immediate crash.
    setTimeout(() => {
        console.log('Test completed successfully without crash.');
        process.exit(0);
    }, 5000);

} catch (e) {
    console.error('Test failed:', e.message);
    process.exit(1);
}
