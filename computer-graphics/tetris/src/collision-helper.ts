import { vec3 } from 'gl-matrix';

import { AppState } from './AppState';
import { Global } from './Global';
import { checkIfObjectsIntersectsAxis, getBoundingCube } from './physics';
import { TetrisGridFactory } from './TetrisGridFactory';

export function checkIfActiveTetracubeCollides(): vec3 | null {
    const nonTetracubeObjects = Global.objects.filter((obj) => !AppState.activeTetracube.includes(obj));
    const { minBounds, maxBounds } = TetrisGridFactory.getTetrisGridBounds();

    for (const obj of AppState.activeTetracube) {
        const collisionAbsVector = obj.collides(nonTetracubeObjects) ||
            checkIfObjectsIntersectsAxis(obj.getWorldVertices(), minBounds, maxBounds);

        if (collisionAbsVector) {
            return collisionAbsVector;
        }
    }

    return null;
}

export function gridFitTranslationGenerator(gridStep: number): () => vec3 | null {
    const updatedVertices = AppState.activeTetracube.map((cube) => cube.getWorldVertices()).flat();
    const { xMin, zMin } = getBoundingCube(updatedVertices);

    const getDelta = (initial: number, round: (x: number) => number) => (
        round(initial / gridStep) * gridStep - initial
    );

    const roundCombinations = [
        [Math.floor, Math.floor], [Math.floor, Math.ceil], [Math.ceil, Math.floor], [Math.ceil, Math.ceil]
    ];

    const translations = roundCombinations
        .map(([roundX, roundZ]) => {
            const dx = getDelta(xMin, roundX);
            const dz = getDelta(zMin, roundZ);
            const error = Math.abs(dx) + Math.abs(dz);

            return { vector: [dx, 0, dz], error };
        })
        .sort((a, b) => a.error - b.error)
        .map(({ vector }) => vector);

    let i = 0;

    return () => {
        const translation = translations[i];
        i++;

        return translation;
    };
}
