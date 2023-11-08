import { Controller, Get } from '@nestjs/common';
import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  @Get()
  async getWorker() {
    return this.workerService.getWorker();
  }
}
