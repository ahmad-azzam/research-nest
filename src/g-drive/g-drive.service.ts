import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { drive_v3, google } from 'googleapis';
import stream from 'stream';

@Injectable()
export class GDriveService {
  private SCOPE = ['https://www.googleapis.com/auth/drive'];
  private drive: drive_v3.Drive;
  private bufferStream: stream.PassThrough;

  constructor() {
    this.initiateDrive();

    this.bufferStream = new stream.PassThrough();
  }

  async initiateDrive() {
    const auth = await this.authorize();
    this.drive = google.drive({ version: 'v3', auth });
  }

  private async authorize() {
    const jwtClient = new google.auth.JWT(
      'test-upload-research@my-poject-322006.iam.gserviceaccount.com',
      null,
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9d9WeuKG5z8Cn\n94s7xEM42F8QLjUDAb91J6vdHmfRd2McaRXCHzVQhJ/r/WafqWRezU/bB9QgD6Lz\n1YGJ+xI4hpCXGOiHUkvLKNYmcOR/m7IVxfcdKdGhXw0ijOaHFe6GzjrJ+nfd8Sg0\nCTa/crvgsqvCWTE4CHhCPClCD6yzHM/fqAy5xZruDGKUoT3YbS66l52SJJjbcq5A\nqgmq4owrcyCtgglec1aB6FP4FhTtOeLLVaedpQUG1QD/RvxqoJl4kmI/pXVR5fHP\nNS/dKbleVlBtWid8PzAQGt86sK3kjp+OZo9h23Kn0GQh8PAE9y/D1y7Xm9OFT2hY\ncCKfyvYHAgMBAAECggEAGkRpV3UVvXrUelTtjC5++qa2CI+8u2XReHlfWytSeFil\nYx8cgZ+trAk0WgAfwKXi1j5/l4hOe9gUdC/sTXKt9CvlEtWaCIdmc6F94wbGtFGj\nubS1jZOqePACaauqxXKgcYxY29SqK+5kRPvmslnCkKR5/y/kt3XRJQRN3KyV+Z9u\nb7iNRTkdvU23+dWiiygr+m8md/PVeQZa341Qgt7BAfvxIvSBkArKqsa8NXIjPm2w\ngGBdVyT+w117rvWZfb+xd6JejYaZQtuzvplUtRpbO8mF0ms9J7amqu8rq9erApIm\nHKf8H1Tn4eS8B0qJksH6fBrpC7rE7A1HO3L9Ylmt1QKBgQDyxceROqQCHecGLdCq\n+X8CzL1hbg14pMjXtJW4Rl5aL4lb81f4P8rY++0f6syxO3kVgHA7Sp0i9hZDxjXh\n7U3esQKr0BwsatOA66+uIP+iy6boA8IK06oJ1hZ0fXwac1pCURTtV1grT+ww7/WA\nsJ8eOHp1zDAMuO+i6IwDFXKTOwKBgQDHyo7OT7lcovxyVIom43S099se2XLxeVY1\n7x3Q6l37plqxgnKOzj55JkaXtYTW7mTVZ8LkclV+56TSIFDbboyXfooHq1XB4r+D\nH8JUXVPqOs/byMsnpzGBJun5yqZUibCBi3Tz6l92F69dAKsHpNOX74GjX5/rveQN\nkLM/aWMjpQKBgQCfCRk29idCi7wvvAuaNV8SwnS9Qo7onWpEhDQgR1i/06wz5DGY\nmpGTm1U3N2VoJQGpKD5dWP+fS35CX7IkkoQUgfix/N636jMrnTm05EESsD5idzPC\nS+50Cx8iqKGH4lEaaGtBH5rOpMihNlCpQQq7jVwLlvtTGkNBgP1Xd9FayQKBgCAu\nJCpe9QBS0E6qB0aURGwRsB2b8MOsQ5KUXT0VQuYRuXH2DPWriqyA2cX92tOzulIV\nUHLzZ4n1Tbr6sYtmlwafvyPVGQ8NssMwDmEAV0/XATvpb6+HYpXm6rDtTzU2qFN1\nXvUavx2KWxijzuiASASk80CZWmziPSViNTz1gJ5xAoGBAOj2mtMxujnd0xlLoKM2\nMV2qISJ86u6NdPxHLwziE5nps5Kn/BJBh8WsuXuKYuGY2pnVNzwGVlpzGEk+1EcS\n+qHdbdaa+uwinLuU3/ps7PyEN5ilSVh8U55kDHA+I5HJsBCBVbu/qm215TPkqwgU\n2LhWRNgWfzSGfWGQdGdmBf7+\n-----END PRIVATE KEY-----\n',
      this.SCOPE,
    );
    await jwtClient.authorize();

    return jwtClient;
  }

  async sendFile(file: Express.Multer.File) {
    this.bufferStream.end(file.buffer);

    return await this.drive.files.create({
      fields: 'id',
      media: {
        body: this.bufferStream,
      },
      requestBody: {
        name: file.originalname,
        parents: ['1Stj9yCMqFhBJW4Z2CkovKu0Ff07Axl3m'],
        mimeType: file.mimetype,
      },
    });
  }

  async getFiles(folderId?: string) {
    return await this.drive.files.list({
      q: `'${
        folderId ? folderId : '1Stj9yCMqFhBJW4Z2CkovKu0Ff07Axl3m'
      }' in parents`,
    });
  }

  async getFile(fileId: string) {
    const res = await this.drive.files.get(
      {
        fileId,
        alt: 'media',
        fields: '*',
      },
      { responseType: 'stream' },
    );

    const result = new Promise((resolve) => {
      const chunks = [];

      res.data.on('data', (data) => {
        chunks.push(data);
      });

      res.data.on('end', () => {
        resolve({ result: Buffer.concat(chunks).toString('base64') });
      });
    });

    return await result;
  }

  async createFolder(name: string) {
    return await this.drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name,
        parents: ['1Stj9yCMqFhBJW4Z2CkovKu0Ff07Axl3m'],
        mimeType: 'application/vnd.google-apps.folder',
      },
    });
  }

  async renameFile(fileId: string, name: string) {
    return this.drive.files.update({
      fileId,
      requestBody: {
        name,
      },
    });
  }

  async deleteFile(fileId: string) {
    return await this.drive.files.delete({
      fileId,
    });
  }

  async updateFile(
    fileId: string,
    file: Express.Multer.File,
    folderId: string,
  ) {
    this.bufferStream.end(file.buffer);

    return await this.drive.files.update({
      fileId,
      media: {
        body: this.bufferStream,
      },
      requestBody: {
        mimeType: file.mimetype,
      },
    });
  }
}
