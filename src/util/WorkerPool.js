import WorkerContext from "./WorkerContext";

class WorkerPool {
  constructor(workers) {
    this.workers = []
      .concat(workers)
      .map((worker, i) => new WorkerContext(worker, i));
    this.workerPromises = [];
    this.debug = false;
  }

  async work(input) {
    if (this.debug) {
        console.log("workerpool work", this.workerPromises);
    }
    const worker = await this.getWorker();
    if (this.debug) {
        console.log("workerpool got worker, now working");
    }
    const data = await worker.work(input);

    if (this.debug) {
        console.log("workerpool work done");
    }

    worker.free();

    if (this.workerPromises.length > 0) {
      //console.log("Resolving worker promise with freeing worker");
      worker.reserve();
      this.workerPromises.shift()(worker);
    }

    return data;
  }

  async getWorker() {
    return new Promise((resolve, reject) => {
      const worker = this.getFreeWorker();
      if (worker) {
        worker.reserve();
        resolve(worker);
      } else {
        this.workerPromises.push(resolve);
      }
    });
  }

  getFreeWorker() {
    return this.workers.find(worker => worker.isFree());
  }
}

export default WorkerPool;
