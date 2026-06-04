import mongoose from "mongoose";
// Register models so .populate("creator") works on any route that connects to the DB.
// (Without this, routes that only import Prompt throw MissingSchemaError for "User".)
import "@models/user";
import "@models/prompt";

let isConneted = false
export const connectToDB = async ()=>{
mongoose.set('strictQuery',true);
if (isConneted){
    console.log('Mongodb Connected');
    return;
}
try{
    await mongoose.connect(process.env.MONGODB_URL,{
        dbName:'share_prompt',
    })
    isConneted=true;
    console.log('Mongodb Connected');
}
catch(err){
    console.log(err)
}
}
