#pragma once

#include "PointLight.hpp"

PointLight::PointLight(vec3 position, vec3 color): Light(color, LightType::Point) {
    this->position = position;
}

vec3 PointLight::getPosition() {
    return this->position;
}