#ifndef OBJECT
#define OBJECT

#include "lib/vec/vec2.cpp"
#include "lib/vec/vec3.cpp"

#include "Material.hpp"
#include "Texture.hpp"

using namespace std;

class Object {
    protected:
        Material* material = NULL;
        Texture* texture = NULL;

        vec3 color;
        vector<vec2> textureVertices;

    public:
        virtual bool intersection(vec3 origin, vec3 dir, float* distance, vec3* color, vec3* normal) = 0;

        void setMaterial(Material* material);
        void setTexture(Texture* texture);

        Material* getMaterial();
        void setColor(vec3 color);
};

#endif