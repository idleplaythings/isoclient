class WorkerContext {
  constructor(worker, index) {
    this.worker = worker;
    this.worker.addEventListener("message", this.ready.bind(this));
    this.resolve = null;
    this.reject = null;
    this.reserved = false;
    this.index = index;
    console.log("worker with index", this.index, "created");
  }

  work(data) {
    /*
    console.log(
      "Worker index",
      this.index,
      "working on position",
      data.position
    );
    */
    data.index = this.index;
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.worker.postMessage(data);
    });
  }

  ready(event) {
    /*
    console.log("worker message", event);
    console.log(
      "Worker index",
      this.index,
      "getting result for position",
      event.data.position,
      "index",
      event.data.index
    );
    */
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
