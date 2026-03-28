import type { WidgetOptions } from './index.js';
export interface RegisteredWidget {
    id: string;
    url: string;
    options: WidgetOptions;
    active: boolean;
}
export declare class WidgetRegistry {
    private configPath;
    constructor();
    private ensureConfigDir;
    getWidgets(): RegisteredWidget[];
    saveWidgets(widgets: RegisteredWidget[]): boolean;
    addWidget(url: string, options: WidgetOptions, id?: string): {
        success: boolean;
        id?: string;
    };
    removeWidget(id: string): boolean;
    updateWidget(id: string, updates: Partial<RegisteredWidget>): boolean;
    activateWidget(id: string): boolean;
    deactivateWidget(id: string): boolean;
    getWidget(id: string): RegisteredWidget | undefined;
}
//# sourceMappingURL=registry.d.ts.map