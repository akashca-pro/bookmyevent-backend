import express from 'express';

export const adminRouter = express.Router();

adminRouter.use(
    '/users'
)