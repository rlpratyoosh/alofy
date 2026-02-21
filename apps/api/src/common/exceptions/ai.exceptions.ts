import { HttpException, HttpStatus } from '@nestjs/common';

export class AiRateLimitException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'API rate limit exceeded. Please try again later.',
        error: 'AI_RATE_LIMIT',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

export class AiAuthenticationException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid API key. Please update your API key in your profile.',
        error: 'AI_INVALID_KEY',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AiQuotaExceededException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.PAYMENT_REQUIRED,
        message:
          'API quota exceeded. Your API key has reached its usage limit.',
        error: 'AI_QUOTA_EXCEEDED',
      },
      HttpStatus.PAYMENT_REQUIRED,
    );
  }
}

export class AiServiceException extends HttpException {
  constructor(message?: string) {
    super(
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: message || 'AI service is temporarily unavailable.',
        error: 'AI_SERVICE_ERROR',
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export class ApiKeyRequiredException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.PRECONDITION_REQUIRED,
        message:
          'API key is required. Please add your API key in your profile.',
        error: 'API_KEY_REQUIRED',
      },
      HttpStatus.PRECONDITION_REQUIRED,
    );
  }
}
