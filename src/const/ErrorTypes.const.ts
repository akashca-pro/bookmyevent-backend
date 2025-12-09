export const APP_ERRORS = {
    TOKEN_NOT_FOUND : 'Token not found',
    INVALID_TOKEN_PAYLOAD : 'Invalid token payload',
    ENTRY_RESTRICTED : 'Entry restricted',
    TOKEN_BLACKLISTED : 'Token blacklisted',
    ACCOUNT_BLOCKED : 'Account is blocked',
    TOKEN_VERIFICATION_FAILED : 'Token verification failed',
    VALIDATION_ERROR : 'Validation error',
    INVALID_FILE_FIELD : 'Invalid file field',
    INVALID_FILE_TYPE : 'Invalid file type',
    INVALID_USER_ROLE: 'Invalid user role',
    LARGE_FILE : 'File too large'
} as const

export const SERVICE_ERRORS = {
    USER_NOT_FOUND : 'user not found',
    USER_ALREADY_EXISTS : 'user already exists',
    INVALID_CREDENTIALS : 'invalid credentials',
    INTERNAL_SERVER_ERROR : 'internal server error',
    UNAUTHORIZED : 'unauthorized',
    ACCESS_TOKEN_ISSUE_ERROR : 'Error issuing access token',
} as const