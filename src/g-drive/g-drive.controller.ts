import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GDriveService } from './g-drive.service';
import { RenameFileDto, UpdateFileDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('g-drive')
export class GDriveController {
  constructor(private gDriveService: GDriveService) {}

  @Post()
  async sendFile() {
    // return await this.gDriveService.sendFile();
  }

  @Post('folder')
  async createFolder() {
    return await this.gDriveService.createFolder('folder-1');
  }

  @Get()
  async getFiles(@Query('folderId') folderId: string) {
    return await this.gDriveService.getFiles(folderId);
  }

  @Get('file')
  async getFile(@Query('fileId') fileId: string) {
    return await this.gDriveService.getFile(fileId);
  }

  @Put('file/rename')
  async renameFile(
    @Query('fileId') fileId: string,
    @Body() dto: RenameFileDto,
  ) {
    return await this.gDriveService.renameFile(fileId, dto.name);
  }

  @Delete('file')
  async deleteFile(@Query('fileId') fileId: string) {
    return await this.gDriveService.deleteFile(fileId);
  }

  @Put('file')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Query() { fileId, folderId }: UpdateFileDto,
  ) {
    return await this.gDriveService.updateFile(fileId, file, folderId);
  }
}
