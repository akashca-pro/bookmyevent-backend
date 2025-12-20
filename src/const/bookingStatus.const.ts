export const BOOKING_STATUS = {
    CONFIRMED : 'confirmed',
    CANCELLED : 'cancelled',
    PENDING : 'pending',
    EXPIRED : 'expired'
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS]