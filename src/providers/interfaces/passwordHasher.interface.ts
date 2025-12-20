/**
 * Interface for hashing and comparing passwords. 
 *
 * @interface
 */
export interface IPasswordHasher {
    hashPassword(password : string) : Promise<string>;
    comparePasswords(password : string, hashedPassword : string) : Promise<boolean>;
}