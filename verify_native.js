
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const native = require('./build/Release/widget_shield_native.node');
    console.log('Native module loaded successfully!');
    console.log('Native functions:', Object.keys(native));
} catch (e) {
    console.error('Failed to load native module:', e.message);
    process.exit(1);
}
