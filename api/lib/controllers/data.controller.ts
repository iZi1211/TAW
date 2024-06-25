import { Request, Response, NextFunction, Router } from 'express';
import Joi from 'joi';
import DataService from '../modules/services/data.service';
import mongoose from 'mongoose';

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class DataController {
    public path = '/api';
    public router = Router();
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get(`${this.path}/posts`, this.getPosts);
        this.router.post(`${this.path}/post`, this.addPost);
        this.router.get(`${this.path}/post/:id`, this.getById);
        this.router.delete(`${this.path}/:id`, this.removePost);
        this.router.get(`${this.path}/getById/:id`, this.getById);
        this.router.delete(`${this.path}/deleteById/:id`, this.deleteById);
        this.router.delete(`${this.path}/deleteAllPosts`, this.deleteAllPosts);
    }

    private validateObjectId(id: string): boolean {
        return mongoose.Types.ObjectId.isValid(id);
    }

    private getPosts = async (req: Request, res: Response, next: NextFunction) => {
        const { num } = req.params;

        try {
            let allPosts = await this.dataService.getAllPosts();

            if (num !== undefined) {
                allPosts = allPosts.slice(0, parseInt(num));
            }
            res.status(200).json(allPosts);
        } catch (error) {
            console.error('Failed pulling posts:', error);
            res.status(500).send('Internal server error');
        }
    }

    private addPost = async (request: Request, response: Response, next: NextFunction) => {
        const { title, text, image } = request.body;
        const schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().uri().required()
        });

        try {
            const validateData = await schema.validateAsync({ title, text, image });
            await this.dataService.createPost(validateData);
            response.status(200).json(validateData);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    }

    private getElementById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        console.log(id)

        try {
            const post = await this.dataService.query({ _id: id });
            res.status(200).json(post);
        } catch (error) {
            console.error('Failed pulling posts:', error);
            res.status(500).send('Internal server error');
        }
    }

    private removePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        await this.dataService.deleteData({ _id: id });
        response.sendStatus(200);
    };
    private getById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        if (!this.validateObjectId(id)) {
            response.status(400).json({ error: 'Invalid ID format' });
            return;
        }

        try {
            const data = await this.dataService.getById(id);
            if (!data) {
                response.status(404).json({ error: 'Data not found.' });
                return;
            }
            response.status(200).json(data);
        } catch (error) {
            console.error(`Error getting data by ID: ${error.message}`);
            response.status(500).json({ error: 'Internal server error.' });
        }
    }

    private deleteById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        try {
            await this.dataService.deleteById(id);
            response.sendStatus(200);
        } catch (error) {
            console.error(`Error deleting data by ID: ${error.message}`);
            response.status(404).json({ error: 'Data not found.' });
        }
    }

    private deleteAllPosts = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.dataService.deleteAllPosts();
            response.sendStatus(200);
        } catch (error) {
            console.error(`Error deleting all posts: ${error.message}`);
            response.status(500).json({ error: 'Internal server error.' });
        }
    }
        
}

export default DataController;
