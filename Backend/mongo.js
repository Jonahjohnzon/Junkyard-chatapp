const mongo = require("mongoose")

const mongoosedb = async()=>{
    try{
        const con = await mongo.connect("mongodb+srv://jonahjohnzon:JOHNZON123@room.0f6dfb9.mongodb.net/?retryWrites=true&w=majority&appName=Room")
        console.log(`Mongo Connect: ${con.connection.host}`)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = mongoosedb
