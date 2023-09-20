#pragma once

#include <cmath>

#include "Camera.hpp"

vec3 Camera::position = vec3();
vec3 Camera::lookat = vec3();
vec3 Camera::up = vec3();
float Camera::fov = 0;
int Camera::width = 0;
int Camera::height = 0;
int Camera::maxBounces = 0;

float4x4 Camera::getTransformMatrix() {
    vec3 z = normalize(Camera::position - Camera::lookat);
    vec3 x = normalize(cross(Camera::up, z));
    vec3 y = normalize(cross(z, x));

    float4 column1(x[0], x[1], x[2], 0.f);
    float4 column2(y[0], y[1], y[2], 0.f);
    float4 column3(z[0], z[1], z[2], 0.f);
    float4 column4(Camera::position[0], Camera::position[1], Camera::position[2], 1.f);

    float4x4 matrix(column1, column2, column3, column4);
    
    return matrix;
}
