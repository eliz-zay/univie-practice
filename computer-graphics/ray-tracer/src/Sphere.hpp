#ifndef LIGHT_SPHERE
#define LIGHT_SPHERE

#include "Object.hpp"

class Sphere: public Object {
    private:
        float radius;
        vec3 center;

        vec3 getColor(vec3 point);
        vec2 interpolateTo2d(vec3 point);

    public:
        bool intersection(vec3 origin, vec3 dir, float* distance, vec3* color, vec3* normal);

        void setRadius(float radius);
        void setCenter(vec3 center);
};

#endif