import mongoose, { Schema } from "mongoose";

const HackOwnCollegeSchema = new mongoose.Schema({
    // username : if login kara hua hai to pahle se hoga and each menber have to register individually
    // participation : individual or team
    // team size : 1, 2, 3,4 ( max 4 members)
    // team name
    // Team member names 
    // wallet address
    
})

export const HackathonRegister= mongoose.model("HackOwnCollegeReg", HackOwnCollegeSchema);