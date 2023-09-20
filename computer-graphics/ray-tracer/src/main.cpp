#include <iostream>
#include <fstream>
#include <sstream>
#include <limits>
#include <cmath>
#include <vector>
#include <cstring>

#include "lib/rapidxml-1.13/rapidxml.hpp"
#include "lib/vec/vec2.cpp"
#include "lib/vec/vec3.cpp"
#include "lib/linalg/linalg.h"

#include "Scene.cpp"
#include "Light.cpp"
#include "AmbientLight.cpp"
#include "PointLight.cpp"
#include "ParallelLight.cpp"
#include "Sphere.cpp"
#include "Plane.cpp"
#include "Texture.cpp"
#include "Camera.cpp"
#include "Object.cpp"
#include "infrastructure/StringHelper.cpp"
#include "infrastructure/ModelLoader.cpp"
#include "infrastructure/AssetLoader.cpp"

using namespace std;
using namespace StringHelper;
using namespace linalg::aliases;

float toRad(float degrees) {
    return degrees * (M_PI / 180);
}

void addVec3Component(rapidxml::xml_attribute<char> *attr, vec3 *vector) {
    const float component = stof(attr->value());

    switch (hashstr(attr->name())) {
        case hashstr("r"):
        case hashstr("x"):
            *vector += vec3(component, 0, 0);
            break;
        case hashstr("g"):
        case hashstr("y"):
            *vector += vec3(0, component, 0);
            break;
        case hashstr("b"):
        case hashstr("z"):
            *vector += vec3(0, 0, component);
            break;
    }
}

void parseCameraAttributes(rapidxml::xml_node<char> *node1, rapidxml::xml_attribute<char> *attr) {
    switch (hashstr(node1->name())) {
        case (hashstr("position")): addVec3Component(attr, &Camera::position); break;
        case (hashstr("lookat")): addVec3Component(attr, &Camera::lookat); break;
        case (hashstr("up")): addVec3Component(attr, &Camera::up); break;
        case (hashstr("horizontal_fov")): Camera::fov = toRad(stof(attr->value()) * 2); break;
        case (hashstr("resolution")):
            if (!strcmp(attr->name(), "horizontal")) {
                Camera::width = stoi(attr->value());
            } else if (!strcmp(attr->name(), "vertical")) {
                Camera::height = stoi(attr->value());
            }
            break;
        case (hashstr("max_bounces")): Camera::maxBounces = stoi(attr->value()); break;
    }
}

vector<Object*> parseSurfaceAttributes(rapidxml::xml_node<char> *node1, rapidxml::xml_attribute<char> *attr, vector<Object*> &spheres, vector<Object*> &planes) {
    switch (hashstr(node1->name())) {
        case (hashstr("sphere")): {
            spheres.push_back(new Sphere());
            dynamic_cast<Sphere*>(spheres.back())->setRadius(stof(attr->value()));
            return {spheres.back()};
            break;
        }
        case (hashstr("mesh")): {
            vector<Model*> models = ModelLoader::loadModels("scenes/" + string(attr->value()));
            vector<Object*> objects;

            for (auto model : models) {
                Plane* plane = new Plane(
                    model->vertices,
                    model->normals,
                    model->textureVertices
                );

                planes.push_back(plane);
                objects.push_back(plane);
            }

            return objects;
            break;
        }
    }

    return {};
}

void parseMaterialAttributes(rapidxml::xml_node<char> *node3, rapidxml::xml_attribute<char> *attr, Material* material) {
    float value = stof(attr->value());

    switch (hashstr(node3->name())) {
        case (hashstr("phong")):
            switch (hashstr(attr->name())) {
                case hashstr("ka"): material->phong.ambient = value; break;
                case hashstr("kd"): material->phong.diffuse = value; break;
                case hashstr("ks"): material->phong.specular = value; break;
                case hashstr("exponent"): material->phong.exponent = value; break;
            }
            break;
        case (hashstr("reflectance")): material->reflectanceFraction = value; break;
        case (hashstr("transmittance")): material->transmittanceFraction = value; break;
        case (hashstr("refraction")): material->refractionIof = value; break;
    }
}

