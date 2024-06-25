import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from "../modules/models/user.model";

export const auth = (request: Request, response: Response, next: NextFunction) => {
  
    let token = request.headers['x-auth-token'] || request.headers['authorization'];
    if (token && typeof token === 'string') {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        jwt.verify(token, config.JwtSecret, (err, decoded) =>{
            if (err) {
                return response.status(400).send('Invalid token.'); // Send response on error
            }
            const user: IUser = decoded as IUser;

            next();
        });
    } else {
        return response.status(401).send('Access denied. No token provided.');
    }
};