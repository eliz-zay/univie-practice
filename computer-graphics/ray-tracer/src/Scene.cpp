#pragma once

#include "Scene.hpp"

#include "Object.cpp"
#include "Light.cpp"
#include "PointLight.cpp"
#include "AmbientLight.cpp"
#include "ParallelLight.cpp"
#include "Material.cpp"
#include "RayHelper.cpp"
#include "Sphere.cpp"
#include "Camera.hpp"

#define SCENE_EPS 1e-4

vector<Object*> Scene::objects = {};
vector<Light*> Scene::lights = {};
vec3 Scene::backColor = vec3();

vec3 Scene::castRay(vec3 origin, vec3 dir, bool *hitGlass, int depth = 0) {
    vec3 fogColor = vec3(0.6, 0, 0);
    vec3 color, normal, hit;
    Material* material;
    Object* object;

    bool isIntersect = Scene::intersect(&origin, &dir, &hit, &normal, &color, &material, &object, depth);

    if (!isIntersect || depth > Camera::maxBounces) {
        return Scene::backColor;
    }
    if (depth == 0) {
        *hitGlass = material->isGlass();
    }

    vec3 diffuseColor, ambientColor, specularColor;

    vec3 reflectDir = normalize(RayHelper::reflect(dir, normal));
    vec3 reflectOrig = dot(reflectDir, normal) < 0 ? hit - normal * SCENE_EPS : hit + normal * SCENE_EPS;
    vec3 reflectColor = Scene::castRay(reflectOrig, reflectDir, nullptr, depth + 1);

    vec3 refractDir = normalize(RayHelper::refract(dir, normal, material->refractionIof));
    vec3 refractOrig = dot(refractDir, normal) < 0 ? hit - normal * SCENE_EPS : hit + normal * SCENE_EPS;
    vec3 refractColor = Scene::castRay(refractOrig, refractDir, nullptr, depth + 1);

    for (Light* light: Scene::lights) {
        if (light->getType() == LightType::Ambient) {
            ambientColor += color * light->getColor();
            continue;
        }

        vec3 lightDir;

        switch (light->getType()) {
            case LightType::Parallel: {
                lightDir = -normalize(static_cast<ParallelLight*>(light)->getDirection());
                break;
            }
            case LightType::Point: {
                vec3 lightPosition = static_cast<PointLight*>(light)->getPosition();
                lightDir = normalize(lightPosition - hit);
                break;
            }
            default: {
                break;
            }
        }

        vec3 shadowOrig = dot(lightDir, normal) < 0 ? hit - normal * SCENE_EPS : hit + normal * SCENE_EPS;
        vec3 shadowHit, shadowNorm, tmpColor; // we only need shadow hit and normal
        Material* tmpMaterial;
        Object* tmpObj;

        bool shadowed = Scene::intersect(&shadowOrig, &lightDir, &shadowHit, &shadowNorm, &tmpColor, &tmpMaterial, &tmpObj, depth);

        bool isShadowOrigCloserThanLight = true; // true for parallel sources

        if (light->getType() == LightType::Point) {
            vec3 lightPosition = static_cast<PointLight*>(light)->getPosition();
            isShadowOrigCloserThanLight = (shadowHit - shadowOrig).norm() < (lightPosition - hit).norm();
        }
        
        if (shadowed && isShadowOrigCloserThanLight) {
            continue; // current light causes shadow => check the next one
        }

        diffuseColor += light->getColor() * color * max(dot(lightDir, normal), 0.f);

        vec3 reflectDir = normalize(RayHelper::reflect(lightDir, normal));
        specularColor += light->getColor() * powf(max(dot(reflectDir, dir), 0.f), material->phong.exponent);
    }

    return
        (1 - material->reflectanceFraction - material->transmittanceFraction) * (
            material->phong.ambient * ambientColor +
            material->phong.diffuse * diffuseColor + 
            material->phong.specular * specularColor
        ) +
        material->reflectanceFraction * reflectColor +
        material->transmittanceFraction * refractColor;
}

bool Scene::intersect(vec3* origin, vec3* dir, vec3* hit, vec3* normal, vec3* color, Material** material, Object** object, int depth) {
    float hitDist = numeric_limits<float>::max();
    bool hitScene = false;
    vec3 hitColor, hitNormal;

    Object* hitObj;

    for (Object* obj: Scene::objects) {
        // Draw a light only at straight view (depth == 0) and not as a shadow origin
        if (obj->getMaterial()->isLight && depth > 0) {
            continue;
        }

        vec3 iColor, iNormal;
        float iDist;
        if (obj->intersection(*origin, *dir, &iDist, &iColor, &iNormal) && iDist < hitDist) {
            hitScene = true;
            hitDist = iDist;
            hitNormal = iNormal;
            hitColor = iColor;
            hitObj = obj;
        }
    }

    if (!hitScene) {
        return false;
    }

    *hit = (*origin) + (*dir) * hitDist;
    *normal = hitNormal;
    *color = hitColor;
    *material = hitObj->getMaterial();
    *object = hitObj;

    return true;
}

void Scene::addObject(Object* obj) {
    Scene::objects.push_back(obj);
}

void Scene::addLight(Light* light) {
    Scene::lights.push_back(light);
}

void Scene::setBackColor(vec3 color) {
    Scene::backColor = color;
}
