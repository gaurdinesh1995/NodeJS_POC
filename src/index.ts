import * as express from  'express';
import * as mongoose from 'mongoose'
import { getEnvironmentVariables } from './environments/env';

let app:express.Application = express();

app.listen(6000,()=>{
    console.log("Server is running on port 6000");
})

mongoose.connect(getEnvironmentVariables().db_url).then(()=>{
    console.log("db connected")
})

app.get('/login',(req,res)=>{
    const data={first_name:'Dinesh',last_name:'Gaur'}
    res.send(data)
})

app.get('/test',(req,res)=>{
    res.send("this is a test request")
})