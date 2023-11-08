import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }

  @Post('/g-drive')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToGDrive(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.uploadService.uploadFileToGDrive(file);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
