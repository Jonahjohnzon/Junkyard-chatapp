const {room} = require('../Schema/Schema')
const cron = require('node-cron');


cron.schedule('0 0 * * *', async () => { 
    try {
      const oneDayAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
      await room.deleteMany({
        createdAt: { $lt: oneDayAgo },
      });
    } catch (error) {
      console.error('Error deleting:', error);
    }
  });

const getRoom = async(req, res)=>{
try{
    const category = req.query.category
    const interest = req.query.interest.toLowerCase()
    const id = req.params.id
    let inte;
    let interests = false;
    if(interest == 'optional')
    {
        inte = ""
    }
    else{      
        inte = interest
    }
    let data;
    if(inte == "")
    {
    data = await room.aggregate([
        { $match: { state: "waiting", users: { $size: 1 }, category: category  } },
        { $sample: { size: 1 } }
      ])
    }
    else{
        data = await room.aggregate([
            { $match: { state: "waiting", users: { $size: 1 }, category: category , interest: inte } },
            { $sample: { size: 1 } }
          ])
         
        if(data.length == 0)
        {
            data = await room.aggregate([
                { $match: { state: "waiting", users: { $size: 1 }, category: category  } },
                { $sample: { size: 1 } }
              ])
        } 
        else{
            interests = true
        }
    
    }
    
    if(data.length == 0){
        const newroom = await room.create({
            state:"waiting",
            users: [id],
            category:category,
            interest:inte
        })
        await newroom.save()
        return res.json({mgs:"newroom create", data:newroom})
    }
    else{
        if(interests)
        {
        const roomId = data[0]._id;
        await room.updateOne({ _id: roomId }, { $set: { state: "chatting" , category: category, interest:inte}, $push: { users: id } });
        const updatedRoom = await room.findById(roomId);
        return res.json({mgs:"existing room", data:updatedRoom})
        }
        else{
            const roomId = data[0]._id;
            await room.updateOne({ _id: roomId }, { $set: { state: "chatting" , category: category, interest:""}, $push: { users: id } });
            const updatedRoom = await room.findById(roomId);
            return res.json({mgs:"existing room", data:updatedRoom}) 
        }
    }
}
catch(err){
    console.log(err)
}
}

const findRoom = async(req, res)=>{
    const no = await room.find({state: "chatting"});
    const one = await room.find({state: "waiting"});
    const length = no.length * 2
    const tot = length + one.length
    res.json(tot)
}

module.exports = {getRoom, findRoom}
