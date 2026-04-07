import path from 'path';
import { fileURLToPath } from 'url';
import { DesktopWidget } from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = 'file://' + path.join(__dirname, 'demo.html');

console.log('🚀 Launching Widget-Core Demo...');
console.log('📁 Loading:', htmlPath);

try {
    const widget = new DesktopWidget(htmlPath, {
        width: 350,
        height: 180,
        x: 50,
        y: 50,
        opacity: 1,
        interactive: false, // Click through to desktop
        sticky: true,       // Stay on bottom
        blur: false          // Apply backdrop blur if supported
    });

    console.log('✅ Widget active! Check your desktop.');
    console.log('ID:', widget.id);
    console.log('Press Ctrl+C to close the widget.');

    // KEEP PROCESS ALIVE: Without this, Node.js exits immediately 
    // and the native window is destroyed.
    setInterval(() => { }, 1000);

    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down...');
        process.exit(0);
    });

} catch (error) {
    console.error('❌ Failed to launch widget:', error);
    process.exit(1);
}
