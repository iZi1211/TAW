import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import UserService from "../modules/services/user.service";
import MailService from "../modules/services/mail.service";
import { auth } from "../middlewares/auth.middleware";
import { admin } from "../middlewares/admin.middleware";
import { forbidden } from "joi";
import { token } from "morgan";


class UserController implements Controller {
    path: string = '/api/user';
    router: Router = Router();
    passwordService: PasswordService = new PasswordService();
    tokenService: TokenService = new TokenService();
    userService: UserService = new UserService();
    mailService: MailService = new MailService();

    clearTokensTimer : any;

    constructor() {
        this.initializeRouters();
        this.clearTokensTimer = setInterval(this.deleteExpiredTokens, 1000 * 60 * 15);

    }

    private initializeRouters() {
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);
        this.router.post(`${this.path}/reset-password`, this.resetPassword);
        this.router.post(`${this.path}/all`, admin, this.getAllUsers);
        
    }

    private resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const {email} = req.body;

        try {
            const user = await this.userService.getByEmailOrName(email);

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            const newPassword = (Math.random() + 1).toString(36).substring(7);
            console.log(newPassword);

            await this.passwordService.createOrUpdate({userId: user._id, password: await this.passwordService.hashPassword(newPassword)})

           
            res.status(201).json({email: email, newPassword: newPassword})
            
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            res.status(500).json({ error: 'Error occured while reseting password' });
        }
    }

    private removeHashSession = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params

        console.log(userId);
        

        try {
            const result = await this.tokenService.remove(userId);
            res.status(200).send(result);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            res.status(401).json({ error: 'Unauthorized' });
        }
    }

    private authenticate = async (req: Request, res: Response, next: NextFunction) => {
        const { login, password } = req.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                res.status(401).json({ error: 'User Not found' });
                return;
            }

            const authorized = await this.passwordService.authorize(user.id, password);

            if(!authorized) {
                res.status(401).json({message: "Invalid password"});
                return;
            }

            const token = await this.tokenService.create(user);
            res.status(200).json(this.tokenService.getToken(token));
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            res.status(500).json({ error: 'UNKNOWN ERROR' });
        }
    }
    private createNewOrUpdate = async (req: Request, res: Response, next: NextFunction) => {
        const userData = req.body;
        try {
            const user = await this.userService.createNewOrUpdate(userData);
            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password)
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword
                });
            }

           
            await this.mailService.sendMail(
                user.email,
                'Welcome to Our App',
                'Thank you for registering with our app!'
            );

            res.status(200).json(user);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            res.status(400).json({ error: 'Bad request', value: error.message });
        }
    }

    private getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAll();
            
            res.status(200).json({users: users});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({message: "Error occured"});
        }
    }

    private deleteExpiredTokens = async () => {
        try {
            const tokens = await this.tokenService.getAll();
            let TokensDeleted = 0

            tokens.forEach(async (token) => {
                const isExpired = await this.tokenService.isExpired(token);

                if(isExpired) {
                    this.tokenService.removeByTokenId(token._id);
                    TokensDeleted++;
                }                    
            });
            console.info(`[${TokensDeleted}] Tokens Deleted`);
        } catch {
            console.error("CANT CLEAR TOKENS");
        }
    }
}

export default UserController;