import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

export class AutostartManager {
    constructor() {
        this.ensureDir();
    }

    private ensureDir() {
        const dir = path.join(os.homedir(), '.config', 'autostart');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    public enable(id: string, name: string, command: string): boolean {
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

    public disable(id: string): boolean {
        try {
            const file = path.join(os.homedir(), '.config', 'autostart', `widget-${id}.desktop`);
            if (fs.existsSync(file)) fs.unlinkSync(file);
            return true;
        } catch (e) {
            return false;
        }
    }
}

