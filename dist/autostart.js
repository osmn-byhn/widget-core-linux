import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
export class AutostartManager {
    platform;
    constructor() {
        this.platform = process.platform;
        this.ensureDir();
    }
    ensureDir() {
        if (this.platform === 'linux') {
            const dir = path.join(os.homedir(), '.config', 'autostart');
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
        }
        else if (this.platform === 'darwin') {
            const dir = path.join(os.homedir(), 'Library', 'LaunchAgents');
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
        }
    }
    enable(id, name, command) {
        if (this.platform === 'linux') {
            this.enableLinux(id, name, command);
        }
        else if (this.platform === 'win32') {
            this.enableWindows(id, command);
        }
        else if (this.platform === 'darwin') {
            this.enableMacOS(id, name, command);
        }
    }
    disable(id) {
        if (this.platform === 'linux') {
            this.disableLinux(id);
        }
        else if (this.platform === 'win32') {
            this.disableWindows(id);
        }
        else if (this.platform === 'darwin') {
            this.disableMacOS(id);
        }
    }
    enableLinux(id, name, command) {
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
    }
    disableLinux(id) {
        const file = path.join(os.homedir(), '.config', 'autostart', `widget-${id}.desktop`);
        if (fs.existsSync(file))
            fs.unlinkSync(file);
    }
    enableWindows(id, command) {
        // Use reg.exe to add to HKCU Run
        try {
            const key = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`;
            const valueName = `Widget_${id}`;
            // Escape quotes in command if necessary
            execSync(`reg add "${key}" /v "${valueName}" /t REG_SZ /d "${command.replace(/"/g, '\\"')}" /f`);
        }
        catch (e) {
            console.error("Failed to enable Windows autostart:", e);
        }
    }
    disableWindows(id) {
        try {
            const key = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`;
            const valueName = `Widget_${id}`;
            execSync(`reg delete "${key}" /v "${valueName}" /f`);
        }
        catch (e) {
            // Might not exist, which is fine
        }
    }
    enableMacOS(id, name, command) {
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
    }
    disableMacOS(id) {
        const file = path.join(os.homedir(), 'Library', 'LaunchAgents', `com.widget.${id}.plist`);
        if (fs.existsSync(file))
            fs.unlinkSync(file);
    }
}
//# sourceMappingURL=autostart.js.map