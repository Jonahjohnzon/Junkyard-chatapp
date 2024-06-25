const express = require("express")
const {room} = require("./Schema/Schema")
const app = express()
const mongoose = require('./mongo')
const http = require("http")
const cors = require('cors')
const router = require('./Routes/routes')
const server = http.createServer(app)
require('dotenv').config();
const io = require("socket.io")(server,{
    cors:{
        origin:"*",
        method:["GET","POST"]
    }
})
mongoose()
app.use(cors())
app.use('/',router)

io.on("connection",(socket)=>{
    socket.on("connectid",()=>{
        socket.emit("idsocket", socket.id);
})


    socket.on("join_room",async(rom)=>{
            socket.join(rom)
            const result = await room.findOne({_id:rom})
            if(!result)
            {
                return
            }
            else{
            if(result.users.length == 2)
            {
            io.to(rom).emit("room_joined", {join:true,users:result.users, interest:result.interest});
            }
            if(result.users.length == 1)
            {
            io.to(rom).emit("room_joined", {join:false,users:result.users});
            }
            }
       
    })
    socket.on("send_message", (message) =>{
    if(message?.filedata)
    {
        io.to(message.room).emit("receive_message", {m:message.filedata.msg, user:message.filedata.id, filedata:message.filedata})  
    }
    else{
    io.to(message.room).emit("receive_message", {m:message.msg, user:message.id, filedata:""})
    }
    })
    
    socket.on("callUser", (data) => {
        socket.to(data.userToCall).emit("callUser", {
          signal: data.signalData,
          from: data.userToCall,
        });
      });
    
      socket.on("answerCall", (data) => {
        socket.to(data.to).emit("callAccepted", data.signal);
      });

      socket.on("typing", (data) => {
        socket.to(data.room).emit("typing", data.type);
      });


    socket.on("disconnect",async()=>{
        const result = await room.findOne({ users: { $in: [socket.id] } })
        if(!result)
        {
            return
        }
        else{

            
                await room.deleteOne({_id:result._id})
                io.to(String(result._id)).emit("left_partner",{left:true})
        }
     

    })
})

server.listen(3000,()=>{
    console.log("listening")
})
