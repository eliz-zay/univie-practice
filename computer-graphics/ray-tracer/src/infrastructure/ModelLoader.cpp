#pragma once

#include <vector>
#include <string>
#include <iostream>
#include <fstream>

#include "../lib/vec/vec2.cpp"
#include "../lib/vec/vec3.cpp"

#include "AssetLoader.cpp"
#include "StringHelper.cpp"

using namespace std;
using namespace StringHelper;

struct Model {
    vector<vec3> vertices;
    vector<vec3> normals;
    vector<vec2> textureVertices;
};

namespace ModelLoader {
    vector<Model*> loadModels(string fileName) {
        vector<string> fileLines = AssetLoader::getFileLines(fileName);

        vector<Model*> models = {};

        vector<vec3> vertices = {};
        vector<vec3> normals = {};
        vector<vec2> textureVertices = {};

        for (auto line : fileLines) {
            vector<string> tokens = splitString(line, ' ');

            if (!tokens[0].compare("#") || !tokens[0].compare("o")) {
                continue;
            }

            switch (hashstr(tokens[0].c_str())) {
                case (hashstr("v")): {
                    vertices.push_back(vec3(stof(tokens[1]), stof(tokens[2]), stof(tokens[3])));
                    break;
                }
                case (hashstr("vn")): {
                    normals.push_back(vec3(stof(tokens[1]), stof(tokens[2]), stof(tokens[3])));
                    break;
                }
                case (hashstr("vt")): {
                    textureVertices.push_back(vec2(stof(tokens[1]), stof(tokens[2])));
                    break;
                }
                case (hashstr("f")): {
                    vector<string> v1 = splitString(tokens[1], '/');
                    vector<string> v2 = splitString(tokens[2], '/');
                    vector<string> v3 = splitString(tokens[3], '/');

                    string indexV1 = v1[0], textureIndexV1 = v1[1], normalIndexV1 = v1[2];
                    string indexV2 = v2[0], textureIndexV2 = v2[1], normalIndexV2 = v2[2];
                    string indexV3 = v3[0], textureIndexV3 = v3[1], normalIndexV3 = v3[2];

                    models.push_back(new Model());
                    Model* model = models.back();

                    model->vertices.push_back(vertices[stoi(indexV1) - 1]);
                    model->vertices.push_back(vertices[stoi(indexV2) - 1]);
                    model->vertices.push_back(vertices[stoi(indexV3) - 1]);

                    model->normals.push_back(normals[stoi(normalIndexV1) - 1]);
                    model->normals.push_back(normals[stoi(normalIndexV2) - 1]);
                    model->normals.push_back(normals[stoi(normalIndexV3) - 1]);

                    model->textureVertices.push_back(textureVertices[stoi(textureIndexV1) - 1]);
                    model->textureVertices.push_back(textureVertices[stoi(textureIndexV2) - 1]);
                    model->textureVertices.push_back(textureVertices[stoi(textureIndexV3) - 1]);
                    break;
                }
                default: {
                    break;
                }
            }
        }

        return models;
    }
};