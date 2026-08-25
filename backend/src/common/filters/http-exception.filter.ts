import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let message: string | string[] = 'Internal server error';
      let error = 'Internal Server Error';
  
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();
  
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
          const body = exceptionResponse as {
            message?: string | string[];
            error?: string;
          };
          message = body.message ?? exception.message;
          error = body.error ?? exception.name;
        } else {
          message = exception.message;
        }
      } else if (exception instanceof Error) {
        message = exception.message;
      }
  
      response.status(statusCode).json({
        statusCode,
        message,
        error,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }
  }