#ifndef MATERIAL
#define MATERIAL

#include "lib/vec/vec3.cpp"

using namespace std;

struct Phong {
    float ambient;
    float diffuse;
    float specular;
    float exponent;
};

struct Material {
    bool isLight = false;

    Phong phong = Phong();
    float reflectanceFraction;
    float transmittanceFraction;
    float refractionIof;

    bool isGlass();
};

#endif