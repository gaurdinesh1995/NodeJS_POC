import { validationResult } from "express-validator";
import User from "../models/User";
import { Utils } from "../utils/Utils";
import { Nodemailer } from "../utils/Nodemailer";
import * as bcrypt from 'bcrypt';
export class UserController {
  static async signUp(req, res, next) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const verificationToken = Utils.generateVerificationToken();
    try {
        const hash = await Utils.encryptPassword(password);
        const data = {
            email: email,
            password: hash,
            username: username,
            verification_token: verificationToken,
            verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
            created_at: new Date(),
            updated_at: new Date()
        };
        let user = await new User(data).save();
        res.send(user);
        await Nodemailer.sendEmail({
            to: [data.username], subject: 'Email Verification',
            html: `<h1>${verificationToken}</h1>`
        })
    } catch (e) {
        next(e);
    }
}

  static async verify(req, res, next) {
    const verificationToken = req.body.verification_token;
    const email = req.body.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verificationToken,
          verification_token_time: { $gt: Date.now() },
        },
        { verified: true },
        { new: true }
      );
      if (user) {
        res.send(user);
      } else {
        throw new Error(
          "Verificaiton token is expired,Please request for new one"
        );
      }
    } catch (error) {
      next(error);
    }
  }
  static async resendVerificationEmail(req, res, next) {
    const email = req.query.email;
    const verificationToken = Utils.generateVerificationToken();
    try {
        const user: any = await User.findOneAndUpdate({email: email}, {
            verification_token: verificationToken,
            verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
        });
        if (user) {
             await Nodemailer.sendEmail({
                to: [user.email], subject: 'Email Verification',
                html: `<h1>${verificationToken}</h1>`
            });
            res.json({success: true})
        } else {
            throw  Error('User Does Not Exist');
        }
    } catch (e) {
        next(e);
    }
}
}
