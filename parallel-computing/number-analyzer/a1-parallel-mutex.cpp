#include <iostream>
#include <thread>
#include <random>
#include <chrono>
#include <complex>
#include <sstream>
#include <string>
#include <fstream>
#include <list>
#include <iomanip>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <atomic>
#include <future>

#include "a1-helpers.hpp"

const int batch_size = 2000;

template <typename T>
class SafeQ {
private:
    std::queue<T> q;
    std::mutex mutex;
    std::condition_variable cv;
    bool done = false;
public:
    void push_batch(std::list<T> values) {
        {
            std::lock_guard<std::mutex> guard(this->mutex);

            for (auto v: values) {
                q.push(v);
            }
        }
        this->cv.notify_one();
    }

    void set_done_true() {
        {
            std::lock_guard<std::mutex> guard(this->mutex);
            done = true;
        }
        this->cv.notify_all();
    }

    std::list<std::shared_ptr<T>> wait_and_pop() {
        std::unique_lock<std::mutex> lock(this->mutex);
        this->cv.wait(lock, [this]{ return done || !q.empty(); });

        if (q.empty() && done) {
            return {};
        }

        if (!q.empty()) {
            std::list<std::shared_ptr<T>> pointers;

            int i = 0;
            while (i < batch_size && !q.empty()) {
                i++;
                std::shared_ptr<T> ptr(std::make_shared<T>(q.front()));
                q.pop();
                pointers.push_back(ptr);
            }

            return pointers;
        }

        throw "wait_and_pop error";
    }

    size_t size() {
        std::lock_guard<std::mutex> guard(this->mutex);
        return q.size();
    }

    bool empty() {
        std::lock_guard<std::mutex> guard(this->mutex);
        return q.empty();
    }
};

int producer(std::string filename, SafeQ<int> &q) {
    int produced_count = 0;

    std::ifstream ifs(filename);
    std::list<int> batch;

    while (!ifs.eof()) {
        int num;
        ifs >> num;

        batch.push_back(num);
        if (batch.size() == batch_size) {
            q.push_batch(batch);
            batch = {};
        }

        produced_count++;
    }

    if (batch.size() > 0) {
        q.push_batch(batch);
    }

    q.set_done_true();

    ifs.close();

    return produced_count;
}

void worker(
    SafeQ<int> &q,
    int &primes,
    int &nonprimes,
    double &sum,
    int &consumed_count,
    std::vector<int> &number_counts,
    std::mutex &counts_mutex
) {
    int worker_primes = 0, worker_nonprimes = 0, worker_consumed_count = 0;
    double worker_sum = 0.0;
    std::vector<int> worker_number_counts(10, 0);

    while (true) {
        std::list<std::shared_ptr<int>> nums = q.wait_and_pop();

        if (nums.empty()) {
            break;
        }

        worker_consumed_count += nums.size();
        for (auto num : nums) {
            if (kernel(*num) == 1) {
                worker_primes++;
            } else {
                worker_nonprimes++;
            }

            worker_number_counts[*num%10]++;
            worker_sum += *num;
        }
    }

    {
        std::lock_guard<std::mutex> guard(counts_mutex);

        sum += worker_sum;
        consumed_count += worker_consumed_count;
        nonprimes += worker_nonprimes;
        primes += worker_primes;

        for(int i = 0; i < 10; i++) {
            number_counts[i] += worker_number_counts[i];
        }
    }
}

int main(int argc, char **argv) {
    int num_threads = std::thread::hardware_concurrency() / 2;
    bool no_exec_times = false, only_exec_times = false;
    std::string filename = "input.txt";
    parse_args(argc, argv, num_threads, filename, no_exec_times, only_exec_times);

    int primes = 0, nonprimes = 0;
    int consumed_count = 0;
    double mean = 0.0, sum = 0.0;
    std::vector number_counts(10, 0); // vector for storing numbers ending with different digits (0-9)

    SafeQ<int> q;
    std::vector<std::thread> workers;
    std::mutex counts_mutex;
    
    auto t1 =  std::chrono::high_resolution_clock::now();
    
    std::future<int> produced_count_future = std::async(std::launch::async, producer, filename, std::ref(q));
   
    for (int i = 0; i < num_threads; ++i) {
        workers.push_back(std::thread(
            worker,
            std::ref(q),
            std::ref(primes),
            std::ref(nonprimes),
            std::ref(sum),
            std::ref(consumed_count),
            std::ref(number_counts),
            std::ref(counts_mutex)
        ));
    }

    for (std::thread& worker : workers) {
        worker.join();
    }
    produced_count_future.wait();

    mean = sum / consumed_count;

    int produced_count = produced_count_future.get();

    auto t2 =  std::chrono::high_resolution_clock::now();

    // do not remove
    if ( produced_count != consumed_count ) {
         std::cout << "[error]: produced_count (" << produced_count << ") != consumed_count (" << consumed_count << ")." <<  std::endl;
    }

    print_output(num_threads, primes, nonprimes, mean, number_counts, t1, t2, only_exec_times, no_exec_times);

    return 0;
}
