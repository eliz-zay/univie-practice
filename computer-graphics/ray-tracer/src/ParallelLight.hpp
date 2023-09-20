#ifndef PARALLEL_LIGHT
#define PARALLEL_LIGHT

#include <map>
#include <vector>
#include <string>

#include "lib/vec/vec3.cpp"

#include "Light.hpp"

class ParallelLight: public Light {
    private:
        vec3 direction;

    public:
        ParallelLight(vec3 direction, vec3 color);

        vec3 getDirection();
};

#endif