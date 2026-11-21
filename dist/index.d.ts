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
    /** Path to a widget JSON file. Relative paths resolve from the process working directory. */
    configPath?: string;
    /** CSS text injected into the widget document. */
    css?: string;
    /** JavaScript source injected into the widget document. */
    js?: string;
    /** Arbitrary values exposed as window.widgetConfig.keys. */
    keys?: Record<string, unknown>;
    /** Arbitrary values exposed as window.widgetConfig.data. */
    data?: Record<string, unknown>;
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
    makePersistent(options: WidgetOptions): Promise<boolean>;
    stopPersistence(): boolean;
    activate(): boolean;
    deactivate(): boolean;
    static listWidgets(): import("./registry.js").RegisteredWidget[];
    static listActiveWidgets(): import("./registry.js").RegisteredWidget[];
    static listPassiveWidgets(): import("./registry.js").RegisteredWidget[];
    static activateById(id: string): boolean;
    static deactivateById(id: string): boolean;
    static removeById(id: string): boolean;
    static stopAll(): boolean;
    static killAllProcesses(): boolean;
    private static killProcess;
    launchStandalone(): boolean;
    private validateURL;
    private applySecurityShield;
}
//# sourceMappingURL=index.d.ts.map