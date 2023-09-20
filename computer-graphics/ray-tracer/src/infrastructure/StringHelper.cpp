#pragma once

#include <vector>
#include <string>
#include <iostream>
#include <sstream>

using namespace std;

namespace StringHelper {
    constexpr unsigned int hashstr(const char* s, int off = 0) {              
        return !s[off] ? 5381 : (hashstr(s, off+1)*33) ^ s[off];                           
    }

    vector<string> splitString(string target, char delimiter) {
        vector<string> tokens = {};

        istringstream ss(target);
        string token;

        while (getline(ss, token, delimiter)) {
            tokens.push_back(token);
        }

        return tokens;
    }
}
