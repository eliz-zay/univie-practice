import { AppState } from '../AppState';
import { IComponent } from './IComponent';

export class GrabityComponent extends IComponent {
  private readonly GRAVITY_CONSTANT = 1;

  apply(deltaTime: number): void {
    const speed = AppState.tetracubeDropDown ? this.GRAVITY_CONSTANT * 5 : this.GRAVITY_CONSTANT;
    
    this.getObject().translate([0, -speed * deltaTime, 0]);
  }
}
