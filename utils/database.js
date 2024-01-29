import mongoose from "mongoose";

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
        useNewURlParser: true,
        useUnifiedTopology: true,
    })
    isConneted=true;
    console.log('Mongodb Connected');
}
catch(err){
    console.log(err)
}
}
