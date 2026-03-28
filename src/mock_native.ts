export const createWidget = (url: string, options: any) => {
    console.log(`[Mock Native] Creating widget: ${url}`);
    console.log(`[Mock Native] Options:`, JSON.stringify(options, null, 2));
    return { id: Math.random(), url };
};

export const updateOpacity = (handle: any, opacity: number) => {
    console.log(`[Mock Native] Updating opacity for ${handle.id} to ${opacity}`);
};

export const updatePosition = (handle: any, x: number, y: number) => {
    console.log(`[Mock Native] Updating position for ${handle.id} to (${x}, ${y})`);
};
