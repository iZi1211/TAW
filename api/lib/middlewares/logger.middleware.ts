import { NextFunction, Request, RequestHandler, Response } from "express";

const logger : RequestHandler = (req : Request, res: Response, next : NextFunction) => {
    console.log(`[${req.method} ${req.url} ${new Date().toISOString()}]`);
    next();
}

export {logger};