#pragma once

#include <string>
#include <vector>
#include <sstream>
#include <fstream>
#include <iostream>

using namespace std;

namespace AssetLoader {
    vector<string> getFileLines(string fileName) {
        ifstream file(fileName);
        string line;
        vector<string> lines = {};

        if (!file.is_open()) {
            cout << "Unable to open file: " << fileName << endl;
        }

        while (getline(file, line)) {
            lines.push_back(line);
        }

        file.close();

        return lines;
    }

    string getFileContent(string path) {
        ifstream file;
        file.open(path);

        stringstream fileStream;
        fileStream << file.rdbuf();
        string fileString = fileStream.str();

        file.close();

        if (fileString.size() == 0) {
            cout << endl <<  "Invalid file" << endl;
            exit(0);
        }

        return fileString;
    }
}
