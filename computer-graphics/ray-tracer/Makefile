.PHONY: all mac linux init_mac init_linux run clean
all: init_mac run clean
mac: init_mac run clean
linux: init_linux run clean
init_mac:
	clang++ -Xpreprocessor -std=c++14 src/main.cpp src/lib/lodepng/lodepng.cpp -o ./a
init_linux:
	g++ src/main.cpp src/lib/lodepng/lodepng.cpp -o ./a
run:
	./a $(path)
clean:
	rm -f ./a
