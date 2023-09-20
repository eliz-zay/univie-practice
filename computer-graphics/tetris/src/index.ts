import { handleInput } from './input';
import { GlContext } from './GlContext';
import { Global } from './Global';
import { Camera } from './Camera';
import { generateObjects, spawnTetracube } from './object-generator';
import { ModelLoader } from './infrastructure';
import { Renderer } from './render/Renderer';
import { AppState } from './AppState';
import { checkIfActiveTetracubeCollides } from './collision-helper';
import { checkIfUpperLevelFree, clearFilledLevels } from './level-helper';
import { TextureLoader } from './infrastructure/TextureLoader';

function generateRender() {
    let prevTimeSeconds = 0;

    function render(timeMs: number) {
        if (AppState.gameStopped) {
            return;
        }

        const { gl } = GlContext;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var deltaTime = timeMs / 1000 - prevTimeSeconds;

        if (!AppState.gameEnded) {
            processCurrentTetracube(deltaTime);
        }

        Global.objects.forEach((object) => {
            object.draw();
        });

        prevTimeSeconds = timeMs / 1000;

        requestAnimationFrame(render)
    };

    return render;
}

function processCurrentTetracube(deltaTime: number) {
    const collisionAbsVector = checkIfActiveTetracubeCollides();

    if (collisionAbsVector) {
        AppState.activeTetracube.forEach((cube) => {
            cube.translateUpByCollision(collisionAbsVector);
        });

        clearFilledLevels();

        if (checkIfUpperLevelFree()) {
            spawnTetracube();
        } else {
            AppState.gameEnded = true;
        }

        if (AppState.tetracubeDropDown) {
            AppState.tetracubeDropDown = false;
        }

        return;
    }

    if (!AppState.gamePaused) {
        for (const obj of AppState.activeTetracube) {
            obj.update(deltaTime);
        }
    }
}

/**
 * Main function
 */

async function run() {
    GlContext.init();
    const { gl, clientWidth, clientHeight } = GlContext;

    Renderer.init(gl);

    await Promise.all([
        Renderer.loadShader("object"),
        Renderer.loadShader("object-shaded"),
        Renderer.loadShader("object-textured")
    ]);

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, clientWidth, clientHeight);
    gl.clearColor(0.5, 0.6, 0.6, 1);

    /**
     * App code
     */

    await Promise.all([
        ModelLoader.loadModel('bunny'),
        ModelLoader.loadModel('cube'),
        ModelLoader.loadModel('teapot'),
        ModelLoader.loadModel('tetrahedron'),
    ]);

    await TextureLoader.loadTexture('cat');

    Global.camera = new Camera({
        lookAtVector: [0, 2, 0],
        originVector: [6, 5, 3],
        width: 12,
        height: 6
    });

    generateObjects();

    requestAnimationFrame(generateRender());

    handleInput();
}

run();
