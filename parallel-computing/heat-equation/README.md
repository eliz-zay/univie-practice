# Heat equation in 2D

## Run

mpic++ -std=c++0x -O2 -lm -o a2-mpi a2-mpi.cpp
mpirun -np 4 ./a2-mpi --m 1152 --n 1152 --epsilon 0.01 --max-iterations 1000

g++ a2-omp.cpp -O2 -fopenmp -lm -o a2-omp
