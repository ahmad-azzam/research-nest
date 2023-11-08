import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Get()
  async getListEmail() {
    return this.emailService.getListEmail();
  }
}
