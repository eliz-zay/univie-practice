import { mat4, vec3, vec4 } from 'gl-matrix';

import { IObject } from './IObject';
import { AppState } from './AppState';
import { Shader } from './render';
import { Global } from './Global';
import { Model } from './infrastructure';
import { IComponent } from './components';
import { GlContext } from './GlContext';
import { checkIfObjectsIntersect } from './physics';
import { TextureLoader } from './infrastructure/TextureLoader';

export const Colors = {
    Black: [0.0, 0.0, 0.0, 1.0],
    Red: [1.0, 0.0, 0.0, 1.0],
    Green: [0.0, 1.0, 0.0, 1.0],
    Blue: [0.0, 0.0, 1.0, 1.0],
    DarkBlue: [0.3, 0.3, 1.0, 1.0],
    LightBlue: [0.0, 1.0, 1.0, 1.0],
    Yellow: [1.0, 1.0, 0.0, 1.0],
    Orange: [1.0, 0.5, 0.0, 1.0],
    Purple: [1.0, 0.5, 1.0, 1.0],
    White: [1.0, 1.0, 1.0, 1.0],
    Transparent: [1.0, 1.0, 1.0, 0.0]
}

export interface ObjectConfig {
    model: Model;
    color: vec4;
    shader: Shader;
    components?: ComponentConstructor[];
    isNotCollidable?: boolean;
}

export type ComponentConstructor<T extends IComponent = any> = new (params: any) => T;

export class Object implements IObject {
    private isNotCollidable: boolean;

    private vertices: Float32Array;
    private verticesRaw: number[][];
    private textureMapping: Float32Array;
    private color: vec4;
    private normals: Float32Array;
    private buffers: { vertexBuffer: WebGLBuffer; normalBuffer: WebGLBuffer; textureMappingBuffer: WebGLBuffer; };
    private shader: Shader;

    private translationMatrix: mat4;
    private translationVector: vec3;
    private rotationMatrix: mat4;
    private angleMatrix: mat4;
    private lastAngleMatrix: mat4;
    private lastRotationMatrix: mat4;
    private scaleMatrix: mat4;

    private components: IComponent[];

    constructor(config: ObjectConfig) {
        const { gl } = GlContext;

        this.buffers = {
            vertexBuffer: gl.createBuffer(),
            normalBuffer: gl.createBuffer(),
            textureMappingBuffer: gl.createBuffer(),
        };

        this.translationMatrix = mat4.create();
        this.translationVector = vec3.create();
        this.rotationMatrix = mat4.create();
        this.angleMatrix = mat4.create();
        this.lastAngleMatrix = mat4.create();
        this.lastRotationMatrix = mat4.create();
        this.scaleMatrix = mat4.create();

        this.vertices = config.model.vertexBuffer;
        this.color = config.color;
        this.normals = config.model.normalBuffer;
        this.shader = config.shader;
        this.textureMapping = config.model.textureMappingBuffer;

        this.verticesRaw = config.model.vertices;

        this.isNotCollidable = config.isNotCollidable;

        // Copy coordinates to the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        // Copy colors to the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

        // Copy texture mapping to the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureMappingBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.textureMapping, gl.STATIC_DRAW);

        this.components = config.components ? config.components.map((constr) => new constr(this)) : [];
    }

    public update(deltaTime: number): void {
        this.components.forEach((component) => component.apply(deltaTime));
    }

    public getWorldVertices(): vec3[] {
        const transformationMatrix = this.generateTransformationMatrix();

        const worldVertices = this.verticesRaw.map((vertex) => {
            const vertexTransformed = [...vertex];
            vec3.transformMat4(vertexTransformed, vertexTransformed, transformationMatrix);
            return vertexTransformed;
        });

        return worldVertices;
    }

    collides(objects: IObject[]): vec3 | null {
        for (const obj of objects) {
            if (obj === this || obj.checkIfNotCollidable()) {
                continue;
            }

            const intersectionAbsVector = checkIfObjectsIntersect(this.getWorldVertices(), obj.getWorldVertices());
            if (intersectionAbsVector) {
                return intersectionAbsVector;
            }
        }

        return null;
    }

    translateUpByCollision(collisionAbsVector: vec3): void {
        this.translate([0, collisionAbsVector[1], 0]);
    }

    public draw(): void {
        const { gl } = GlContext;

        this.shader.use();

        this.shader.setAttributes({
            position: this.buffers.vertexBuffer,
            normal: this.buffers.normalBuffer,
            textureMapping: this.buffers.textureMappingBuffer,
        });

        const transformationMatrix = this.generateTransformationMatrix();

        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(gl.TEXTURE_2D, TextureLoader.getTexture('cat'));

        this.shader.setUniforms({
            projectionMatrix: Global.camera.getProjectionMatrix(),
            viewMatrix: Global.camera.getViewMatrix(),
            modelMatrix: transformationMatrix,
            color: this.color,
            lightVector: Global.lightVector,
            cameraPosition: [...Global.camera.getOriginVector(), 1.0],
            ambDiffSpecParts: Global.ambDiffSpecParts,
            gouraudEnabled: AppState.gouraudEnabled ? 1 : 0,
            texture: 0
        });

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
    }

    public rotate(angle: number, axis: vec3, center?: vec3): void {
        const deltaVector = vec3.create();
        vec3.sub(deltaVector, center, this.translationVector);

        const negativeDelta = vec3.create();
        vec3.negate(negativeDelta, deltaVector);

        const inverseRotation = mat4.create();
        const localAxis = vec3.create();
        mat4.invert(inverseRotation, this.angleMatrix);
        vec3.transformMat4(localAxis, axis, inverseRotation);

        const rotation = mat4.create();
        mat4.translate(rotation, rotation, deltaVector);
        mat4.rotate(rotation, rotation, angle, localAxis);
        mat4.translate(rotation, rotation, negativeDelta);

        mat4.mul(this.rotationMatrix, this.rotationMatrix, rotation);

        
        // save only rotation without translation
        mat4.rotate(this.angleMatrix, this.angleMatrix, angle, localAxis);

        // save last rotation angle
        this.lastAngleMatrix = mat4.create();
        mat4.rotate(this.lastAngleMatrix, this.lastAngleMatrix, angle, localAxis);

        // save whole rotationMatrix change
        this.lastRotationMatrix = rotation;
    }

    public invertRotate(): void {
        // save inversed rotation
        mat4.invert(this.lastRotationMatrix, this.lastRotationMatrix);
        // save inversed angle
        mat4.invert(this.lastAngleMatrix, this.lastAngleMatrix);

        // inverse rotate rotationMatrix
        mat4.mul(this.rotationMatrix, this.rotationMatrix, this.lastRotationMatrix);
        // inverse rotate angleMatrix 
        mat4.mul(this.angleMatrix, this.angleMatrix, this.lastAngleMatrix);
    }

    public translate(vector: vec3): void {
        mat4.translate(this.translationMatrix, this.translationMatrix, vector);
        vec3.add(this.translationVector, this.translationVector, vector);
    }

    public scale(vector: vec3): void {
        mat4.scale(this.scaleMatrix, this.scaleMatrix, vector);
    }

    public checkIfNotCollidable(): boolean {
        return this.isNotCollidable;
    }

    private generateTransformationMatrix(): mat4 {
        const transformationMatrix = mat4.create();
        
        mat4.mul(transformationMatrix, transformationMatrix, this.translationMatrix);
        mat4.mul(transformationMatrix, transformationMatrix, this.rotationMatrix);
        mat4.mul(transformationMatrix, transformationMatrix, this.scaleMatrix);

        return transformationMatrix;
    }
}
