export interface CanvasParseResult {
  renderingContext: WebGLRenderingContext;
  clientWidth: number;
  clientHeight: number;
}

export class CanvasManager {
  parseCanvas(canvasSelector: string) {
    const canvas = <HTMLCanvasElement>document.querySelector(canvasSelector);

    const renderingContext = canvas!.getContext("webgl");
    if (renderingContext) {
      throw new Error('Rendering context not found');
    }
    return {
      renderingContext,
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight
    };
  }
}
