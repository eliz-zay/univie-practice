#ifndef LIGHT
#define LIGHT

#include <map>
#include <vector>
#include <string>

#include "lib/vec/vec3.cpp"

enum LightType {
    Ambient,
    Point,
    Parallel,
    Spot
};

class Light {
    private:
        LightType type;

        vec3 color;

    public:
        Light(vec3 color, LightType type);

        vec3 getColor();
        LightType getType();
};

#endif