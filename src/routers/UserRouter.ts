import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";

export class USerRouter{
    public router:Router;

    constructor(){
      this.router = Router();
      this.getRoutes();
      this.postRoutes();
      this.patchRoutes();
      this.deleteRoutes();
    }

    getRoutes(){
       this.router.get('/login',UserValidators.login(), UserController.login)
    }
    postRoutes(){

    }
    patchRoutes(){

    }
    deleteRoutes(){

    }
}

export default new USerRouter().router