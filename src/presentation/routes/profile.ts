import express from 'express';

export const profileRouter = express.Router();

profileRouter.get(
    '/me'
)