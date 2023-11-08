import { Injectable } from '@nestjs/common';
import readXlsxFile from 'read-excel-file/node';

@Injectable()
export class ExcelService {
  async readExcel(buffer: Buffer) {
    return await readXlsxFile(buffer);
  }
}
