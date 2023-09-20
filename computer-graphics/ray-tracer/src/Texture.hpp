#ifndef TEXTURE
#define TEXTURE

#include <vector>
#include <string>

#include "lib/vec/vec2.cpp"
#include "lib/vec/vec3.cpp"

using namespace std;

class Texture {
    private:
        vector<unsigned char> image;

        unsigned width, height;
        
    public:
        Texture(string fileName);

        vec3 getColor(vec2 point);
};

#endif