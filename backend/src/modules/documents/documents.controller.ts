import { Controller, Post, Body, Param } from '@nestjs/common';
import { MinioClient } from '../../common/minio.client';
import { v4 as uuidv4 } from 'uuid';

@Controller('mobile/practices/:id/requests')
export class DocumentsController {
  @Post(':reqId/upload-url')
  async generateUploadUrl(
    @Param('id') practiceId: string,
    @Param('reqId') reqId: string,
    @Body() body: { filename: string; mime: string; size: number },
  ) {
    const bucket = 'practices';
    const objectName = `${practiceId}/${reqId}/${uuidv4()}_${body.filename}`;

    try {
      const exists = await MinioClient.bucketExists(bucket);
      if (!exists) await MinioClient.makeBucket(bucket);
    } catch (err) {
      // ignore
    }

    const expiry = 60 * 5;
    const url = await MinioClient.presignedPutObject(bucket, objectName, expiry);
    return { url, objectName, bucket, expiresIn: expiry };
  }
}
