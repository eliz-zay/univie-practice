import {vec3} from 'gl-matrix';

import { Camera } from './Camera';
import { IObject } from './IObject';

export class Global {
    static objects: IObject[] = [];
    static lightVector: vec3 = [1, 1, -1];
    static ambDiffSpecParts: vec3 = [1, 1, 1];
    static camera: Camera;
}
