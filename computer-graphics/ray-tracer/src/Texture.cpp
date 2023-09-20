#pragma once

#include <iostream>

#include "lib/lodepng/lodepng.h"

#include "Texture.hpp"

#define RGBA_SIZE 4
#define PNG_RANGE 255

Texture::Texture(string fileName) {
    unsigned error = lodepng::decode(this->image, this->width, this->height, fileName);
    if (error) {
        cout << "decoder error " << error << ": " << lodepng_error_text(error) << endl;
    }
}

vec3 Texture::getColor(vec2 point) {
    int width = floor(this->width * point.x());
    int height = floor(this->height * point.y());

    unsigned char *colorChar = &image[RGBA_SIZE * (this->width * height + width)];

    return vec3(
        float(colorChar[0]) / PNG_RANGE,
        float(colorChar[1]) / PNG_RANGE,
        float(colorChar[2]) / PNG_RANGE
    );
}