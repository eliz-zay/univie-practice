import { Global } from './Global';
import { TetrisGridFactory } from './TetrisGridFactory';
import { TetracubeFactory, TetracubeTypeEnum } from './TetracubeFactory';
import { Colors } from './Object';
import { AppState } from './AppState';

const CUBE_SIZE = 0.4;

export function generateObjects(): void {
    Global.objects.push(...TetrisGridFactory.getTetrisGrid());

    const tetracube = TetracubeFactory.createTetracube(TetracubeTypeEnum.O, 0.4, Colors.Orange);

    Global.objects.push(...tetracube);
    AppState.activeTetracube = tetracube;
    AppState.generatedCubes.push(...tetracube);
}

export function spawnTetracube(): void {
    const randomType = getRandomNotAbove(Object.keys(TetracubeTypeEnum).length / 2);

    const colors = [Colors.DarkBlue, Colors.Green, Colors.Orange, Colors.Purple];
    const randomColor = colors[getRandomNotAbove(colors.length)];
    const isTextured = getRandomBoolean();

    const tetracube = TetracubeFactory.createTetracube(randomType, CUBE_SIZE, randomColor, isTextured);

    Global.objects.push(...tetracube);
    AppState.activeTetracube = tetracube;
    AppState.generatedCubes.push(...tetracube);
}

function getRandomNotAbove(max: number): number {
    return Math.floor(Math.random() * max);
}

function getRandomBoolean(): boolean {
    return Math.random() < 0.2;
}
