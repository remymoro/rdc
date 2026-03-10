import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(BadRequestException)
export class RequestValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const payload = exception.getResponse();

    const message = this.extractMessage(payload, exception.message);

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'RequestValidationException',
      message,
      code: 'REQUEST_VALIDATION',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private extractMessage(
    payload: string | { message?: unknown } | object,
    fallback: string,
  ): unknown {
    if (typeof payload === 'string') {
      return payload;
    }

    if (payload && typeof payload === 'object' && 'message' in payload) {
      return (payload as { message?: unknown }).message ?? fallback;
    }

    return fallback;
  }
}
