import { Client } from 'minio';

export const MinioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: +(process.env.MINIO_PORT || 9000),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});
