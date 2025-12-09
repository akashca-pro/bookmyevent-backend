import { ITokenProvider } from "@/providers/interfaces/TokenProvider.interface";
import { config } from "@/config";
import { ITokenPayLoad } from "@/types/token.type";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

/**
 * Provider for managing authentication tokens.
 * 
 * @class
 * @implements {ITokenProvider}
 */
export class JwtTokenProvider implements ITokenProvider {

  private _accessSecret: Secret = config.JWT_ACCESS_TOKEN_SECRET;
  private _accessExpiry = config.JWT_ACCESS_TOKEN_EXPIRY;

  generateAccessToken(payload: ITokenPayLoad): string {
    return jwt.sign(payload, this._accessSecret, {
      expiresIn: this._accessExpiry
    } as SignOptions);
  }
}

