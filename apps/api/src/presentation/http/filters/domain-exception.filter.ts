import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  DomainConflictException,
  DomainException,
  DomainNotFoundException,
  DomainValidationException,
} from '@rdc/domain';

@Catch(
  DomainException,
  DomainValidationException,
  DomainNotFoundException,
  DomainConflictException,
)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = this.mapStatus(exception);

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
      code: exception.code,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private mapStatus(exception: DomainException): number {
    if (exception instanceof DomainValidationException) {
      return HttpStatus.BAD_REQUEST;
    }
    if (exception instanceof DomainNotFoundException) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof DomainConflictException) {
      return HttpStatus.CONFLICT;
    }
    return HttpStatus.BAD_REQUEST;
  }
}
