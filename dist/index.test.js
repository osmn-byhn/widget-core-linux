import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DesktopWidget } from './index.js';
import { spawn } from 'child_process';
// Mock everything that uses native or side effects
vi.mock('bindings', () => ({
    default: () => ({
        CreateWidget: vi.fn(() => ({})),
        UpdateBorderRadius: vi.fn(),
        SetInteractive: vi.fn(),
        CloseWidget: vi.fn(),
    })
}));
vi.mock('./registry.js', () => {
    const WidgetRegistry = vi.fn();
    WidgetRegistry.prototype.getWidgets = vi.fn().mockReturnValue([]);
    WidgetRegistry.prototype.getWidget = vi.fn();
    WidgetRegistry.prototype.addWidget = vi.fn().mockReturnValue({ success: true, id: 'mock-id' });
    WidgetRegistry.prototype.saveWidgets = vi.fn().mockReturnValue(true);
    WidgetRegistry.prototype.activateWidget = vi.fn().mockReturnValue(true);
    WidgetRegistry.prototype.deactivateWidget = vi.fn().mockReturnValue(true);
    WidgetRegistry.prototype.removeWidget = vi.fn().mockReturnValue(true);
    return { WidgetRegistry };
});
vi.mock('./autostart.js', () => {
    const AutostartManager = vi.fn();
    AutostartManager.prototype.enable = vi.fn().mockReturnValue(true);
    AutostartManager.prototype.disable = vi.fn().mockReturnValue(true);
    return { AutostartManager };
});
vi.mock('child_process', () => ({
    spawn: vi.fn().mockReturnValue({ unref: vi.fn(), pid: 1234 }),
    execSync: vi.fn()
}));
describe('DesktopWidget', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should create a widget instance', () => {
        const options = { width: 800, height: 600, x: 0, y: 0 };
        const widget = new DesktopWidget('http://test', options);
        expect(widget.id).toBeDefined();
    });
    it('should call makePersistent correctly', async () => {
        const options = { width: 800, height: 600, x: 0, y: 0 };
        const widget = new DesktopWidget('http://test', options);
        const success = await widget.makePersistent(options);
        expect(success).toBe(true);
        expect(widget.id).toBeDefined();
    });
    it('should launch standalone process', () => {
        const options = { width: 800, height: 600, x: 0, y: 0 };
        const widget = new DesktopWidget('http://test', options);
        // Manually set ID if not persistent
        widget.id = 'test-id';
        const success = widget.launchStandalone();
        expect(success).toBe(true);
        expect(vi.mocked(spawn)).toHaveBeenCalledWith('node', expect.any(Array), expect.any(Object));
    });
});
//# sourceMappingURL=index.test.js.map