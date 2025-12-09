import dotenv from 'dotenv'
dotenv.config();

interface Config  {
    REDIS_URL : string;
    CLIENT_URL : string;
    PORT : number;
    SERVICE_NAME : string;
}

export const config : Config = {
    SERVICE_NAME : process.env.SERVICE_NAME!,
    REDIS_URL : process.env.REDIS_URL!,
    CLIENT_URL : process.env.CLIENT_URL!,
    PORT : Number(process.env.PORT),
}