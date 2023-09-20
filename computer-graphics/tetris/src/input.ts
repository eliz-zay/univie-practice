import { glMatrix, vec3 } from 'gl-matrix';

import { InputManager, KeyEnum, MouseInput } from './infrastructure';
import { AppState } from './AppState';
import { TetrisGridFactory } from './TetrisGridFactory';
import { Global } from './Global';
import { checkIfObjectsIntersectsAxis, getBoundingCube } from './physics';
import { checkIfActiveTetracubeCollides, gridFitTranslationGenerator } from './collision-helper';

const ROTATION_ANGLE = 5;
const ZOOM_COEFFICIENT = 1.1;
const CUBE_SIZE = 0.4;

let previousMouseInput: MouseInput;

export function handleInput() {
    InputManager.registerInputHandlers({
        keyDown: (key: KeyEnum) => handleKeyInput(key),
        mouseMovement: (input: MouseInput) => handleMouseMovementInput(input),
    });

    InputManager.registerShaderSliders();
}

function handleKeyInput(key: KeyEnum) {
    if (AppState.tetracubeDropDown) {
        return;
    }

    switch (key) {
        case KeyEnum.Right:
        case KeyEnum.d:
            translateTetracube([CUBE_SIZE, 0, 0]);
            break;
        case KeyEnum.Left:
        case KeyEnum.a:
            translateTetracube([-CUBE_SIZE, 0, 0]);
            break;
        case KeyEnum.Up:
        case KeyEnum.w:
            translateTetracube([0, 0, -CUBE_SIZE]);
            break;
        case KeyEnum.Down:
        case KeyEnum.s:
            translateTetracube([0, 0, CUBE_SIZE]);
            break;
        case KeyEnum.x:
            rotateTetracube([1, 0, 0], glMatrix.toRadian(90));
            break;
        case KeyEnum.X:
            rotateTetracube([1, 0, 0], -glMatrix.toRadian(90));
            break;
        case KeyEnum.y:
            rotateTetracube([0, 1, 0], glMatrix.toRadian(90));
            break;
        case KeyEnum.Y:
            rotateTetracube([0, 1, 0], -glMatrix.toRadian(90));
            break;
        case KeyEnum.z:
            rotateTetracube([0, 0, 1], glMatrix.toRadian(90));
            break;
        case KeyEnum.Z:
            rotateTetracube([0, 0, 1], -glMatrix.toRadian(90));
            break;
        case KeyEnum.Space:
            AppState.tetracubeDropDown = true;
            break;
        case KeyEnum.q: // todo: remove
            AppState.gameStopped = true;
            break;
        case KeyEnum.p:
            AppState.gamePaused = !AppState.gamePaused;
            break;
        case KeyEnum.j:
            rotateViewpoint([0, 1, 0], glMatrix.toRadian(ROTATION_ANGLE));
            break;
        case KeyEnum.l:
            rotateViewpoint([0, 1, 0], -glMatrix.toRadian(ROTATION_ANGLE));
            break;
        case KeyEnum.i:
            rotateViewpoint([1, 0, 0], glMatrix.toRadian(ROTATION_ANGLE));
            break;
        case KeyEnum.k:
            rotateViewpoint([1, 0, 0], -glMatrix.toRadian(ROTATION_ANGLE));
            break;
        case KeyEnum.u:
            rotateViewpoint([0, 0, 1], glMatrix.toRadian(ROTATION_ANGLE));
            break;
        case KeyEnum.o:
            rotateViewpoint([0, 0, 1], -glMatrix.toRadian(ROTATION_ANGLE));
            break;
        case KeyEnum.Plus:
            zoomIn();
            break;
        case KeyEnum.Minus:
            zoomOut();
            break;
        case KeyEnum.g:
            toggleTetris3DGrid();
            break;
        case KeyEnum.v:
            toggleViewing();
            break;
        case KeyEnum.f:
            AppState.gouraudEnabled = !AppState.gouraudEnabled;
            break;
        default:
            break;
    }
}

function zoomIn(): void {
    Global.camera.zoom(ZOOM_COEFFICIENT);
}

function zoomOut(): void {
    Global.camera.zoom(1 / ZOOM_COEFFICIENT);
}

function toggleViewing(): void {
    Global.camera.toggleViewing();
}

function rotateViewpoint(axis: vec3, angle: number): void {
    const gridCenter = TetrisGridFactory.getTetrisGridCenter();

    Global.camera.rotateViewMatrix(angle, gridCenter, axis);
}

function handleMouseMovementInput(input: MouseInput) {
    if (!InputManager.isMouseUp()) {
        return;
    }

    if (previousMouseInput) {
        if (input.x > previousMouseInput.x) {        // moved left
            rotateViewpoint([0, 1, 0], -glMatrix.toRadian(ROTATION_ANGLE));
        } else if (input.x < previousMouseInput.x) { // moved right
            rotateViewpoint([0, 1, 0], glMatrix.toRadian(ROTATION_ANGLE));
        }
    }

    previousMouseInput = input;
}

function translateTetracube(vector: vec3) {
    let isLegalTranslation = true;

    const nonTetracubeObjects = Global.objects.filter((obj) => !AppState.activeTetracube.includes(obj));
    const { minBounds, maxBounds } = TetrisGridFactory.getTetrisGridBounds();

    for (const obj of AppState.activeTetracube) {
        obj.translate(vector);

        if (obj.collides(nonTetracubeObjects)) {
            isLegalTranslation = false;
        }

        if (checkIfObjectsIntersectsAxis(obj.getWorldVertices(), minBounds, maxBounds)) {
            isLegalTranslation = false;
        }
    }

    if (!isLegalTranslation) {
        for (const obj of AppState.activeTetracube) {
            obj.translate([-vector[0], -vector[1], -vector[2]])
        }
    }
}

function rotateTetracube(axis: vec3, angle: number) {
    const tetracubeVertices = AppState.activeTetracube.map((cube) => cube.getWorldVertices()).flat();
    const { xMin, xMax, yMin, yMax, zMin, zMax } = getBoundingCube(tetracubeVertices);

    const center: vec3 = [
        xMin + (xMax - xMin) / 2,
        yMin + (yMax - yMin) / 2,
        zMin + (zMax - zMin) / 2
    ].map((v) => Math.round(v * 100) / 100);

    AppState.activeTetracube.forEach((cube) => {
        cube.rotate(angle, axis, center);
    });

    let collides = true;
    const getGridFitTranslation = gridFitTranslationGenerator(CUBE_SIZE);

    while (collides) {
        const gridFitTranslation = getGridFitTranslation();
        if (!gridFitTranslation) {
            break;
        }

        AppState.activeTetracube.forEach((cube) => {
            cube.translate(gridFitTranslation);
        });

        collides = !!checkIfActiveTetracubeCollides();

        if (collides) {
            AppState.activeTetracube.forEach((cube) => {
                cube.translate([-gridFitTranslation[0], -gridFitTranslation[1], -gridFitTranslation[2]]);
            });
        }
    }

    if (collides) {
        AppState.activeTetracube.forEach((cube) => {
            cube.invertRotate();
        });
    }
}

function toggleTetris3DGrid(): void {
    if (AppState.tetrid3DGrid.length) { // remove grid
        Global.objects = Global.objects.filter((obj) => !AppState.tetrid3DGrid.includes(obj));
        AppState.tetrid3DGrid = [];
    } else {                            // create grid
        AppState.tetrid3DGrid = TetrisGridFactory.getTetris3DGrid();
        Global.objects.push(...AppState.tetrid3DGrid);
    }
}
