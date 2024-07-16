import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class FileRejectedErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(FileRejectedErrorFilter.name);

  async catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.debug('REQUEST BODY: ', exception);

    this.logger.debug('REQUEST BODY: ', request.body);

    this.logger.debug('REQUEST FILES: ', request.files);

    const status = HttpStatus.BAD_REQUEST;
    const message = exception.message;

    response.statusCode = status;
    response.json({
      statusCode: status,
      path: request.url,
      message: message,
    });
  }
}
