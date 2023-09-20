#pragma once

#include "Light.hpp"

Light::Light(vec3 color, LightType type) {
    this->type = type;
    this->color = color;
}

vec3 Light::getColor() {
    return this->color;
}

LightType Light::getType() {
    return this->type;
}