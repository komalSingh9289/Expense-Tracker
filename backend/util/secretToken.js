import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

 const createSecretToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET_TOKEN,{
        expiresIn: 3 * 24 * 60 * 60 ,
    });
}

export default createSecretToken;