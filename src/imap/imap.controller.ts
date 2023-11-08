import { Controller, Get } from '@nestjs/common';
import { ImapService } from './imap.service';

@Controller('imap')
export class ImapController {
  constructor(private imapService: ImapService) {}

  @Get()
  async getEmail() {
    return await this.imapService.getEmail();
  }
}
