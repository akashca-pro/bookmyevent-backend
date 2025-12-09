/**
 * Data Transfer Object (DTO) representing Token payload.
 *
 * @interface
 */
export interface ITokenPayLoad {
    /**
     * The id of the user.
     */
    userId : string;

    /**
     * The email address of the user for authentication.
     */
    email : string;

    /**
     * The name of the user
     */
    name? : string;

    /**
     * The role of the user.
     */
    role : string;
}
