import {IObject} from '../IObject'

export abstract class IComponent {
  private readonly object: IObject;

  constructor(object: IObject) {
    this.object = object;
  }

  public getObject(): IObject {
    return this.object;
  }

  abstract apply(deltaTime: number): void;
}
