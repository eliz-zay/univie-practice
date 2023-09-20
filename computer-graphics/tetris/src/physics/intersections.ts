import { vec3 } from 'gl-matrix';

const epsilon = 0.0001;

export interface CubeBounds {
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
  zMax: number;
  zMin: number;
}

export function checkIfObjectsIntersect(vertices1: number[][], vertices2: number[][]): vec3 | null {
  const cube1 = getBoundingCube(vertices1);
  const cube2 = getBoundingCube(vertices2);
 
  if (
    cube1.xMax - epsilon <= cube2.xMin || cube2.xMax - epsilon <= cube1.xMin ||
    cube1.yMax - epsilon <= cube2.yMin || cube2.yMax - epsilon <= cube1.yMin ||
    cube1.zMax - epsilon <= cube2.zMin || cube2.zMax - epsilon <= cube1.zMin
  ) {
    return null;
  }

  return [
    Math.min(Math.abs(cube1.xMax - cube2.xMin), Math.abs(cube1.xMin - cube2.xMax)),
    Math.min(Math.abs(cube1.yMax - cube2.yMin), Math.abs(cube1.yMin - cube2.yMax)),
    Math.min(Math.abs(cube1.zMax - cube2.zMin), Math.abs(cube1.zMin - cube2.zMax)),
  ];
}

export function getYCollisionLength(vertices1: number[][], vertices2: number[][]): number {
  const cube1 = getBoundingCube(vertices1);
  const cube2 = getBoundingCube(vertices2);

  return Math.min(cube1.yMax - cube2.yMin, cube1.yMin - cube2.xMax);
}

export function checkIfObjectsIntersectsAxis(vertices: number[][], minBounds: number[], maxBounds: number[]): vec3 | null {
  const cube = getBoundingCube(vertices);

  if (
    cube.xMax <= maxBounds[0] && cube.yMax <= maxBounds[1] && cube.zMax <= maxBounds[2] &&
    cube.xMin >= minBounds[0] && cube.yMin >= minBounds[1] && cube.zMin >= minBounds[2]
  ) {
    return null;
  }

  return [
    Math.abs(cube.xMax - maxBounds[0]),
    Math.abs(cube.yMax - maxBounds[1]),
    Math.abs(cube.zMax - maxBounds[2])
  ];
}

export function getBoundingCube(vertices: number[][]): CubeBounds {
  let xMax = null, xMin = null, yMax = null, yMin = null, zMax = null, zMin = null;

  vertices.forEach((vertex) => {
    if (xMax === null || vertex[0] > xMax) {
      xMax = vertex[0];
    }
    if (xMin === null || vertex[0] < xMin) {
      xMin = vertex[0];
    }

    if (yMax === null || vertex[1] > yMax) {
      yMax = vertex[1];
    }
    if (yMin === null || vertex[1] < yMin) {
      yMin = vertex[1];
    }

    if (zMax === null || vertex[2] > zMax) {
      zMax = vertex[2];
    }
    if (zMin === null || vertex[2] < zMin) {
      zMin = vertex[2];
    }
  });

  return { xMax, xMin, yMax, yMin, zMax, zMin };
}