void parseMaterialSolidAttributes(rapidxml::xml_node<char> *node3, rapidxml::xml_attribute<char> *attr, Material* material, vec3 *color) {
    switch (hashstr(node3->name())) {
        case (hashstr("color")): addVec3Component(attr, color); break;
        default: parseMaterialAttributes(node3, attr, material); break;
    }
}

void parseMaterialTexturedAttributes(rapidxml::xml_node<char> *node3, rapidxml::xml_attribute<char> *attr, Material* material, Texture** texture) {
    switch (hashstr(node3->name())) {
        case (hashstr("texture")): *texture = new Texture("scenes/" + string(attr->value())); break;
        default: parseMaterialAttributes(node3, attr, material); break;
    }
}

void parseXml(string fileContents, string *outFile) {
    rapidxml::xml_document<> doc;
    doc.parse<0>(&fileContents[0]);

    rapidxml::xml_node<> *sceneNode = doc.first_node("scene");
    *outFile = sceneNode->first_attribute()->value();

    vector<Object*> spheres = {};
    vector<Object*> planes = {};
    vector<Light*> lights = {};

    for (rapidxml::xml_node<> *coreNode = sceneNode->first_node(); coreNode; coreNode = coreNode->next_sibling()) {
       vec3 backColor(0, 0, 0);

        for (rapidxml::xml_attribute<> *attr = coreNode->first_attribute(); attr; attr = attr->next_attribute()) {
            if (!strcmp(coreNode->name(), "background_color")) {
                addVec3Component(attr, &backColor);
            }
        }

        if (!strcmp(coreNode->name(), "background_color")) {
            Scene::setBackColor(backColor);
        }

        for (rapidxml::xml_node<> *node1 = coreNode->first_node(); node1; node1 = node1->next_sibling()) {
            vector<Object*> processingObjects = {};

            for (rapidxml::xml_attribute<> *attr = node1->first_attribute(); attr; attr = attr->next_attribute()) {
                switch (hashstr(coreNode->name())) {
                    case (hashstr("camera")): parseCameraAttributes(node1, attr); break;
                    case (hashstr("surfaces")): processingObjects = parseSurfaceAttributes(node1, attr, spheres, planes); break;
                }
            }

            vec3 lightColor(0, 0, 0);
            vec3 lightPosition(0, 0, 0);
            vec3 lightDirection(0, 0, 0);

            for (rapidxml::xml_node<> *node2 = node1->first_node(); node2; node2 = node2->next_sibling()) {
                vec3 spherePosition(0, 0, 0);

                for (rapidxml::xml_attribute<> *attr = node2->first_attribute(); attr; attr = attr->next_attribute()) {
                    switch(hashstr(node1->name())) {
                        case (hashstr("ambient_light")):
                        case (hashstr("point_light")):
                        case (hashstr("parallel_light")):
                            switch (hashstr(node2->name())) {
                                case (hashstr("color")): addVec3Component(attr, &lightColor); break;
                                case (hashstr("position")): addVec3Component(attr, &lightPosition); break;
                                case (hashstr("direction")): addVec3Component(attr, &lightDirection); break;
                            }
                            break;
                        case (hashstr("sphere")):
                            if (!strcmp(node2->name(), "position")) {
                                addVec3Component(attr, &spherePosition);
                            }
                            break;
                    }
                }
                
                switch (hashstr(node1->name())) {
                    case (hashstr("sphere")):
                        if (!strcmp(node2->name(), "position")) {
                            dynamic_cast<Sphere*>(spheres.back())->setCenter(spherePosition);
                        }
                        break;
                }

                Material* material = new Material();
                Texture* texture = NULL;
                vec3 color;

                for (rapidxml::xml_node<> *node3 = node2->first_node(); node3; node3 = node3->next_sibling()) {
                    for (rapidxml::xml_attribute<> *attr = node3->first_attribute(); attr; attr = attr->next_attribute()) {
                        switch (hashstr(node2->name())) {
                            case hashstr("material_solid"): parseMaterialSolidAttributes(node3, attr, material, &color); break;
                            case hashstr("material_textured"): parseMaterialTexturedAttributes(node3, attr, material, &texture); break;
                        }
                    }
                }

                bool isMaterialNode = !strcmp(node2->name(), "material_solid") || !strcmp(node2->name(), "material_textured");

                if (isMaterialNode) {
                    for (Object* object : processingObjects) {
                        object->setMaterial(material);

                        if (texture != nullptr) {
                            object->setTexture(texture);
                        } else {
                            object->setColor(color);
                        }
                    }
                }
            }

            switch (hashstr(node1->name())) {
                case (hashstr("ambient_light")):
                    lights.push_back(new AmbientLight(lightColor));
                    break;
                case (hashstr("point_light")):
                    lights.push_back(new PointLight(lightPosition, lightColor));
                    break;
                case (hashstr("parallel_light")):
                    lights.push_back(new ParallelLight(lightDirection, lightColor));
                    break;
            }
        }
    }

    for (Light* light : lights) {
        Scene::addLight(light);
    }
    for (Object* sphere : spheres) {
        Scene::addObject(sphere);
    }
    for (Object* plane : planes) {
        Scene::addObject(plane);
    }
}

