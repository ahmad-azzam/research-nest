import { Injectable } from '@nestjs/common';
import { Row } from 'read-excel-file';
import { ExcelService } from 'src/excel/excel.service';
import { GDriveService } from 'src/g-drive/g-drive.service';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { Worker } from 'worker_threads';

@Injectable()
export class UploadService {
  private threadCount: number = 4;

  constructor(
    private excelService: ExcelService,
    private userService: UserService,
    private gDriveService: GDriveService,
  ) {}

  private createWorker(
    response: Row[],
    startIndex: number,
    finishIndex: number,
  ) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./src/worker.ts', {
        workerData: {
          thread_count: this.threadCount,
          response,
          startIndex,
          finishIndex,
        },
      });

      worker.on('message', async (data) => {
        resolve(this.userService.createBatchUser(data));
      });
      worker.on('error', (error) => {
        reject(new Error(`An error occurred: ${error}`));
      });
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const response = await this.excelService.readExcel(file.buffer);
    response.shift();

    const testData = [];

    for (let index = 0; index < response.length; index++) {
      const dataResponse = response[index];

      testData.push({
        country: dataResponse[8].toString(),
        full_name: `${dataResponse[1]} ${dataResponse[2]} ${dataResponse[3]}`,
        gender: dataResponse[0].toString(),
      });
    }

    return await this.userService.createBatchUser(testData);

    // const workerPromises = [];

    // for (let index = 0; index < this.threadCount; index++) {
    //   const startIndex =
    //     index * Math.ceil((response.length - 1) / this.threadCount);
    //   const finishIndex =
    //     (index + 1) * Math.floor(response.length / this.threadCount);

    //   workerPromises.push(this.createWorker(response, startIndex, finishIndex));
    // }

    // return await Promise.all(workerPromises);
  }

  async uploadFileToGDrive(file: Express.Multer.File) {
    return await this.gDriveService.sendFile(file);
  }
}
