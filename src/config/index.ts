import dotenv from 'dotenv'
dotenv.config();

interface Config  {
    REDIS_URL : string;
    CLIENT_URL : string;
    PORT : number;
    SERVICE_NAME : string;
    JWT_ACCESS_TOKEN_SECRET : string;
    JWT_ACCESS_TOKEN_EXPIRY : string;
    DATABASE_URL : string;
    PROFILE_CACHE_EXPIRY : number;
    SERVICE_CACHE_EXPIRY : number;
    BOOKING_CACHE_EXPIRY : number;
    SWAGGER_URL_DEV : string;
    SWAGGER_URL_PROD : string;
    CLOUDINARY_CLOUD_NAME : string;
    CLOUDINARY_API_KEY : string;
    CLOUDINARY_API_SECRET : string;
}

export const config : Config = {
    SERVICE_NAME : process.env.SERVICE_NAME!,
    REDIS_URL : process.env.REDIS_URL!,
    CLIENT_URL : process.env.CLIENT_URL!,
    PORT : Number(process.env.PORT),
    JWT_ACCESS_TOKEN_SECRET : process.env.JWT_ACCESS_TOKEN_SECRET!,
    JWT_ACCESS_TOKEN_EXPIRY : process.env.JWT_ACCESS_TOKEN_EXPIRY!,
    DATABASE_URL : process.env.DATABASE_URL!,
    PROFILE_CACHE_EXPIRY : Number(process.env.PROFILE_CACHE_EXPIRY),
    SERVICE_CACHE_EXPIRY : Number(process.env.SERVICE_CACHE_EXPIRY),
    BOOKING_CACHE_EXPIRY : Number(process.env.BOOKING_CACHE_EXPIRY),
    SWAGGER_URL_DEV : process.env.SWAGGER_URL!,
    SWAGGER_URL_PROD : process.env.SWAGGER_URL!,
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET!,
}