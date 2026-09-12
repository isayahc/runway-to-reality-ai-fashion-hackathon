declare module "occt-import-js" {
  interface OcctInstance { ReadStepFile(content: Uint8Array, params: Record<string, unknown> | null): { success: boolean; meshes: Array<{ attributes: { position: { array: number[] }; normal?: { array: number[] } }; index: { array: number[] }; color?: number[] }> }; }
  function init(options?: { locateFile?: (file: string) => string }): Promise<OcctInstance>;
  export default init;
}
