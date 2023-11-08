import { Global, Module } from '@nestjs/common';
import { GDriveService } from './g-drive.service';
import { GDriveController } from './g-drive.controller';

@Global()
@Module({
  providers: [GDriveService],
  exports: [GDriveService],
  controllers: [GDriveController],
})
export class GDriveModule {}
