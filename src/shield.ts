// Bu kod, widget yüklenmeden önce 'preload' script olarak çalıştırılmalı.
export const createShield = (windowObj: any) => {
  const safeGlobals = {
    console: windowObj.console,
    setTimeout: windowObj.setTimeout,
    // fs, process, vb. kesinlikle BURADA OLMAMALI
  };

  // Global nesneyi dondur ve tehlikeli her şeyi sil
  const dangerousKeys = ["process", "require", "Buffer", "global"];
  dangerousKeys.forEach((key) => {
    Object.defineProperty(windowObj, key, {
      get: () => {
        throw new Error(`Security Shield: Access to ${key} is forbidden.`);
      },
      configurable: false,
    });
  });

  return safeGlobals;
};
