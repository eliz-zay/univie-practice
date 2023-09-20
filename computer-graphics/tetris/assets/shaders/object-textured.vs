precision mediump float;

attribute vec2 texturePosition;
attribute vec4 vertexPosition;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 fragmentCoordinates;
varying vec2 vTexturePosition;

void main() {
    fragmentCoordinates = vec3(modelMatrix * vertexPosition);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPosition;

    vTexturePosition = texturePosition;
}