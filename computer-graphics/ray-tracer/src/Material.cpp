#pragma once

#include "Material.hpp"

bool Material::isGlass() {
    return this->transmittanceFraction > 0;
}