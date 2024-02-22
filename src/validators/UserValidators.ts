import { body, query } from "express-validator";
import User from "../models/User";

export class UserValidators {
  static singnUp() {
    return [
      body("email", "Email is required")
        .isEmail()
        .custom((email) => {
         return User.findOne({ email: email }).then((user) => {
            if (user) {
              throw new Error("User already exist");
            } else {
              return true;
            }
          });
        }),
      body("password", "password is requried")
        .isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be 8-20 characters long"),
      body("username", "Username is requried").isString(),
    ];
  }
  static verifyUser(){
    return[
      body("verification_token","Verification token is required").isNumeric(),
      body("email","Email is required").isEmail()
    ]
  }

  static resendVerificationEmail() {
    return [query('email','email is required').isEmail()]
}
static login() {
  return [query('email', 'Email is Required').isEmail()
      .custom((email, {req}) => {
          return User.findOne({email: email}).then(user => {
              if (user) {
                  req.user = user;
                  return true;
              } else {
                  throw  new Error('User Does Not Exist');
              }
          });
      }), query('password', 'Password is Required').isAlphanumeric()]
}
}
