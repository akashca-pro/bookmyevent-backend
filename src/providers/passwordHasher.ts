import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '@/providers/interfaces/passwordHasher.interface';

/**
 * Implementation of the password hashing provider using bcrypt.
 * 
 * @class
 * @implements {IPasswordHasher}
 */
export class BcryptPasswordHasher implements IPasswordHasher {
    private readonly _saltRounds: number;

    constructor(saltRounds: number = 10) {
        this._saltRounds = saltRounds
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this._saltRounds)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    async comparePasswords(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }
}