#ifndef CAMERA
#define CAMERA

#include "lib/vec/vec3.cpp"
#include "lib/linalg/linalg.h"

using namespace linalg::aliases;

class Camera {
    public:
        static vec3 position;
        static vec3 lookat;
        static vec3 up;
        static float fov;
        static int width;
        static int height;
        static int maxBounces;

        static float4x4 getTransformMatrix();
};

#endif
