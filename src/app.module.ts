import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), DocumentsModule],
})
export class AppModule {}
