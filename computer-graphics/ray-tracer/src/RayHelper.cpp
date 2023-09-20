#pragma once

#include <vector>

#include "lib/vec/vec2.cpp"
#include "lib/vec/vec3.cpp"

#define TRIANGLE_EPS 1e-8

namespace RayHelper {
    vec2 getViewplaneCoordinates(int i, int j, float offset, int width, int height, float fov) {
        float x =  ((2 * (j + 0.5) + offset) / (float)width - 1) * tan(fov / 2.) * width / ((float)height);
        float y = -((2 * (i + 0.5) + offset) / (float)height - 1) * tan(fov / 2.);

        return {x, y};
    }

    vec3 reflect(vec3 ray, vec3 normal) {
        return ray -  2.f * dot(ray, normal) * normal;
    }

    vec3 refract(vec3 ray, vec3 normal, float etaTarget, float etaIn = 1.f) { // Snell's law
        float cos1 = -dot(ray, normal);
        if (cos1 < 0.f) { // ray goes from inside the object
            return refract(ray, -normal, etaIn, etaTarget);
        }

        float eta = etaIn / etaTarget;
        float sin2 = eta * sqrtf(1 - cos1 * cos1);

        if (sin2 > 1.f) { // total internal reflection
            return reflect(ray, normal);
        }

        return eta * ray + normal * (eta * cos1 - sqrtf(1 - sin2 * sin2));
    }

    /**
     * source: https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/moller-trumbore-ray-triangle-intersection.html
    */
    bool triangleIntersection(vec3 orig, vec3 dir, vec3 vert1, vec3 vert2, vec3 vert3, float &distance, vec2 &uv) {
        vec3 e1 = vert2 - vert1;
        vec3 e2 = vert3 - vert1;

        vec3 pvec = cross(dir, e2);
        float det = dot(e1, pvec);

        /**
         * Back face culling
         * det < 0 => back facing
         * det < eps => ray misses the triangle
         * */ 
        if (det < TRIANGLE_EPS && det > -TRIANGLE_EPS) {
            return false;
        }

        float inverseDet = 1 / det;
        vec3 tvec = orig - vert1;
        float u = dot(tvec, pvec) * inverseDet;
        if (u < 0 || u > 1) {
            return false;
        }

        vec3 qvec = cross(tvec, e1);
        float v = dot(dir, qvec) * inverseDet;
        if (v < 0 || u + v > 1) {
            return false;
        }

        float dist = dot(e2, qvec) * inverseDet;

        if (dist < 0) {
            return false;
        }

        distance = dist;
        uv = vec2(u, v);
        
        return true;
    }
}