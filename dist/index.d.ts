export interface WidgetOptions {
    width: number;
    height: number;
    x: number;
    y: number;
    opacity?: number;
    blur?: boolean;
    sticky?: boolean;
    interactive?: boolean;
    html?: string;
    scroll?: boolean;
    permissions?: string[];
}
export declare class DesktopWidget {
    private url;
    private nativeHandle;
    readonly id: string;
    private static readonly BLOCKED_KEYWORDS;
    private registry;
    private autostart;
    constructor(url: string | undefined, options: WidgetOptions);
    setOpacity(value: number): void;
    setPosition(x: number, y: number): void;
    setPersistent(value: boolean): void;
    makePersistent(options: WidgetOptions): Promise<void>;
    stopPersistence(): void;
    activate(): void;
    deactivate(): void;
    static listWidgets(): import("./registry.js").RegisteredWidget[];
    static listActiveWidgets(): import("./registry.js").RegisteredWidget[];
    static listPassiveWidgets(): import("./registry.js").RegisteredWidget[];
    static activateById(id: string): void;
    static deactivateById(id: string): void;
    static removeById(id: string): void;
    static stopAll(): void;
    static killAllProcesses(): void;
    private static killProcess;
    launchStandalone(): void;
    private validateURL;
    private applySecurityShield;
}
//# sourceMappingURL=index.d.ts.map