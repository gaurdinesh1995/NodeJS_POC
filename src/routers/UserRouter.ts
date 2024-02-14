import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";

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
      this.router.get('/send/verification/email',UserValidators.resendVerificationEmail(),GlobalMiddleware.checkError,UserController.resendVerificationEmail)

    }
    postRoutes(){
    this.router.post('/signup',UserValidators.singnUp(),GlobalMiddleware.checkError, UserController.signUp);
    }
    patchRoutes(){
      this.router.patch('/verify',UserValidators.verifyUser(),GlobalMiddleware.checkError,UserController.verify)
    }
    deleteRoutes(){

    }
}

export default new USerRouter().router