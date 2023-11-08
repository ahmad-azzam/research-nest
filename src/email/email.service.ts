import { Injectable } from '@nestjs/common';
import Pop3Command from 'node-pop3';

@Injectable()
export class EmailService {
  private pop3: Pop3Command;

  constructor() {
    this.pop3 = new Pop3Command({
      host: 'pop.imitate.email',
      port: 995,
      user: '035f4aaf-aa12-4a04-921b-018b27c78744',
      password: 'a0ba757a-abb6-4fbb-8469-f0a76afd917f',
      tls: true,
    });
  }

  async getListEmail() {
    const response = await this.pop3.command(1);

    return { response };
  }
}
