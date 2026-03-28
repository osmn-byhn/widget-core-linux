import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AutostartManager } from './autostart.js';
import fs from 'fs';
import { execSync } from 'child_process';

vi.mock('fs');
vi.mock('child_process');

describe('AutostartManager', () => {
  let platformSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setPlatform = (platform: string) => {
    vi.stubGlobal('process', { ...process, platform });
  };

  it('should enable autostart on Linux', () => {
    setPlatform('linux');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    const manager = new AutostartManager();
    const success = manager.enable('test-id', 'Test Widget', 'node runner.js');
    
    expect(success).toBe(true);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('.config/autostart/widget-test-id.desktop'),
      expect.stringContaining('Exec=node runner.js')
    );
  });

  it('should enable autostart on Windows', () => {
    setPlatform('win32');
    
    const manager = new AutostartManager();
    const success = manager.enable('test-id', 'Test Widget', 'node runner.js');
    
    expect(success).toBe(true);
    expect(execSync).toHaveBeenCalledWith(expect.stringContaining('reg add'));
  });

  it('should enable autostart on macOS', () => {
    setPlatform('darwin');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    const manager = new AutostartManager();
    const success = manager.enable('test-id', 'Test Widget', 'node runner.js');
    
    expect(success).toBe(true);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('Library/LaunchAgents/com.widget.test-id.plist'),
      expect.stringContaining('node runner.js')
    );
  });
});
