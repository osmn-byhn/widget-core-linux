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
    saveWidgets(widgets: RegisteredWidget[]): void;
    addWidget(url: string, options: WidgetOptions, id?: string): string;
    removeWidget(id: string): void;
    updateWidget(id: string, updates: Partial<RegisteredWidget>): void;
    activateWidget(id: string): void;
    deactivateWidget(id: string): void;
    getWidget(id: string): RegisteredWidget | undefined;
}
//# sourceMappingURL=registry.d.ts.map