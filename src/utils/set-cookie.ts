import { Response } from "express";
import ms from "ms";
import dotenv from 'dotenv'
dotenv.config();

// Helper function to get consistent cookie options based on environment
export const getCookieOptions = () => {
    // In development/HTTP, secure must be false. In production/HTTPS, secure should be true
    const isProduction = process.env.NODE_ENV === 'production';
    const secure = isProduction;
    // sameSite: "none" requires secure: true. Use "lax" for HTTP/development
    const sameSite = secure ? ("none" as const) : ("lax" as const);
    // Domain should be undefined for localhost/development, or set for production
    const domain = isProduction ? (process.env.domain ?? undefined) : undefined;
    
    return {
        httpOnly: true,
        secure: secure,
        sameSite: sameSite,
        domain: domain,
        path: "/",
    };
};

export const setCookie = (
    res : Response,
    key : string,
    value : string, 
    maxAge : ms.StringValue
    ) : void => {
    res.cookie(key, value, {
        ...getCookieOptions(),
        maxAge: ms(maxAge), 
    })
}