void toFile(string path, int width, int height, vector<vec3> framebuffer) {
    ofstream file;
    file.open(path);
    file << "P6\n" << width << " " << height << "\n255\n";

    for (size_t i = 0; i < width * height; i++) {
        vec3 &c = framebuffer[i];
        float max = std::max(c[0], std::max(c[1], c[2]));
        if (max > 1) {
            c = c * (1. / max);
        }
        for (int j = 0; j < 3; j++) {
            file << (char)(255 * std::max(0.f, std::min(1.f, framebuffer[i][j])));
        }
    }

    file.close();
}

vec3 castRayInPoint(vec2 xy, float4x4 matrix, vec3 shiftedPosition, bool *hitGlass) {
    vec3 rayOrigin = normalize(vec3(xy[0], xy[1], -1));
    float4 eOrigDir(rayOrigin[0], rayOrigin[1], rayOrigin[2], 1);
    float4 eDir = mul(matrix, eOrigDir);

    vec3 shiftedDir = normalize(vec3(eDir[0], eDir[1], eDir[2]) - shiftedPosition);

    return Scene::castRay(shiftedPosition, shiftedDir, hitGlass);
}

void render(string path) {
    const int width = Camera::width;
    const int height = Camera::height;
    const float fov = Camera::fov;
    const float samplesNum = 4;
    const float eps = 1.2;

    vector<vec3> framebuffer(width * height);

    // use the other lib for matrix calculations
    float4x4 matrix = Camera::getTransformMatrix();
    float4 tmpOrigPosition(0, 0, 0, 1);
    float4 tmpPosition = mul(matrix, tmpOrigPosition);

    vec3 position(tmpPosition[0], tmpPosition[1], tmpPosition[2]);

    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; j++) {
            bool hitGlass;
            int sampleCount = 1;

            vec2 xy = RayHelper::getViewplaneCoordinates(i, j, 0, width, height, fov);
            vec3 color = castRayInPoint(xy, matrix, position, &hitGlass);

            if (!hitGlass) {
                sampleCount = samplesNum;
                for (int sample = 1; sample < samplesNum; sample++) {
                    vec2 xy = RayHelper::getViewplaneCoordinates(i, j, eps * sample, width, height, fov);
                    color += castRayInPoint(xy, matrix, position, &hitGlass);
                }
            } else {
                for (int sample = 1; sample < samplesNum; sample++) {
                    vec2 xy = RayHelper::getViewplaneCoordinates(i, j, eps * sample, width, height, fov);
                    vec3 sampleColor = castRayInPoint(xy, matrix, position, &hitGlass);
                    if (!hitGlass) { // if we moved and missed the glass
                        continue;
                    }
                    sampleCount++;
                    color += sampleColor;
                }
            }

            framebuffer[i * width + j] = color / sampleCount;
        }
    }

    toFile(path, width, height, framebuffer);
}

int main(int argc, char** argv) {
    if (argc != 2) {
        cout << "Please set xml file path";
        return 0;
    }

    string fileContents = AssetLoader::getFileContent(argv[1]);

    string outFile;
    parseXml(fileContents, &outFile);

    render(outFile);

    return 0;
}
