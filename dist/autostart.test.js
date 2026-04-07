import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AutostartManager } from './autostart.js';
import fs from 'fs';
import { execSync } from 'child_process';
vi.mock('fs');
vi.mock('child_process');
describe('AutostartManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should enable autostart on Linux', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        const manager = new AutostartManager();
        const success = manager.enable('test-id', 'Test Widget', 'node runner.js');
        expect(success).toBe(true);
        expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('.config/autostart/widget-test-id.desktop'), expect.stringContaining('Exec=node runner.js'));
    });
    it('should disable autostart on Linux', () => {
        const manager = new AutostartManager();
        vi.mocked(fs.existsSync).mockReturnValue(true);
        const success = manager.disable('test-id');
        expect(success).toBe(true);
        expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('.config/autostart/widget-test-id.desktop'));
    });
});
//# sourceMappingURL=autostart.test.js.map