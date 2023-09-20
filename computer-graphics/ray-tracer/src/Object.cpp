#pragma once

#include "Object.hpp"

void Object::setMaterial(Material* material) {
    this->material = material;
}

Material* Object::getMaterial() {
    return this->material;
}

void Object::setTexture(Texture* texture) {
    this->texture = texture;
}

void Object::setColor(vec3 color) {
    this->color = color;
}