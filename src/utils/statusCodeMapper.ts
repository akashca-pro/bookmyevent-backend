import { AUTH_SERVICE_ERRORS, BOOKING_SERVICE_ERRORS, SERVICE_SERVICE_ERRORS } from "@/const/ErrorTypes.const";
import HTTP_STATUS, { HttpStatusCode } from "./httpStatusCodes";

export const errorStatusCodeMapper = (message : string) : HttpStatusCode => {
    switch(true){
        case message === SERVICE_SERVICE_ERRORS.SERVICE_NOT_FOUND:
        case message === AUTH_SERVICE_ERRORS.USER_NOT_FOUND:
        case message === BOOKING_SERVICE_ERRORS.BOOKING_NOT_FOUND:
            return HTTP_STATUS.NOT_FOUND
        
        case message === SERVICE_SERVICE_ERRORS.SERVICE_CREATION_FAILED:
        case message === SERVICE_SERVICE_ERRORS.SERVICE_ARCHIVING_FAILED:
        case message === SERVICE_SERVICE_ERRORS.SERVICE_UPDATION_FAILED:
        case message === AUTH_SERVICE_ERRORS.ACCESS_TOKEN_ISSUE_ERROR:
        case message === BOOKING_SERVICE_ERRORS.BOOKING_FAILED:
        case message === BOOKING_SERVICE_ERRORS.CANCELLATION_FAILED:
            return HTTP_STATUS.UNPROCESSABLE_ENTITY
        
        case message === SERVICE_SERVICE_ERRORS.SERVICE_ALREADY_EXISTS:
        case message === SERVICE_SERVICE_ERRORS.SERVICE_HAS_BOOKINGS:
        case message === SERVICE_SERVICE_ERRORS.SERVICE_TITLE_ALREADY_EXISTS:
        case message === BOOKING_SERVICE_ERRORS.BOOKING_ALREADY_EXISTS:
        case message === AUTH_SERVICE_ERRORS.USER_ALREADY_EXISTS:
            return HTTP_STATUS.CONFLICT

        case message === AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS:
        case message === SERVICE_SERVICE_ERRORS.INVALID_DATE_RANGE:
        case message === SERVICE_SERVICE_ERRORS.SERVICE_OUTSIDE_AVAILABILITY:
            return HTTP_STATUS.BAD_REQUEST

        default :
            return HTTP_STATUS.INTERNAL_SERVER_ERROR       
    }
}