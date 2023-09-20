import { mat4, vec4, vec3, vec2 } from "gl-matrix";

export enum ShaderUniformVariableEnum {
  ModelMatrix = "modelMatrix",
  ViewMatrix = "viewMatrix",
  ProjectionMatrix = "projectionMatrix",
  Color = "color",
  LightVector = "lightVector",
  CameraPosition = "cameraPosition",
  AmbDiffSpecParts = "ambDiffSpecParts",
  GouraudEnabled = "gouraudEnabled",
  Texture = "texture",
}

export enum ShaderAttributeEnum {
  Position = "vertexPosition",
  Normal = "vertexNormal",
  TextureMapping = "texturePosition",
}

interface Attributes {
  position: AttributeVariable;
  normal: AttributeVariable;
  textureMapping: AttributeVariable;
}

interface AttributeVariable {
  location: number;
  buffer?: WebGLBuffer;
  size: number;
}

interface Uniforms {
  modelMatrix: UniformVariable<mat4>;
  projectionMatrix: UniformVariable<mat4>;
  viewMatrix: UniformVariable<mat4>;
  color: UniformVariable<vec4>;
  lightVector: UniformVariable<vec3>;
  cameraPosition: UniformVariable<vec4>;
  ambDiffSpecParts: UniformVariable<vec3>;
  gouraudEnabled: UniformVariable<number>;
  texture: UniformVariable<number>;
}

interface UniformVariable<T> {
  location: WebGLUniformLocation;
  type: UniformVariableTypeEnum;
  value?: T;
}

enum UniformVariableTypeEnum {
  Mat4 = 'mat4',
  Vec4 = 'vec4',
  Vec3 = 'vec3',
  Vec2 = 'vec2',
  Int = 'int',
  Sample2D = 'sample2D',
}

interface UniformValues {
  modelMatrix?: mat4;
  projectionMatrix?: mat4;
  viewMatrix?: mat4;
  color?: vec4;
  lightVector: vec3;
  cameraPosition: vec4;
  ambDiffSpecParts: vec3;
  gouraudEnabled?: number;
  texture?: number;
}

interface AttributeValues {
  position: WebGLBuffer;
  normal: WebGLBuffer;
  textureMapping: WebGLBuffer;
}

export class Shader {
  private readonly renderingContext: WebGLRenderingContext;
  private readonly glShaderProgram: WebGLProgram;

  private readonly attributes: Attributes;
  private readonly uniforms: Uniforms;

  constructor(renderingContext: WebGLRenderingContext, glShaderProgram: WebGLProgram) {
    this.renderingContext = renderingContext;
    this.glShaderProgram = glShaderProgram;

    this.attributes = {
      position: {
        location: this.renderingContext.getAttribLocation(this.glShaderProgram, ShaderAttributeEnum.Position),
        size: 4
      },
      normal: {
        location: this.renderingContext.getAttribLocation(this.glShaderProgram, ShaderAttributeEnum.Normal),
        size: 4
      },
      textureMapping: {
        location: this.renderingContext.getAttribLocation(this.glShaderProgram, ShaderAttributeEnum.TextureMapping),
        size: 2
      }
    };

    this.uniforms = {
      modelMatrix: {
        type: UniformVariableTypeEnum.Mat4,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.ModelMatrix)!
      },
      viewMatrix: {
        type: UniformVariableTypeEnum.Mat4,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.ViewMatrix)!
      },
      projectionMatrix: {
        type: UniformVariableTypeEnum.Mat4,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.ProjectionMatrix)!
      },
      color: {
        type: UniformVariableTypeEnum.Vec4,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.Color)!
      },
      lightVector: {
        type: UniformVariableTypeEnum.Vec3,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.LightVector)!
      },
      cameraPosition: {
        type: UniformVariableTypeEnum.Vec4,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.CameraPosition)!
      },
      ambDiffSpecParts: {
        type: UniformVariableTypeEnum.Vec3,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.AmbDiffSpecParts)!
      },
      gouraudEnabled: {
        type: UniformVariableTypeEnum.Int,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.GouraudEnabled)!
      },
      texture: {
        type: UniformVariableTypeEnum.Sample2D,
        location: this.renderingContext.getUniformLocation(this.glShaderProgram, ShaderUniformVariableEnum.Texture)!
      }
    }
  }

  public use() {
    this.renderingContext.useProgram(this.glShaderProgram);
  }

  public setUniforms(values: UniformValues) {
    Object.entries(values).forEach(([key, value]) => {
      this.setUniform(key as keyof Uniforms, value);

      this.uniforms[key as keyof Uniforms].value = value;
    });
  }

  public setAttributes(values: AttributeValues) {
    Object.entries(values).forEach(([key, value]) => {
      const attribute: AttributeVariable = this.attributes[key as keyof Attr];

      this.renderingContext.bindBuffer(this.renderingContext.ARRAY_BUFFER, value);

      const size = attribute.size;          // vec4, number of elements for each attribute/vertex
      const type = this.renderingContext.FLOAT;   // type of attributes
      const normalize = false; // is data normalized
      const stride = size * Float32Array.BYTES_PER_ELEMENT; // size for one vertex
      const offset = 0;        // start at the beginning of the buffer

      this.renderingContext.vertexAttribPointer(attribute.location, size, type, normalize, stride, offset);
      this.renderingContext.enableVertexAttribArray(attribute.location);
    });
  }

  private setUniform(key: keyof Uniforms, value: vec4 | mat4) {
    const uniform = this.uniforms[key];

    switch (uniform.type) {
      case UniformVariableTypeEnum.Mat4:
        this.renderingContext.uniformMatrix4fv(uniform.location, false, value as mat4);
        break;
      case UniformVariableTypeEnum.Vec4:
        this.renderingContext.uniform4fv(uniform.location, value as vec4);
        break;
      case UniformVariableTypeEnum.Vec3:
        this.renderingContext.uniform3fv(uniform.location, value as vec3);
        break;
      case UniformVariableTypeEnum.Vec2:
        this.renderingContext.uniform2fv(uniform.location, value as vec2);
        break;
      case UniformVariableTypeEnum.Int:
        this.renderingContext.uniform1i(uniform.location, value as number)
        break;
      case UniformVariableTypeEnum.Sample2D:
        this.renderingContext.uniform1i(uniform.location, value as number)
        break;
      default:
        throw new Error(`Unknown uniform type - ${uniform.type}`);
    }
  }
}
