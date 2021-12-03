import { BadRequestException, ValidationError } from '@nestjs/common';

type ErrorCode = 'SYSTEM_ERROR' | 'VALIDATION_ERROR' | 'REQUEST_NOT_FOUND' | 'PDF_NOT_FOUND' | 'INVALID_TOKEN';

interface ErrorResponse {
  code: string;
  message: string;
  details: string | string[] | null;
}

const errorMap = new Map<ErrorCode, Omit<ErrorResponse, 'details'>>([
  ['SYSTEM_ERROR', { code: 'GENERAL-001', message: 'System error' }],
  ['VALIDATION_ERROR', { code: 'GENERAL-002', message: 'Validation error' }],
  ['REQUEST_NOT_FOUND', { code: 'REQUEST-001', message: 'Request not found' }],
  ['PDF_NOT_FOUND', { code: 'REQUEST-002', message: 'PDF not found' }],
  ['INVALID_TOKEN', { code: 'REUEST-003', message: 'Invalid Token' }],
]);

const findAllValidationErrorConstraints = (errors: ValidationError[]): string[] =>
  errors
    .map(({ constraints, children }) =>
      !children?.length ? Object.values(constraints) : findAllValidationErrorConstraints(children).flat(),
    )
    .flat();

export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super(getErrorResponse('VALIDATION_ERROR', findAllValidationErrorConstraints(errors)));
  }
}

export const getErrorResponse = (code: ErrorCode, details: ErrorResponse['details'] = null) => ({
  ...errorMap.get(code),
  details,
});
