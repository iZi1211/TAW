import App from './app';
import IndexController from "./controllers/index.controller";
import DataController from "./controllers/data.controller";
import UserController from "./controllers/user.controller";

const app: App = new App([
   new UserController(),
   new IndexController(),
   new DataController()
]);

app.listen();