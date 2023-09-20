#ifndef PLANE
#define PLANE

#include <vector>
#include <string>

#include "lib/vec/vec2.cpp"
#include "lib/vec/vec3.cpp"

#include "Object.hpp"
#include "Material.hpp"

using namespace std;

class Plane: public Object {
    private:
        float width, height;
        vec3 point;

        vector<vec3> vertices;
        vector<vec3> normals;

        vec3 getColor(vector<vec2> vertices, vec2 interpolation);
        vec2 interpolateTo2d(vector<vec2> vertices, vec2 interpolation);

    public:
        Plane(vector<vec3> vertices, vector<vec3> normals, vector<vec2> textureVertices);

        bool intersection(vec3 origin, vec3 dir, float* distance, vec3* color, vec3* normal);
};

#endif