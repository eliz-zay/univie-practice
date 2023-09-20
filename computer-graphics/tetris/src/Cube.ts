import { vec3 } from 'gl-matrix';

import { Object, ComponentConstructor } from './Object';
import { Renderer } from './render';
import { ModelLoader } from './infrastructure';

export interface CubeConfig {
  components?: ComponentConstructor[];
  isNotCollidable?: boolean;
  isTextured?: boolean;
}

export class Cube extends Object {
  constructor(color: vec3, config: CubeConfig = {}) {
    const model = ModelLoader.getModel('cube');

    const type = config.isTextured ? 'object-textured' : 'object-shaded';
    const shader = Renderer.getShader(type);

    super({ model, shader, color, components: config.components, isNotCollidable: config.isNotCollidable });
  }
}


