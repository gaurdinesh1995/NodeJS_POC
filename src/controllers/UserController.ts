import User from '../models/User';
import {Utils} from '../utils/Utils';
import {Nodemailer} from '../utils/Nodemailer';
import * as Jwt from 'jsonwebtoken';
import {getEnvironmentVariables} from '../environments/env';

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
                to: ['shagungarg2010@gmail.com'], subject: 'Email Verification',
                html: `<h1>${verificationToken}</h1>`
            })
        } catch (e) {
            next(e);
        }
    }

    static async verify(req, res, next) {
        const verificationToken = req.body.verification_token;
        const email = req.user.email;
        try {
            const user = await User.findOneAndUpdate({
                email: email, verification_token: verificationToken,
                verification_token_time: {$gt: Date.now()}
            }, {verified: true, updated_at: new Date()}, {new: true});
            if (user) {
                res.send(user);
            } else {
                throw new Error('Verification Token Is Expired.Please Request For a new One');
            }
        } catch (e) {
            next(e);
        }
    }

    static async resendVerificationEmail(req, res, next) {
        const email = req.user.email;
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
                throw new Error('User Does Not Exist');
            }
        } catch (e) {
            next(e);
        }
    }

    static async login(req, res, next) {
        const password = req.query.password;
        const user = req.user;
        try {
            await Utils.comparePassword({
                plainPassword: password,
                encryptedPassword: user.password
            });
            const token = Jwt.sign({email: user.email, _id: user._id},
                getEnvironmentVariables().db_url, {expiresIn: '120d'});
            const data = {token: token, user: user};
            res.json(data);
        } catch (e) {
            next(e);
        }
    }
}
