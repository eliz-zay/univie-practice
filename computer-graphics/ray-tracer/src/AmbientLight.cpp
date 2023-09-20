#pragma once

#include "AmbientLight.hpp"

AmbientLight::AmbientLight(vec3 color): Light(color, LightType::Ambient) {
}