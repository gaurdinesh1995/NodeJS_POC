import * as express from "express";
import { getEnvironmentVariables } from "./environments/env";
import mongoose from "mongoose";
import UserRouter from "./routers/UserRouter";
import bodyParser = require("body-parser");

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfiguration();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  setConfiguration() {
    this.connectMongoDB();
    this.configureBodyParser();
  }

  connectMongoDB() {
    const databaseUrl = getEnvironmentVariables().db_url;
    mongoose.connect(databaseUrl).then(() => {
      console.log("database connected");
    });
  }

  configureBodyParser(){
    this.app.use(bodyParser.urlencoded({extended:true}))
  }

  setRoutes() {
    this.app.use("/api/user", UserRouter);
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Route not found",
        status_code: 404,
      });
    });
  }

  handleErrors() {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message || "Internal server error",
        status_code: errorStatus,
      });
    });
  }
}
