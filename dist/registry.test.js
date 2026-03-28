import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WidgetRegistry } from './registry.js';
import fs from 'fs';
vi.mock('fs');
describe('WidgetRegistry', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should ensure config directory exists on construction', () => {
        vi.mocked(fs.existsSync).mockReturnValue(false);
        new WidgetRegistry();
        expect(fs.mkdirSync).toHaveBeenCalled();
    });
    it('should return widgets from file', () => {
        const mockWidgets = [{ id: '1', url: 'http://test', options: {}, active: true }];
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockWidgets));
        const registry = new WidgetRegistry();
        const widgets = registry.getWidgets();
        expect(widgets).toEqual(mockWidgets);
    });
    it('should add a new widget', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([]));
        vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
        const registry = new WidgetRegistry();
        const result = registry.addWidget('http://new', { width: 100, height: 100, x: 0, y: 0 });
        expect(result.success).toBe(true);
        expect(result.id).toBeDefined();
        expect(fs.writeFileSync).toHaveBeenCalled();
    });
    it('should remove a widget', () => {
        const mockWidgets = [{ id: 'to-remove', url: 'http://test', options: {}, active: true }];
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockWidgets));
        vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
        const registry = new WidgetRegistry();
        const success = registry.removeWidget('to-remove');
        expect(success).toBe(true);
        expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('[]'));
    });
});
//# sourceMappingURL=registry.test.js.map