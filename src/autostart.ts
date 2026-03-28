import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

export class AutostartManager {
    private platform: string;

    constructor() {
        this.platform = process.platform;
        this.ensureDir();
    }

    private ensureDir() {
        if (this.platform === 'linux') {
            const dir = path.join(os.homedir(), '.config', 'autostart');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        } else if (this.platform === 'darwin') {
            const dir = path.join(os.homedir(), 'Library', 'LaunchAgents');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        }
    }

    public enable(id: string, name: string, command: string): boolean {
        try {
            if (this.platform === 'linux') {
                return this.enableLinux(id, name, command);
            } else if (this.platform === 'win32') {
                return this.enableWindows(id, command);
            } else if (this.platform === 'darwin') {
                return this.enableMacOS(id, name, command);
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    public disable(id: string): boolean {
        try {
            if (this.platform === 'linux') {
                return this.disableLinux(id);
            } else if (this.platform === 'win32') {
                return this.disableWindows(id);
            } else if (this.platform === 'darwin') {
                return this.disableMacOS(id);
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    private enableLinux(id: string, name: string, command: string): boolean {
        try {
            const dir = path.join(os.homedir(), '.config', 'autostart');
            const file = path.join(dir, `widget-${id}.desktop`);
            const content = `[Desktop Entry]
Type=Application
Name=Desktop Widget - ${name}
Exec=${command}
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Comment=Auto-started desktop widget
`;
            fs.writeFileSync(file, content);
            return true;
        } catch (e) {
            return false;
        }
    }

    private disableLinux(id: string): boolean {
        try {
            const file = path.join(os.homedir(), '.config', 'autostart', `widget-${id}.desktop`);
            if (fs.existsSync(file)) fs.unlinkSync(file);
            return true;
        } catch (e) {
            return false;
        }
    }

    private enableWindows(id: string, command: string): boolean {
        // Use reg.exe to add to HKCU Run
        try {
            const key = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`;
            const valueName = `Widget_${id}`;
            // Escape quotes in command if necessary
            execSync(`reg add "${key}" /v "${valueName}" /t REG_SZ /d "${command.replace(/"/g, '\\"')}" /f`);
            return true;
        } catch (e) {
            console.error("Failed to enable Windows autostart:", e);
            return false;
        }
    }

    private disableWindows(id: string): boolean {
        try {
            const key = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`;
            const valueName = `Widget_${id}`;
            execSync(`reg delete "${key}" /v "${valueName}" /f`);
            return true;
        } catch (e) {
            // Might not exist, which is fine
            return true; 
        }
    }

    private enableMacOS(id: string, name: string, command: string): boolean {
        try {
            const dir = path.join(os.homedir(), 'Library', 'LaunchAgents');
            const file = path.join(dir, `com.widget.${id}.plist`);
            const content = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.widget.${id}</string>
    <key>ProgramArguments</key>
    <array>
        <string>sh</string>
        <string>-c</string>
        <string>${command}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>`;
            fs.writeFileSync(file, content);
            return true;
        } catch (e) {
            return false;
        }
    }

    private disableMacOS(id: string): boolean {
        try {
            const file = path.join(os.homedir(), 'Library', 'LaunchAgents', `com.widget.${id}.plist`);
            if (fs.existsSync(file)) fs.unlinkSync(file);
            return true;
        } catch (e) {
            return false;
        }
    }
}
