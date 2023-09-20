import { vec3 } from 'gl-matrix';

import { Cube } from './Cube';
import { GrabityComponent } from './components';

export enum TetracubeTypeEnum {
  I, O, L, T, N, TowerRight, TowerLeft, Tripod
}

export class TetracubeFactory {
  private static tetracubesConfig: { [type: string]: { positions: vec3[]; initialOffset?: vec3; } } = {
    [TetracubeTypeEnum.I]: {
      positions: [
        [-1, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0]
      ],
      initialOffset: [-0.5, 9.5, -0.5]
    },
    [TetracubeTypeEnum.O]: {
      positions: [
        [-1, 0, -1],
        [0, 0, -1],
        [-1, 0, 0],
        [0, 0, 0]
      ],
      initialOffset: [0.5, 9.5, 0.5]
    },
    [TetracubeTypeEnum.L]: {
      positions: [
        [-1, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
      ],
      initialOffset: [-0.5, 8, -0.5]
    },
    [TetracubeTypeEnum.T]: {
      positions: [
        [-1, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
      ],
      initialOffset: [-0.5, 8, -0.5]
    },
    [TetracubeTypeEnum.N]: {
      positions: [
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
        [2, 1, 0]
      ],
      initialOffset: [-0.5, 8, -0.5]
    },
    [TetracubeTypeEnum.TowerRight]: {
      positions: [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, -1],
        [1, 1, -1]
      ],
      initialOffset: [-0.5, 8, 0.5]
    },
    [TetracubeTypeEnum.TowerLeft]: {
      positions: [
        [0, 0, 0],
        [1, 0, 0],
        [0, 0, -1],
        [0, 1, -1]
      ],
      initialOffset: [-0.5, 8, 0.5]
    },
    [TetracubeTypeEnum.Tripod]: {
      positions: [
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, -1],
        [0, 0, 0]
      ],
      initialOffset: [-0.5, 8, 0.5]
    }
  };

  public static createTetracube(type: TetracubeTypeEnum, cubeSize: number, color: vec3, isTextured: boolean = false): Cube[] {
    const tetracubeConfig = this.tetracubesConfig[type];
    if (!tetracubeConfig) {
      throw new Error(`Unknown tetracube type - ${type}`);
    }

    const cubes = tetracubeConfig.positions.map((pos) => {
      const position = [cubeSize * pos[0], cubeSize * pos[1], cubeSize * pos[2]];
      const initialOffset = [
        cubeSize * tetracubeConfig.initialOffset[0],
        cubeSize * tetracubeConfig.initialOffset[1],
        cubeSize * tetracubeConfig.initialOffset[2]
      ];

      const cube = new Cube(color, { components: [GrabityComponent], isTextured });

      cube.scale([cubeSize, cubeSize, cubeSize]);
      cube.translate(initialOffset);
      cube.translate(position);

      return cube;
    });

    return cubes;
  }
}
