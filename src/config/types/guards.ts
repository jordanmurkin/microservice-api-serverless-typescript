import { assertBy, objectOf, enumOf, primitives, Assertion, ValidationRejection } from '@altostra/type-validations';
import { UserRole } from '@config/types';

// Validation error factory

class ValidationError extends Error {
  errors: ValidationRejection[];

  constructor(message: string, errors: ValidationRejection[]) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

const validationErrorFactory = (value: unknown, rejections: ValidationRejection[]) => {
  // We return the error to be thrown
  return new ValidationError('Invalid request', rejections);
};

// User Guards

type UserRoles = keyof typeof UserRole;

const isUserRole = enumOf<UserRoles>(
  'ADMIN',
  'MANAGER',
  'ADVISOR',
);

const isUser = objectOf({
  firstName: primitives.string,
  lastName: primitives.string,
  email: primitives.string,
  password: primitives.string,
  role: isUserRole,
});

export const validateUser: Assertion<UserAttributes> = assertBy(
  isUser,
  validationErrorFactory,
);
