#pragma once

#include "ParallelLight.hpp"

ParallelLight::ParallelLight(vec3 direction, vec3 color): Light(color, LightType::Parallel) {
    this->direction = direction;
}

vec3 ParallelLight::getDirection() {
    return this->direction;
}