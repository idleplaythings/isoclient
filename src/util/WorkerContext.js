class WorkerContext {
  constructor(worker, index) {
    this.worker = worker;
    this.worker.addEventListener("message", this.ready.bind(this));
    this.resolve = null;
    this.reject = null;
    this.reserved = false;
    this.index = index;
  }

  work(data) {
    data.index = this.index;
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.worker.postMessage(data);
    });
  }

  ready(event) {
    this.resolve(event.data);
  }

  reserve() {
    this.reserved = true;
  }

  free() {
    this.reserved = false;
  }

  isFree() {
    return !this.reserved;
  }
}

export default WorkerContext;
