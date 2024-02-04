import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (typeof message === 'object' && message !== null) {
      const validationResponse: any = message;
      message = validationResponse.message; // Could be an array or an object with message field
      if (Array.isArray(validationResponse.message)) {
        message = validationResponse.message.join(', ');
      } else if (typeof validationResponse.message === 'object') {
        message = Object.values(validationResponse.message).join(', ');
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
