import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';

@Injectable()
export class WorkerService {
  private threadCount: number = 4;

  createWorker() {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./src/worker.ts', {
        workerData: { thread_count: this.threadCount },
      });

      worker.on('message', (data) => {
        resolve(data);
      });
      worker.on('error', (error) => {
        reject(new Error(`An error occurred: ${error}`));
      });
    });
  }

  async getWorker() {
    const workerPromises = [];

    for (let index = 0; index < this.threadCount; index++) {
      workerPromises.push(this.createWorker());
    }

    const threadResult = await Promise.all(workerPromises);

    return `total count ${
      threadResult[0] + threadResult[1] + threadResult[2] + threadResult[3]
    }`;
  }
}
