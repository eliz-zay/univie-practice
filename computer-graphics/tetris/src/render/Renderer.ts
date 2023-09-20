import { AssetLoader } from '../infrastructure';
import { Shader } from './Shader';

export class Renderer {
  private static renderingContext: WebGLRenderingContext;

  private static shaders: Map<string, Shader> = new Map();

  public static init(renderingContext: WebGLRenderingContext) {
    this.renderingContext = renderingContext;
  }

  /**
   * Shaders processing
   */

  public static async loadShader(shaderName: string): Promise<void> {
    if (this.shaders.has(shaderName)) {
      throw Error('Shader already loaded');
    }

    const [vertexShader, fragmentShader] = await Promise.all([
      this.loadShaderProgramFile(shaderName, this.renderingContext.VERTEX_SHADER),
      this.loadShaderProgramFile(shaderName, this.renderingContext.FRAGMENT_SHADER)
    ]);

    const program = this.renderingContext.createProgram();
    if (!program) {
      throw Error('Could not create shader program');
    }

    this.renderingContext.attachShader(program, vertexShader);
    this.renderingContext.attachShader(program, fragmentShader);
    this.renderingContext.linkProgram(program);

    const success = this.renderingContext.getProgramParameter(program, this.renderingContext.LINK_STATUS);

    if (!success) {
      this.renderingContext.deleteProgram(program);
      throw Error('Could not link shader program');
    }

    this.shaders.set(shaderName, new Shader(this.renderingContext, program));
  }

  public static getShader(shaderName: string): Shader {
    if (!this.shaders.has(shaderName)) {
      throw Error(`Shader ${shaderName} was not loaded`);
    }

    return this.shaders.get(shaderName);
  }

  private static async loadShaderProgramFile(shaderName: string, shaderType: number) {
    const shaderFileExtension = shaderType === this.renderingContext.VERTEX_SHADER ? 'vs' : 'fs';
    const shaderPath = `shaders/${shaderName}.${shaderFileExtension}`;

    const source = await AssetLoader.loadAsset(shaderPath);

    const shader = this.renderingContext.createShader(shaderType);
    if (!shader) {
      throw Error('Could not create shader');
    }

    this.renderingContext.shaderSource(shader, source);
    this.renderingContext.compileShader(shader);

    const success = this.renderingContext.getShaderParameter(shader, this.renderingContext.COMPILE_STATUS);

    if (!success) {
      this.renderingContext.deleteShader(shader);
      throw new Error(`Could not compile shader: ${this.renderingContext.getShaderInfoLog(shader)}`);
    }

    return shader;
  }
}
