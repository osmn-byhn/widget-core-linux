// Bu kod, widget yüklenmeden önce 'preload' script olarak çalıştırılmalı.
const createShield = () => {
    const safeGlobals = {
        console: window.console,
        setTimeout: window.setTimeout,
        // fs, process, vb. kesinlikle BURADA OLMAMALI
    };
    // Global nesneyi dondur ve tehlikeli her şeyi sil
    const dangerousKeys = ["process", "require", "Buffer", "global"];
    dangerousKeys.forEach((key) => {
        Object.defineProperty(window, key, {
            get: () => {
                throw new Error(`Security Shield: Access to ${key} is forbidden.`);
            },
            configurable: false,
        });
    });
    return safeGlobals;
};
export {};
//# sourceMappingURL=shield.js.map