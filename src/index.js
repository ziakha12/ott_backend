import { app } from "./app.js";
import { dbConnect } from "./db/index.js";
import dotenv from 'dotenv';

dotenv.config({
    path : './.env'
})
const Port =  8000

dbConnect().then(()=>{
    app.on('error' , (error)=>{
        console.log('error in app.on index.js' , error);
    })
    app.listen(Port , ()=>{
        console.log(`app is runing on ${Port}`);
        
    })
})
.catch((err)=>{
    console.log('error in index.js dbConnect' , err.message);
    
})