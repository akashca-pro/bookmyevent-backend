export interface CustomJwtPayload {
    userId : string;
    username? : string;
    email : string;
    role : string;
    tokenId : string;
    exp : number;
    iat : number;
}