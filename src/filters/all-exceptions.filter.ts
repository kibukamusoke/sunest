import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get the error message and stack trace
    let message = 'Internal server error';
    let stack = '';
    
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || exception.message;
      stack = exception.stack || '';
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack || '';
    }

    // Log the full error with stack trace
    this.logger.error(`${request.method} ${request.url} - Status: ${status} - Message: ${message}`);
    this.logger.error(stack);

    // Include stack trace in the response during development
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      stack: process.env.NODE_ENV !== 'production' ? stack : undefined,
      details: exception instanceof HttpException 
        ? (exception.getResponse() as any).message 
        : undefined
    };

    response
      .status(status)
      .json(responseBody);
  }
}