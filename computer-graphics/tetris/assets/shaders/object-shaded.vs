precision mediump float;

attribute vec4 vertexPosition;
attribute vec4 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 lightVector;
uniform vec4 cameraPosition;
uniform vec4 color;

uniform vec3 ambDiffSpecParts;

uniform int gouraudEnabled;

varying vec3 normal;
varying vec3 fragmentCoordinates;
varying vec4 gouraudColor;

varying float gouraud;

void main() {
  vec3 lightColor = vec3(1.0, 1.0, 1.0);

  fragmentCoordinates = vec3(modelMatrix * vertexPosition);
  normal = mat3(modelMatrix) * vertexNormal.xyz;

  vec3 norm = normalize(normal);
  vec3 lightDir = normalize(lightVector);

  // Ambient

  float ambientStrength = 0.2; // ambient
  vec3 ambient = ambientStrength * lightColor;

  // Diffusal

  float diffuseCoefficient = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diffuseCoefficient * lightColor;

  // Specular 

  float specularStrength = 0.5; // specular
  vec3 viewDirection = normalize(cameraPosition.xyz - fragmentCoordinates);
  vec3 reflectDir = reflect(-lightDir, norm);
  float specularCoefficient = pow(max(dot(viewDirection, reflectDir), 0.0), 64.0);
  vec3 specular = specularStrength * specularCoefficient * lightColor;

  //

  if (gouraudEnabled == 1) {
    gouraud = 1.0;
    gouraudColor = vec4((ambDiffSpecParts[0] * ambient + ambDiffSpecParts[1] * diffuse) * color.xyz + ambDiffSpecParts[2] * specular, 1.0);
  } else {
    gouraud = 0.0;
  }

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPosition;
}