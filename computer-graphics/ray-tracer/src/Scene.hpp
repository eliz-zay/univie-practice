#ifndef SCENE
#define SCENE

#include <vector>
#include <string>

#include "lib/vec/vec3.cpp"

#include "Object.hpp"
#include "Light.hpp"

class Light;
class Plane;

using namespace std;

class Scene {
    private:
        static vec3 backColor;

        static std::vector<Object*> objects;
        static std::vector<Light*> lights;

        Scene();

    public:
        static vec3 castRay(vec3 origin, vec3 dir, bool *hitGlass, int depth);
        static bool intersect(vec3* origin, vec3* dir, vec3* hit, vec3* normal, vec3* color, Material** material, Object** object, int depth);

        static void addObject(Object* sphere);
        static void addLight(Light* light);
        static void setBackColor(vec3 color);
};

#endif