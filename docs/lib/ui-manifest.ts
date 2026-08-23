export type UiManifest = {
  name: string;
  version: string;
  skins: string[];
  exports: { server: number; client: number };
};
