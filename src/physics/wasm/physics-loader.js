/**
 * NeonFrame Physics - WASM Physics Loader
 * Dynamically loads and initializes the WASM physics module.
 */
export async function loadPhysicsWasm(wasmUrl) {
    const response = await fetch(wasmUrl);
    const buffer = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buffer, {});
    return instance.exports;
}