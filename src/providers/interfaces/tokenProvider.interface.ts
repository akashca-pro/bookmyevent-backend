import { ITokenPayLoad } from "@/types/token.type";

/**
 * Interface for generating access token.
 * 
 * @interface
 */
export interface ITokenProvider {
    generateAccessToken(payload : ITokenPayLoad) : string;
}

