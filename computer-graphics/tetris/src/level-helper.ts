import { Global } from './Global';
import { TetrisGridFactory } from './TetrisGridFactory';
import { AppState } from './AppState';
import { IObject } from './IObject';
import { getBoundingCube } from './physics';

const CUBE_SIZE = 0.4;

export function clearFilledLevels(): void {
    const eps = 0.001;

    const areaInCubes = TetrisGridFactory.getTetrisGridAreaInCubes();
    const levels: { minY: number; cubes: IObject[]; }[] = [];

    AppState.generatedCubes.forEach((cube) => {
        const coordinates = cube.getWorldVertices();
        const minY: number = coordinates.reduce(((min, p) => p[1] < min ? p[1] : min), Number.MAX_SAFE_INTEGER);

        const level = levels.find((level) => Math.abs(level.minY - minY) < eps);

        if (level) {
            level.cubes.push(cube);
        } else {
            levels.push({ minY, cubes: [cube] });
        }
    });

    levels.forEach((level) => {
        if (level.cubes.length !== areaInCubes) {
            return;
        }

        Global.objects = Global.objects.filter((o) => !level.cubes.includes(o));
        AppState.generatedCubes = AppState.generatedCubes.filter((o) => !level.cubes.includes(o));
        level.cubes = [];

        const upperCubes = levels.filter((l) => l.minY > level.minY).map((l) => l.cubes).flat();

        upperCubes.forEach((cube) => {
            cube.translate([0.0, -CUBE_SIZE, 0.0]);
        });
    });
}

export function checkIfUpperLevelFree(): boolean {
    const upperBound = TetrisGridFactory.getTetrisGridBounds().maxBounds[1] - CUBE_SIZE;
    const eps = 0.1;
    
    for (const cube of AppState.generatedCubes) {
        const { yMax } = getBoundingCube(cube.getWorldVertices());

        if (Math.abs(yMax - upperBound) < eps) {
            return false;
        }
    }

    return true;
}
