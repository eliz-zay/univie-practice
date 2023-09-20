#pragma once

#include <cmath>
#include <ctgmath>
#include <math.h>

#include "Sphere.hpp"

bool Sphere::intersection(vec3 origin, vec3 dir, float* distance, vec3* color, vec3* normal) {
    vec3 len = this->center - origin;
    float proj = dot(len, dir);
    float lenToRay = dot(len, len) - pow(proj, 2);

    if (lenToRay > pow(this->radius, 2)) {
        return false;
    }

    float projInSphere = sqrtf(pow(this->radius, 2) - lenToRay);

    float projOutSphere = proj - projInSphere;
    float projToFurtherHit = proj + projInSphere;
    if (projOutSphere < 0) {
        projOutSphere = projToFurtherHit;
    }
    if (projOutSphere < 0) {
        return false;
    }

    *distance = projOutSphere;
    *color = this->getColor(origin + *distance * normalize(dir));
    *normal = normalize((origin + dir * projOutSphere) - this->center);

    return true;
}

vec3 Sphere::getColor(vec3 point) {
    if (this->texture != nullptr) {
        vec2 texturePoint = this->interpolateTo2d(point);
        return this->texture->getColor(texturePoint);
    }

    return this->color;
}

vec2 Sphere::interpolateTo2d(vec3 point) {
    vec3 d = normalize(point - this->center);

    float u = 0.5 + atan2(d.x(), d.z()) / (2 * M_PI);
    float v = 0.5 - asin(d.y()) / M_PI;

    return vec2(u, v);
}

void Sphere::setRadius(float radius) {
    this->radius = radius;
}

void Sphere::setCenter(vec3 center) {
    this->center = center;
}