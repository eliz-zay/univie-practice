#pragma once

#include <iostream>

#include "Plane.hpp"

#include "RayHelper.cpp"

using namespace std;

Plane::Plane(vector<vec3> vertices, vector<vec3> normals, vector<vec2> textureVertices) {
    this->vertices = vertices;
    this->normals = normals;
    this->textureVertices = textureVertices;
}

bool Plane::intersection(vec3 origin, vec3 dir, float* distance, vec3* color, vec3* normal) {
    float dist;
    vec2 interpolation;

    bool hit = RayHelper::triangleIntersection(origin, dir, this->vertices[0], this->vertices[1], this->vertices[2], dist, interpolation);

    if (!hit) {
        return false;
    }

    vector<vec2> textureVertices = this->textureVertices;

    *distance = dist;
    *color = this->getColor(textureVertices, interpolation);
    *normal = this->normals[0];

    return true;
}

vec3 Plane::getColor(vector<vec2> vertices, vec2 interpolation) {
    if (this->texture != nullptr) {
        vec2 texturePoint = this->interpolateTo2d(vertices, interpolation);
        return this->texture->getColor(texturePoint);
    }

    return this->color;
}

vec2 Plane::interpolateTo2d(vector<vec2> vertices, vec2 interpolation) {
    float a = interpolation.x(), b = interpolation.y();

    float u = (1 - a - b) * vertices[0].x() + a * vertices[1].x() + b * vertices[2].x();
    float v = (1 - a - b) * vertices[0].y() + a * vertices[1].y() + b * vertices[2].y();

    return vec2(u, v);
}
