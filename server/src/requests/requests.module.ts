import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request, RequestHighlight } from './entites';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Request, RequestHighlight])],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
