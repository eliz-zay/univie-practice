#ifndef POINT_LIGHT
#define POINT_LIGHT

#include <map>
#include <vector>
#include <string>

#include "lib/vec/vec3.cpp"

#include "Light.hpp"

class PointLight: public Light {
    private:
        vec3 position;
    public:
        PointLight(vec3 position, vec3 color);

        vec3 getPosition();
};

#endif