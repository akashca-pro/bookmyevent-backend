import { NextFunction, Request, Response } from "express";


export const authController = {
    
    signup : (req : Request, res : Response, next : NextFunction) => {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}