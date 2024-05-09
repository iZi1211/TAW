import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import DataService from '../modules/services/data.service';
import Joi from 'joi';

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class DataController {
    public path = '/api/data';
    public router = Router();
    private dataService: DataService;

    constructor() {
    this.dataService = new DataService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/add`, this.addData);
        this.router.get(`${this.path}/:id`, this.getElementById);
        this.router.delete(`${this.path}/:id`, this.removePost);
        this.router.get(`${this.path}/getById/:id`, this.getById);
        this.router.delete(`${this.path}/deleteById/:id`, this.deleteById);
        this.router.delete(`${this.path}/deleteAllPosts`, this.deleteAllPosts);

    }

    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.status(200).json(testArr);
        } catch (error) {
            next(error);
        }
    };

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { title, text, image } = request.body;
        const schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().uri().required()
         });

        try {
            const validateData = await schema.validateAsync({title, text, image});
            await this.dataService.createPost(validateData);
            response.status(200).json(validateData);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    }

    private getElementById = async (request: Request, response: Response, next: NextFunction) => {
       const { id } = request.params;
       const allData = await this.dataService.query({_id: id});
       response.status(200).json(allData);
    }

    private removePost = async (request: Request, response: Response, next: NextFunction) => {
       const { id } = request.params;
       await this.dataService.deleteData({_id: id});
       response.sendStatus(200);
    };

     private getById = async (request: Request, response: Response, next: NextFunction) => {
            const { id } = request.params;
            try {
                const data = await this.dataService.getById(id);
                response.status(200).json(data);
            } catch (error) {
                console.error(`Error getting data by ID: ${error.message}`);
                response.status(404).json({ error: 'Data not found.' });
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
