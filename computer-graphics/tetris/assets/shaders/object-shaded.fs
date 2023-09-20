precision mediump float;

varying vec3 normal;
varying vec3 fragmentCoordinates;
varying vec4 gouraudColor;

uniform vec4 color;
uniform vec3 lightVector;
uniform vec4 cameraPosition;

uniform vec3 ambDiffSpecParts;

varying float gouraud;

void main() {
  vec3 lightColor = vec3(1.0, 1.0, 1.0);

  vec3 norm = normalize(normal);

  vec3 lightDir = normalize(lightVector);

  // Ambient

  float ambientStrength = 0.2;
  vec3 ambient = ambientStrength * lightColor;

  // Diffusal

  float diffuseCoefficient = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diffuseCoefficient * lightColor;

  // Specular 

  float specularStrength = 0.5;
  vec3 viewDirection = normalize(cameraPosition.xyz - fragmentCoordinates);
  vec3 reflectDir = reflect(-lightDir, norm);
  float specularCoefficient = pow(max(dot(viewDirection, reflectDir), 0.0), 64.0);
  vec3 specular = specularStrength * specularCoefficient * lightColor;

  // Choosing lighting modes

  if (gouraud < 0.5) {  // phong
    gl_FragColor = vec4((ambDiffSpecParts[0] * ambient + ambDiffSpecParts[1] * diffuse) * color.xyz + ambDiffSpecParts[2] * specular, 1.0);
  } else {              // gouraud
    gl_FragColor = gouraudColor;
  }
}