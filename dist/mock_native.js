export const createWidget = (url, options) => {
    console.log(`[Mock Native] Creating widget: ${url}`);
    console.log(`[Mock Native] Options:`, JSON.stringify(options, null, 2));
    return { id: Math.random(), url };
};
export const updateOpacity = (handle, opacity) => {
    console.log(`[Mock Native] Updating opacity for ${handle.id} to ${opacity}`);
};
export const updatePosition = (handle, x, y) => {
    console.log(`[Mock Native] Updating position for ${handle.id} to (${x}, ${y})`);
};
//# sourceMappingURL=mock_native.js.map