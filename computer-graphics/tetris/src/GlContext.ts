export class GlContext {
    public static gl: WebGLRenderingContext;
    public static clientWidth: number;
    public static clientHeight: number;

    public static init() {
        const canvas = <HTMLCanvasElement>document.querySelector("#c");
        this.gl = canvas!.getContext("webgl");
        if (!this.gl) {
            throw new Error('context undefined');
        }

        this.clientWidth = canvas.clientWidth;
        this.clientHeight = canvas.clientHeight;
    }
}
