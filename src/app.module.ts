import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { ExcelModule } from './excel/excel.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { GDriveModule } from './g-drive/g-drive.module';
import { EmailModule } from './email/email.module';
import { Pop3Module } from './pop3/pop3.module';
import { ImapModule } from './imap/imap.module';
import { WorkerModule } from './worker/worker.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UploadModule, ExcelModule, PrismaModule, UserModule, GDriveModule, EmailModule, Pop3Module, ImapModule, WorkerModule, StripeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
