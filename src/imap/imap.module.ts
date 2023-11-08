import { Module } from '@nestjs/common';
import { ImapService } from './imap.service';
import { ImapController } from './imap.controller';

@Module({
  providers: [ImapService],
  controllers: [ImapController]
})
export class ImapModule {}
