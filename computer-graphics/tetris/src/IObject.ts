import { vec3 } from 'gl-matrix';

export interface IObject {
  draw(): void;
  translate(vector: vec3): void;
  rotate(angle: number, axis: vec3, center?: vec3): void;
  invertRotate(): void;
  scale(vector: vec3): void;
  update(deltaTime: number): void;
  getWorldVertices(): vec3[];
  collides(objects: IObject[]): vec3 | null;
  translateUpByCollision(collisionAbsVector: vec3): void;
  checkIfNotCollidable(): boolean;
}