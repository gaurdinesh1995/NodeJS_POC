import { validationResult } from "express-validator";
import User from "../models/User";
import { Utils } from "../utils/Utils";
export class UserController {
  static async signUp(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const data = {
      email: email,
      password: password,
      username: username,
      verification_token: Utils.generateVerificationToken(),
      verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
    };
    try {
      let user = await new User(data).save();
      // send verification email
      res.send(user);
    } catch (error) {
      next(error);
    }
  }

  static async verify(req, res, next) {
    const verificationToken = req.body.verification_token;
    const email = req.body.email;
    try{
     const user = await User.findOneAndUpdate({
        email: email,
        verification_token: verificationToken,
        verification_token_time: { $gt: Date.now()},
      },{verified:true},{new: true});
      if(user){
      res.send(user)
      }else{
        throw new Error("Verificaiton token is expired,Please request for new one")
      }
    }catch(error){
      next(error)
    }
  }
}
