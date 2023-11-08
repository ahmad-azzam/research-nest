import { Module } from '@nestjs/common';
import { Pop3Service } from './pop3.service';

@Module({
  providers: [Pop3Service]
})
export class Pop3Module {}
