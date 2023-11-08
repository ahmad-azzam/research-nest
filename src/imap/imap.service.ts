import { Injectable } from '@nestjs/common';
import Imap from 'node-imap';
import iconv from 'iconv-lite';
import { MailParser } from 'mailparser';

@Injectable()
export class ImapService {
  private imap: Imap;
  private response: any;

  constructor() {
    this.imap = new Imap({
      host: 'imap.imitate.email',
      port: 993,
      user: '035f4aaf-aa12-4a04-921b-018b27c78744',
      password: 'a0ba757a-abb6-4fbb-8469-f0a76afd917f',
      tls: true,
    });
  }

  async getEmail() {
    const response = new Promise((resolve, reject) => {
      const arr = [];
      this.imap.once('ready', () => {
        this.imap.openBox('INBOX', false, (error) => {
          if (error) throw error;

          this.imap.search(['ALL'], (error, result) => {
            if (error) reject(error);

            const fetchEmail = this.imap.fetch(result, {
              bodies: '',

              struct: true,
            });

            fetchEmail.on('message', async (message) => {
              const mailparser = new MailParser();
              const obj: { data: any; headers: any } = {
                data: null,
                headers: null,
              };

              mailparser.on('data', (data) => {
                const text = iconv.decode(
                  Buffer.from(data.html, 'binary'),
                  'utf8',
                );
                obj.data = data;
              });

              mailparser.on('headers', (headers) => {
                obj.headers = headers.get('from');
              });

              message.on('body', (stream) => {
                stream.on('data', (chunk) => {
                  mailparser.write(chunk);
                });

                stream.on('end', () => {
                  arr.push(obj);
                  mailparser.end();
                });
              });
            });

            fetchEmail.once('end', () => {
              console.log('All messages fetched.');
              this.imap.end();
            });
          });
        });
      });

      this.imap.once('error', (error) => {
        reject(error);
      });

      this.imap.once('end', () => {
        resolve({ result: arr });
        console.log('connection closed');
      });

      this.imap.connect();
    });

    return await response;
  }
}
