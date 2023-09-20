import { GlContext } from '../GlContext';

export class TextureLoader {
    private static textures: Map<string, WebGLTexture> = new Map();

    public static async loadTexture(textureName: string): Promise<void> {
        const host = process.env.HOST;
        const port = Number(process.env.PORT);

        function requestCORSIfNotSameOrigin(img, url) {
            if ((new URL(url, window.location.href)).origin !== window.location.origin) {
              img.crossOrigin = "";
            }
          }

        const image = new Image();
        requestCORSIfNotSameOrigin(image, `http://${host}:${port}/assets/textures/${textureName}.jpg`)
        image.src = `http://${host}:${port}/assets/textures/${textureName}.jpg`;

        await new Promise((resolve, reject) => image.addEventListener('load', resolve));

        const { gl } = GlContext;

        const texture = gl.createTexture();
        if (!texture) {
            throw Error('Could not create texture');
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          }

        this.textures.set(textureName, texture);
    }

    public static getTexture(textureName: string): WebGLTexture {
        if (!this.textures.has(textureName)) {
            throw new Error(`Texture ${textureName} was not found. Load it first`);
        }

        return this.textures.get(textureName);
    }

    private static isPowerOf2(value) {
        return (value & (value - 1)) === 0;
      }
}
