import { vec3 } from 'gl-matrix';

import { Cube } from './Cube';
import { Colors } from './Object';

export class TetrisGridFactory {
  private static step = 0.4;
  private static bottomLines = 5;
  private static sideLines = 10;
  private static lineThickness = 0.01;

  public static getTetrisGrid(): Cube[] {
    const lines: Cube[] = []

    // bottom horizontal
    for (let i = 0; i < this.bottomLines; i++) {
      const obj = new Cube(Colors.White);
      obj.translate([(i - 2) * this.step, 0.0, 0.0]);
      obj.scale([this.lineThickness, this.lineThickness, this.step * (this.bottomLines - 1)]);

      lines.push(obj);
    }
    // bottom vertical
    for (let i = 0; i < this.bottomLines; i++) {
      const obj = new Cube(Colors.White);
      obj.translate([0.0, 0.0, (i - 2) * this.step]);
      obj.scale([this.step * (this.bottomLines - 1), this.lineThickness, this.lineThickness]);

      lines.push(obj);
    }

    // back horizontal
    for (let i = 1; i <= this.sideLines; i++) {
      const obj = new Cube(Colors.White);
      obj.translate([0.0, i * this.step, -0.8 - this.lineThickness]);
      obj.scale([this.step * (this.bottomLines - 1), this.lineThickness, this.lineThickness]);

      lines.push(obj);
    }
    // back vertical
    for (let i = 0; i < this.bottomLines; i++) {
      const obj = new Cube(Colors.White);
      obj.translate([(i - 2) * this.step, this.sideLines * this.step / 2, -0.8 - this.lineThickness]);
      obj.scale([this.lineThickness, this.sideLines * this.step, this.lineThickness]);

      lines.push(obj);
    }

    // left horizontal
    for (let i = 1; i <= this.sideLines; i++) {
      const obj = new Cube(Colors.White);
      obj.translate([-0.8 - this.lineThickness, i * this.step, 0.0]);
      obj.scale([this.lineThickness, this.lineThickness, this.step * (this.bottomLines - 1)]);

      lines.push(obj);
    }
    // left vertical
    for (let i = 0; i < this.bottomLines; i++) {
      const obj = new Cube(Colors.White);
      obj.translate([-0.8 - this.lineThickness, this.sideLines * this.step / 2, (i - 2) * this.step]);
      obj.scale([this.lineThickness, this.sideLines * this.step, this.lineThickness]);

      lines.push(obj);
    }

    return lines;
  }

  public static getTetris3DGrid(): Cube[] {
    const lines: Cube[] = []

    for (let j = 1; j <= this.bottomLines; j++) {
      const dz = this.step * (j - 1);
      
      // back horizontal
      for (let i = 1; i <= this.sideLines; i++) {
        const obj = new Cube(Colors.White, { isNotCollidable: true });
        obj.translate([0.0, i * this.step, dz + -0.8 - this.lineThickness]);
        obj.scale([this.step * (this.bottomLines - 1), this.lineThickness, this.lineThickness]);

        lines.push(obj);
      }
      // back vertical
      for (let i = 0; i < this.bottomLines; i++) {
        const obj = new Cube(Colors.White, { isNotCollidable: true });
        obj.translate([(i - 2) * this.step, this.sideLines * this.step / 2, dz + -0.8 - this.lineThickness]);
        obj.scale([this.lineThickness, this.sideLines * this.step, this.lineThickness]);

        lines.push(obj);
      }

      const dx = this.step * (j - 1);

      // left horizontal
      for (let i = 1; i <= this.sideLines; i++) {
        const obj = new Cube(Colors.White, { isNotCollidable: true });
        obj.translate([dx + -0.8 - this.lineThickness, i * this.step, 0.0]);
        obj.scale([this.lineThickness, this.lineThickness, this.step * (this.bottomLines - 1)]);

        lines.push(obj);
      }
      // left vertical
      for (let i = 0; i < this.bottomLines; i++) {
        const obj = new Cube(Colors.White, { isNotCollidable: true });
        obj.translate([dx + -0.8 - this.lineThickness, this.sideLines * this.step / 2, (i - 2) * this.step]);
        obj.scale([this.lineThickness, this.sideLines * this.step, this.lineThickness]);

        lines.push(obj);
      }
    }

    return lines;
  }

  public static getTetrisGridCenter(): vec3 {
    return [0.0, this.step * this.sideLines / 2, 0.0];
  }
  
  public static getTetrisGridBounds(): { maxBounds: number[]; minBounds: number[]; } {
    const bottomFactor = Math.floor(this.bottomLines / 2);

    return {
      maxBounds: [this.step * bottomFactor + this.lineThickness, this.step * this.sideLines, this.step * bottomFactor + this.lineThickness],
      minBounds: [-this.step * bottomFactor - this.lineThickness, 0, - this.step * bottomFactor - this.lineThickness],
    };
  }

  public static getTetrisGridAreaInCubes(): number {
    return (this.bottomLines - 1) * (this.bottomLines - 1);
  }
}
