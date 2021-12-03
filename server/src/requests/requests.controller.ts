import { Body, Controller, Get, Param, Patch, Post, Query, StreamableFile } from '@nestjs/common';
import { CreateRequestDto, UpdateRequestDto } from './dto';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post('')
  createRequest(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.createRequest(createRequestDto);
  }

  @Get('/:id')
  getRequest(@Param('id') id: string, @Query('token') token: string, @Query('email') email: string) {
    return this.requestsService.getRequest(id, { token, email });
  }

  @Get('/pdf/:filename')
  async getRequestPdf(@Param('filename') filename: string) {
    const file = await this.requestsService.getRequestPdf(filename);

    return new StreamableFile(file);
  }

  @Patch('/:id')
  updateRequest(@Param('id') id: string, @Body() { highlights }: UpdateRequestDto) {
    return this.requestsService.updateRequest(id, highlights);
  }
}
