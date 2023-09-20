import { mat4, vec3, glMatrix } from 'gl-matrix';

interface CameraInitParams {
    lookAtVector: vec3;
    originVector: vec3;
    width: number;
    height: number;
}

const MOVEMENT_SENSITIVITY = 0.2;

enum ViewingMode {
    Ortho = 'Ortho',
    Perspective = 'Perspective',
}

export class Camera {
    private lookAtVector: vec3;
    private originVector: vec3;

    private readonly width: number;
    private readonly height: number;

    private viewMatrix: mat4;
    private projectionMatrix: mat4;
    private viewingMode: ViewingMode;

    constructor(params: CameraInitParams) {
        this.lookAtVector = params.lookAtVector;
        this.originVector = params.originVector;

        this.width = params.width;
        this.height = params.height;

        this.viewMatrix = mat4.lookAt(
            mat4.create(),
            this.originVector,
            this.lookAtVector,
            [0, 1, 0]   // up
        );

        this.viewingMode = ViewingMode.Ortho;
        this.setOrtho();
    }

    public getOriginVector(): vec3 {
        return this.originVector;
    }

    public move(movementVector: vec3): void {
        vec3.scale(movementVector, movementVector, -MOVEMENT_SENSITIVITY);
        vec3.add(this.originVector, this.originVector, movementVector);

        this.viewMatrix = mat4.translate(this.viewMatrix, this.viewMatrix, movementVector);
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public getProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }

    public rotateViewMatrix(angle: number, center: vec3, axis: vec3): void {
        const equals = (a: vec3, b: vec3) => [0, 1, 2].every((i) => Math.abs(a[i] - b[i]) < 0.001);

        if (equals(axis, [1, 0, 0])) {
            vec3.rotateX(this.originVector, this.originVector, center, angle);
        } else if (equals(axis, [0, 1, 0])) {
            vec3.rotateY(this.originVector, this.originVector, center, angle);
        } else if (equals(axis, [0, 0, 1])) {
            vec3.rotateZ(this.originVector, this.originVector, center, angle);
        }

        this.viewMatrix = mat4.lookAt(
            mat4.create(),
            this.originVector,
            this.lookAtVector,
            [0, 1, 0]   // up
        );
    }

    public zoom(scaleValue: number): void {
        const negativeLookAt = vec3.create();
        vec3.negate(negativeLookAt, this.lookAtVector);

        mat4.translate(this.viewMatrix, this.viewMatrix, this.lookAtVector);
        mat4.scale(this.viewMatrix, this.viewMatrix, [scaleValue, scaleValue, scaleValue]);
        mat4.translate(this.viewMatrix, this.viewMatrix, negativeLookAt);
    }

    public toggleViewing(): void {
        if (this.viewingMode === ViewingMode.Ortho) {
            this.viewingMode = ViewingMode.Perspective;
            this.setPerspective();
        } else {
            this.viewingMode = ViewingMode.Ortho;
            this.setOrtho();
        }
    }

    private setOrtho(): void {
        this.projectionMatrix = mat4.ortho(
            mat4.create(),
            -this.width / 2,    // left
            this.width / 2,     // right
            -this.height / 2,   // bottom
            this.height / 2,    // top
            0.1,                // near
            100                 // far
        );
    }

    private setPerspective(): void {
        this.projectionMatrix = mat4.perspective(
            mat4.create(),
            glMatrix.toRadian(45),
            this.width / this.height,
            0.1,    // near plane
            100     // far plane
        );
    }
}
