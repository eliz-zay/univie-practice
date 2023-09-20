#include <iostream>
#include <iomanip>
#include <chrono>
#include <cmath>
#include <mpi.h>

#include "a2-helpers.hpp"

using namespace std;

int main(int argc, char **argv) {
    int max_iterations = 1000;
    double epsilon = 1.0e-3;
    bool verify = true, print_config = false;

    // default values for M rows and N columns
    int N = 12; //do not change N because we split by rows
    int M = 12;

    process_input(argc, argv, N, M, max_iterations, epsilon, verify, print_config);

    if (print_config)
        std::cout << "Configuration: m: " << M << ", n: " << N << ", max-iterations: " << max_iterations
                  << ", epsilon: " << epsilon << std::endl;

    auto time_1 = MPI_Wtime(); // change to MPI_Wtime() / omp_get_wtime()

    int p_rank, size;
    int rowsPerProc, rowsPerLastProc;

    // START: the main part of the code that needs to use MPI/OpenMP timing routines 
    //  MPI hint: remember to initialize MPI first
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &p_rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    rowsPerProc = M / size;
    rowsPerLastProc = rowsPerProc + M % size;
    int localM;
    if (p_rank == size - 1) localM = rowsPerLastProc;
    else localM = rowsPerProc;

    if (p_rank > 0) localM = localM + 1;
    if (p_rank < size - 1) localM = localM + 1;

    Mat U(localM, N); // for MPI: use local sizes with MPI, e.g., recalculate localM and N
    Mat W(localM, N); // for MPI: use local sizes with MPI, e.g., recalculate localM and N

    int i, j;
    double diffnorm;
    // Init & Boundary
    for (i = 0; i < localM; ++i) {
        for (j = 0; j < N; ++j) {
            W[i][j] = U[i][j] = 0.0;
        }

        W[i][0] = U[i][0] = 0.05; // left side
        W[i][N - 1] = U[i][N - 1] = 0.1; // right side
    }

    if (p_rank == 0) {
        for (j = 0; j < N; ++j) {
            W[0][j] = U[0][j] = 0.02; // top
        }
    }
    if (p_rank == size - 1) {
        for (j = 0; j < N; ++j) {
            W[localM - 1][j] = U[localM - 1][j] = 0.2; // bottom
        }
    }

    int iteration_count = 0;
    do {
        iteration_count++;
        diffnorm = 0.0;

        int numberOfRequests = 1;
        if ((p_rank > 0) && (p_rank < size - 1)) numberOfRequests = 2;
        vector<MPI_Request> req(numberOfRequests);
        vector<MPI_Status> status(numberOfRequests);

        if ((p_rank == 0) && (size > 1)) {
            MPI_Isend(&W[localM - 2][0], N, MPI_DOUBLE, p_rank + 1, 0, MPI_COMM_WORLD, &req[0]);
            MPI_Recv(&U[localM - 1][0], N, MPI_DOUBLE, p_rank + 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        } else if (p_rank == size - 1) {
            MPI_Isend(&W[1][0], N, MPI_DOUBLE, p_rank - 1, 0, MPI_COMM_WORLD, &req[0]);
            MPI_Recv(&U[0][0], N, MPI_DOUBLE, p_rank - 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        } else {
            MPI_Isend(&W[localM - 2][0], N, MPI_DOUBLE, p_rank + 1, 0, MPI_COMM_WORLD,
                      &req[0]);
            MPI_Isend(&W[1][0], N, MPI_DOUBLE, p_rank - 1, 0, MPI_COMM_WORLD, &req[1]);
            MPI_Recv(&U[localM - 1][0], N, MPI_DOUBLE, p_rank + 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
            MPI_Recv(&U[0][0], N, MPI_DOUBLE, p_rank - 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        }
        MPI_Waitall(numberOfRequests, &req[0], &status[0]);

        for (i = 1; i < localM - 1; ++i) {
            for (j = 1; j < N - 1; ++j) {
                W[i][j] = (U[i][j + 1] + U[i][j - 1] + U[i + 1][j] + U[i - 1][j]) * 0.25;
                diffnorm += (W[i][j] - U[i][j]) * (W[i][j] - U[i][j]);
            }
        }

        MPI_Allreduce(&diffnorm, &diffnorm, 1, MPI_DOUBLE, MPI_SUM, MPI_COMM_WORLD);
        diffnorm = sqrt(diffnorm); // all processes need to know when to stop

        // Only transfer the interior points
        for (i = 1; i < localM - 1; ++i)
            for (j = 1; j < N - 1; ++j)
                U[i][j] = W[i][j];
    } while (epsilon <= diffnorm && iteration_count < max_iterations);

    auto time_2 = MPI_Wtime(); // change to MPI_Wtime() / omp_get_wtime()
    double elapsedTime = time_2 - time_1;

    // that has the same size the whole size: like bigU(localM,N)
    Mat bigU(M, N);
    time_1 = MPI_Wtime();

    vector<double> bigUVec(M * N);
    vector<double> vectorToSend(rowsPerProc * N);
    if (p_rank == size - 1) vectorToSend.resize(rowsPerLastProc * N);

    int rowsToSend = rowsPerProc;
    if(p_rank == size - 1) rowsToSend = rowsPerLastProc;

    if(p_rank == 0){
        for (i = 0; i < rowsToSend; ++i)
            for (j = 0; j < N; ++j) {
                vectorToSend[i * N + j] = W[i][j];
            }
    }
    else{
        for (int i = 0; i < rowsToSend; i++) {
            for (j = 0; j < N; ++j) {
                vectorToSend[i * N + j] = W[i + 1][j];
            }
        }
    }

    vector<int> displs, recvcounts;
    if(p_rank == 0) {
        for (i = 0; i < size; i++) {
            displs.push_back(i * rowsPerProc * N);
            recvcounts.push_back(N * rowsPerProc);
        }
        recvcounts[size - 1] = N * rowsPerLastProc;
    }

    MPI_Gatherv(&vectorToSend[0], rowsToSend * N, MPI_DOUBLE,
                &bigUVec[0], &recvcounts[0], &displs[0], MPI_DOUBLE, 0, MPI_COMM_WORLD);

    if (p_rank == 0) { //make matrix from vec
        for (i = 0; i < M; ++i)
            for (j = 0; j < N; ++j) {
                bigU[i][j] = bigUVec[i * N + j];
            }
    }
    time_2 = MPI_Wtime(); // change to MPI_Wtime() / omp_get_wtime()
    double gather_time = time_2 - time_1;

    if (p_rank == 0) {
        // Print time measurements
        cout << "Elapsed time: ";
        cout << std::fixed << std::setprecision(4) << elapsedTime + gather_time << " seconds. " << endl; // modify accordingly for MPI/OpenMP
        cout << "Gather time: ";
        cout << std::fixed << std::setprecision(4) << gather_time << " seconds. " << endl;
        cout << "Iterations: " << iteration_count << endl;

        // verification
        if (verify) {
            Mat U_sequential(M, N); // init another matrix for the verification

            int iteration_count_seq = 0;
            heat2d_sequential(U_sequential, max_iterations, epsilon, iteration_count_seq);

            // Here we need both results - from the sequential (U_sequential) and also from the OpenMP/MPI version, then we compare them with the compare(...) function
            cout << "Verification: "
                 << (bigU.compare(U_sequential) && iteration_count == iteration_count_seq ? "OK" : "NOT OK")
                 << std::endl;
        }
    }
    MPI_Finalize();
    // MPI: do not forget to call MPI_Finalize()

    // U.save_to_disk("heat2d.txt"); // not needed

    return 0;
}
