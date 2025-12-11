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

export const AUTH_SERVICE_ERRORS = {
    USER_NOT_FOUND : 'user not found',
    USER_ALREADY_EXISTS : 'user already exists',
    INVALID_CREDENTIALS : 'invalid credentials',
    INTERNAL_SERVER_ERROR : 'internal server error',
    UNAUTHORIZED : 'unauthorized',
    ACCESS_TOKEN_ISSUE_ERROR : 'Error issuing access token',
} as const

export const SERVICE_SERVICE_ERRORS = {
    SERVICE_NOT_FOUND : 'service not found',
    SERVICE_ALREADY_EXISTS : 'service already exists',
    SERVICE_TITLE_ALREADY_EXISTS : 'service title already exists',
    SERVICE_CREATION_FAILED : 'service creation failed',
    SERVICE_UPDATION_FAILED : 'service updation failed',
    SERVICE_ARCHIVING_FAILED : 'service archiving failed',
    INVALID_DATE_RANGE : 'Invalid date range',
} as const

export const BOOKING_SERVICE_ERRORS = { 
    BOOKING_NOT_FOUND : 'booking not found',
    BOOKING_ALREADY_EXISTS : 'booking already exists',  
} as const