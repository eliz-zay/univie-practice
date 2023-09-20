export class AssetLoader {
  public static async loadAsset(assetPath: string): Promise<string> {
    const host = process.env.HOST;
    const port = Number(process.env.PORT);

    const response = await fetch(`http://${host}:${port}/assets/${assetPath}`);
    const content = await response.text();

    return content;
  }
}
