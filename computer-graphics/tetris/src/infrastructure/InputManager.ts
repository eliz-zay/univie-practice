const ui = require('../utils/webgl-lessons-ui');

import { Global } from '../Global';

export enum KeyEnum {
    Right = 'ArrowRight',
    Left = 'ArrowLeft',
    Up = 'ArrowUp',
    Down = 'ArrowDown',
    Space = ' ',
    a = 'a',
    b = 'b',
    c = 'c',
    A = 'A',
    B = 'B',
    C = 'C',
    d = 'd',
    f = 'f',
    g = 'g',
    i = 'i',
    j = 'j',
    k = 'k',
    l = 'l',
    L = 'L',
    s = 's',
    o = 'o',
    u = 'u',
    w = 'w',
    e = 'e',
    r = 'r',
    t = 't',
    v = 'v',
    q = 'q',
    p = 'p',
    x = 'x',
    X = 'X',
    y = 'y',
    Y = 'Y',
    z = 'z',
    Z = 'Z',
    N0 = '0',
    N1 = '1',
    N2 = '2',
    N3 = '3',
    N4 = '4',
    N5 = '5',
    N6 = '6',
    N7 = '7',
    N8 = '8',
    N9 = '9',
    Dot = '.',
    Comma = ',',
    Plus = '+',
    Minus = '-',
}

export interface MouseInput {
    x: number;
    y: number;
}

export interface HandleInputParams {
    mouseMovement?: (input: MouseInput) => void;
    mouseUp?: (input: MouseInput) => void;
    keyDown?: (key: KeyEnum) => void;
    keyUp?: (key: KeyEnum) => void;
}

export class InputManager {
    private static mouseDown: boolean = false;

    public static registerInputHandlers(params: HandleInputParams): void {
        const { mouseMovement, mouseUp, keyDown, keyUp } = params;

        const isCanvas = (event: MouseEvent) => event.target['id'] === 'c';

        if (keyDown) {
            document.addEventListener('keydown', (event: KeyboardEvent) => keyDown(event.key as KeyEnum));
        }

        if (keyUp) {
            document.addEventListener('keyup', (event: KeyboardEvent) => keyUp(event.key as KeyEnum));
        }

        if (mouseMovement) {
            document.addEventListener('mousemove', (event: MouseEvent) => mouseMovement({ x: event.x, y: event.y }));
        }

        document.addEventListener('mousedown', (event: MouseEvent) => this.mouseDown = isCanvas(event));
        document.addEventListener('mouseup', (event: MouseEvent) => {
            if (!isCanvas(event)) {
                return;
            }

            this.mouseDown = false;
            if (mouseUp) {
                mouseUp({ x: event.x, y: event.y });
            }
        });
    }

    public static isMouseUp() {
        return this.mouseDown;
    }

    public static registerShaderSliders() {
        const uiHandler = (vectorIndex: number) => {
            return (event, ui) => {
                Global.ambDiffSpecParts[vectorIndex] = ui.value / 100;
            };
        }
    
        ui.setupSlider("#ambient", { slide: uiHandler(0), max: 100, value: 100 });
        ui.setupSlider("#diffuse", { slide: uiHandler(1), max: 100, value: 100 });
        ui.setupSlider("#specular", { slide: uiHandler(2), max: 100, value: 100 });
    }

}
