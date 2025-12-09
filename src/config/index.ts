import dotenv from 'dotenv'
dotenv.config();

interface Config  {
    REDIS_URL : string;
    CLIENT_URL : string;
    PORT : number;
    SERVICE_NAME : string;
    JWT_ACCESS_TOKEN_SECRET : string;
    JWT_REFRESH_TOKEN_SECRET : string;
    DATABASE_URL : string;
}

export const config : Config = {
    SERVICE_NAME : process.env.SERVICE_NAME!,
    REDIS_URL : process.env.REDIS_URL!,
    CLIENT_URL : process.env.CLIENT_URL!,
    PORT : Number(process.env.PORT),
    JWT_ACCESS_TOKEN_SECRET : process.env.JWT_ACCESS_TOKEN_SECRET!,
    JWT_REFRESH_TOKEN_SECRET : process.env.JWT_REFRESH_TOKEN_SECRET!,
    DATABASE_URL : process.env.DATABASE_URL!,
}