export declare class AutostartManager {
    private platform;
    constructor();
    private ensureDir;
    enable(id: string, name: string, command: string): boolean;
    disable(id: string): boolean;
    private enableLinux;
    private disableLinux;
    private enableWindows;
    private disableWindows;
    private enableMacOS;
    private disableMacOS;
}
//# sourceMappingURL=autostart.d.ts.map