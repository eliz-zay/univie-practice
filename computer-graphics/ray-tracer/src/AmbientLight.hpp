#ifndef AMBIENT_LIGHT
#define AMBIENT_LIGHT

#include <map>
#include <vector>
#include <string>

#include "lib/vec/vec3.cpp"

#include "Light.hpp"

class AmbientLight: public Light {
    public:
        AmbientLight(vec3 color);
};

#endif